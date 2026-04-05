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
});

// Helper: Decide if question needs AI
function shouldUseAI(message) {
  const text = message.toLowerCase();
  const triggers = ["how", "why", "can i", "should i", "normal", "safe", "symptom", "period", "cramp"];
  return triggers.some(word => text.includes(word)) || text.length > 20;
}

// Helper: Fast replies for greetings
function getRuleBasedReply(message) {
  const text = message.toLowerCase().trim();
  if (["hi", "hello", "hey"].includes(text)) return "Hello! I’m your CycleCare assistant. How can I help you today? 😊";
  if (text.includes("how are you")) return "I'm doing great, thank you for asking! Ready to help with any menstrual health questions.";
  return null;
}

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!userMessage) return res.status(400).json({ reply: "Please type a message." });

    console.log("📩 Incoming:", userMessage);

    // 1. Check Rule-Based First
    const ruleReply = getRuleBasedReply(userMessage);
    if (ruleReply && !shouldUseAI(userMessage)) {
      return res.json({ reply: ruleReply });
    }

    // 2. Call AI (Llama 3.2)
    try {
      const formattedHistory = history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text || "",
      }));

      const completion = await hf.chat.completions.create({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          { 
            role: "system", 
            content: "You are CycleCare, a supportive menstrual health chatbot. Provide safe, empathetic, and clear advice. Do not provide medical diagnoses. Suggest seeing a doctor for severe symptoms." 
          },
          ...formattedHistory,
          { role: "user", content: userMessage },
        ],
        max_tokens: 250,
        temperature: 0.7,
      });

      const aiReply = completion.choices?.[0]?.message?.content?.trim();
      if (aiReply) return res.json({ reply: aiReply });

    } catch (aiErr) {
      console.error("⚠️ AI Error:", aiErr.message);
    }

    // 3. Fallback
    return res.json({ reply: "I'm here to support you. Could you tell me a bit more about what's on your mind regarding your cycle or health?" });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Internal server error. Please try again later." });
  }
});

module.exports = router;