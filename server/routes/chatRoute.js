const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// 🛡️ Safety Check for Render Environment Variables
if (!process.env.HF_API_KEY) {
  console.error("❌ ERROR: HF_API_KEY is missing in Render Settings!");
}

const hf = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
  defaultHeaders: {
    "x-wait-for-model": "true" // This tells Hugging Face: "Wait for the server to wake up, don't just error out!"
  }
});

// Helper: Decide if question needs AI
function shouldUseAI(message) {
  const text = message.toLowerCase();
  const triggers = ["how", "why", "can i", "should i", "normal", "safe", "symptom", "period", "cramp", "what is"];
  // Added "what is" to triggers so "what is periods" definitely goes to AI
  return triggers.some(word => text.includes(word)) || text.length > 15;
}

// Helper: Fast replies for greetings
function getRuleBasedReply(message) {
  const text = message.toLowerCase().trim();
  const greetings = ["hi", "hello", "hey", "hola"];
  if (greetings.includes(text)) return "Hello! I’m your CycleCare assistant. How can I help you today? 😊";
  if (text.includes("how are you")) return "I'm doing great, thank you for asking! Ready to help with any menstrual health questions.";
  return null;
}

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!userMessage) return res.status(400).json({ reply: "Please type a message." });

    // 1. Check for Rule-Based Reply FIRST (Greetings)
    const ruleReply = getRuleBasedReply(userMessage);
    
    // ONLY return the rule reply if it's a short greeting. 
    // If they ask "Hi, what is a period?", it should skip this and go to AI.
    if (ruleReply && !shouldUseAI(userMessage)) {
      return res.json({ reply: ruleReply });
    }

    // 2. Call AI (Llama 3.2)
    try {
      const completion = await hf.chat.completions.create({
        model: "api-inference.huggingface.co/v1/",
        messages: [
          { 
            role: "system", 
            content: "You are CycleCare, a supportive menstrual health expert. Give clear, empathetic, and medically factual advice. Suggest seeing a doctor for severe pain." 
          },
          ...history.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text || "" })),
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7, // Adds a bit of "personality" to the AI
      });

      const aiReply = completion.choices?.[0]?.message?.content?.trim();
      if (aiReply) return res.json({ reply: aiReply });

    } catch (aiError) {
      console.error("⚠️ AI Error Details:", aiError.message);
      // Specific fallback for medical topics if AI is down
      if (userMessage.toLowerCase().includes("period")) {
        return res.json({ reply: "Sorry! I'm having a little trouble connecting to my AI brain" });
      }
    }

    // 3. Global Fallback
    return res.json({ reply: "I'm here to support you! Could you tell me a bit more about what's on your mind regarding your cycle or health?" });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ reply: "Internal server error. Please try again later." });
  }
});

module.exports = router;