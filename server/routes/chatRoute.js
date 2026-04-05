const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// 🛡️ Safety Check: This will show in your Render Logs if the key is missing
if (!process.env.HF_API_KEY) {
  console.error("❌ ERROR: HF_API_KEY is not defined in Environment Variables!");
}

const hf = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

// Decide if question needs AI
function shouldUseAI(message) {
  const text = message.toLowerCase();
  return (
    text.includes("how") || text.includes("why") ||
    text.includes("can i") || text.includes("should i") ||
    text.includes("what should") || text.includes("recommend") ||
    text.includes("safe") || text.includes("normal") ||
    text.includes("sex") || text.includes("medicine") ||
    text.includes("beginner") || text.includes("comfortable") ||
    text.length > 20 // If it's a long sentence, use AI
  );
}

// Simple rule-based replies
function getRuleBasedReply(message) {
  const text = message.toLowerCase().trim();
  if (["hi", "hello", "hey"].includes(text)) {
    return "Hello! I’m CycleCare support bot. How can I help you today?";
  }
  if (text.includes("how are you")) {
    return "I’m doing well 😊 I’m here to help you with menstrual health and support-related questions.";
  }
  return null;
}

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!userMessage) {
      return res.status(400).json({ reply: "Please type a message." });
    }

    console.log("📩 User Message:", userMessage);

    // Convert history → AI format
    const formattedHistory = history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text || "",
    }));

    // 1. Try Rule-Based first for simple greetings
    const ruleReply = getRuleBasedReply(userMessage);
    if (ruleReply && !shouldUseAI(userMessage)) {
      console.log("✅ Reply: Rule-based");
      return res.json({ reply: ruleReply });
    }

    // 2. Try AI (Llama 3.2)
    try {
      console.log("🤖 Calling AI...");
      const completion = await hf.chat.completions.create({
        model: "meta-llama/Llama-3.2-3B-Instruct", // ✨ STABLE MODEL
        messages: [
          {
            role: "system",
            content: "You are CycleCare, a supportive menstrual health chatbot. Give clear, safe, respectful answers. Do not diagnose diseases. Suggest a doctor if symptoms are severe.",
          },
          ...formattedHistory,
          { role: "user", content: userMessage },
        ],
        max_tokens: 250,
        temperature: 0.7,
      });

      const aiReply = completion.choices?.[0]?.message?.content?.trim();

      if (aiReply) {
        console.log("✅ Reply: AI Success");
        return res.json({ reply: aiReply });
      }
    } catch (aiErr) {
      console.error("⚠️ AI Error:", aiErr.message);
      // Fallback if AI fails
    }

    // 3. Final Fallback
    return res.json({
      reply: "I'm here to help! Could you please tell me a bit more about what you're looking for (periods, cramps, hygiene, etc.)?"
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

module.exports = router;