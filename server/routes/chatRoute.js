const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// 1. Corrected Connection
const hf = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1", // No trailing slash here
  apiKey: process.env.HF_API_KEY,
});

// 2. Helpers (Same as before)
function shouldUseAI(message) {
  const text = message.toLowerCase();
  const triggers = ["how", "why", "can i", "should i", "what should", "recommend", "safe", "normal", "sex", "medicine", "beginner", "comfortable", "what is", "period", "cramp"];
  return triggers.some(word => text.includes(word)) || text.length > 20;
}

function getRuleBasedReply(message) {
  const text = message.toLowerCase().trim();
  if (["hi", "hello", "hey"].includes(text)) return "Hello! I’m CycleCare support bot. How can I help you today? 😊";
  if (text === "how are you") return "I’m doing well! I’m here to help you with menstrual health and support-related questions.";
  return null;
}

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!userMessage) return res.status(400).json({ reply: "Please type a message." });

    // Step A: Check Rules
    const ruleReply = getRuleBasedReply(userMessage);
    if (ruleReply && !shouldUseAI(userMessage)) {
      return res.json({ reply: ruleReply });
    }

    // Step B: Call AI
    try {
      const completion = await hf.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.3", // MAKE SURE THIS IS HERE
        messages: [
          {
            role: "system",
            content: "You are CycleCare, a supportive menstrual health expert. Give clear, safe, respectful answers. Suggest seeing a doctor for severe pain.",
          },
          ...history.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text || "",
          })),
          { role: "user", content: userMessage },
        ],
        temperature: 0.6,
        max_tokens: 300,
      });

      const aiReply = completion.choices?.[0]?.message?.content?.trim();
      if (aiReply) return res.json({ reply: aiReply });

    } catch (err) {
      console.error("AI Error:", err.message);
      // Helpful fallback if AI is still being picky
      return res.json({ reply: "I'm having a little trouble thinking clearly right now, but I'm here! Are you asking about periods or symptoms? I can give you some general info while I reconnect." });
    }

  } catch (error) {
    res.status(500).json({ reply: "Server error. Please try again." });
  }
});

module.exports = router;