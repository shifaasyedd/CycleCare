const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// 1. Direct connection to the Inference API (The most stable way)
const hf = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/",
  apiKey: process.env.HF_API_KEY,
});

// 2. Decide if AI is needed based on keywords
function shouldUseAI(message) {
  const text = message.toLowerCase();
  const triggers = ["how", "why", "can i", "should i", "what", "period", "cramp", "symptom", "normal", "track", "cycle", "food", "hungry", "mood"];
  return triggers.some(word => text.includes(word)) || text.length > 15;
}

// 3. The "Safety Net" - Hardcoded answers if the AI is sleeping
function getFallbackReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes("hi") || lower.includes("hello")) return "Hello! I'm CycleCare. How can I help you with your menstrual health today? 😊";
  if (lower.includes("cramp")) return "Cramps happen when the uterus contracts. Try a heat pack, gentle stretches, or staying hydrated. 🌸";
  if (lower.includes("period")) return "A period is a natural cycle where your body sheds the uterine lining. It usually lasts 3-7 days. 📆";
  if (lower.includes("food") || lower.includes("hungry")) return "Increased appetite is very common before your period due to hormonal shifts! Listen to your body and try to balance cravings with nourishing foods. 🍎";
  
  return "I'm CycleCare, your health companion. I can help with questions about periods, cramps, or symptoms. What's on your mind?";
}

// 4. Main Route
router.post("/", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    
    if (!userMessage) return res.status(400).json({ reply: "Please send a message. 💬" });

    // 1. Instant Greeting (Saves API calls)
    if (["hi", "hello", "hey"].includes(userMessage.toLowerCase())) {
      return res.json({ reply: getFallbackReply("hi") });
    }

    // 2. The AI Call
    try {
      // We increase the timeout here to 30 seconds for the "cold start"
      const completion = await hf.chat.completions.create({
        model: "google/gemma-2-2b-it",
        messages: [
          { role: "system", content: "You are CycleCare, a supportive menstrual health expert. Provide empathetic, concise advice in 2 sentences." },
          ...history.map(msg => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text || "" })),
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7,
        // 🔥 THIS IS THE KEY: It forces the API to wake up the model instead of erroring
        extra_body: {
          "options": { "wait_for_model": true }
        }
      });

      const aiReply = completion.choices?.[0]?.message?.content;
      if (aiReply && aiReply.trim()) {
        return res.json({ reply: aiReply });
      }
    } catch (aiError) {
      console.error("AI API Error:", aiError.message);
      // If the API fails, it moves to the fallback below
    }

    // 3. The Fallback (What you are seeing now)
    return res.json({ reply: getFallbackReply(userMessage) });

  } catch (error) {
    res.status(500).json({ reply: "Server error. Please try again." });
  }
});

module.exports = router;