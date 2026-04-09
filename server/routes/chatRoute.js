const express = require("express");
const router = express.Router();
const axios = require("axios");

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "meta-llama/Llama-3.2-3B-Instruct";

// Your existing fallback logic, which is good to keep
function getFallbackReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes("scared") || lower.includes("afraid")) {
    return "It's completely normal to feel scared or nervous about periods. 💜 They are a natural part of growing up, and you're not alone. Would you like me to explain what happens so it feels less scary?";
  }
  if (lower.includes("what are you")) {
    return "I'm CycleCare, an AI assistant designed to support you with menstrual health questions. I'm here to listen and help without judgment. 😊";
  }
  if (lower.includes("hi") || lower.includes("hello")) {
    return "Hello! I'm CycleCare. How can I help you with your menstrual health today? 😊";
  }
  // Add more fallbacks as needed
  return "I'm here for you. Tell me more about what's on your mind. 💬";
}

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();
    if (!userMessage) {
      return res.status(400).json({ reply: "Please send a message." });
    }

    // Quick greeting (skip AI for speed)
    if (["hi", "hello", "hey"].includes(userMessage.toLowerCase())) {
      return res.json({ reply: getFallbackReply("hi") });
    }

    // --- Using HuggingFace Inference API ---
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
        {
          inputs: `You are CycleCare, a supportive menstrual health expert. Give empathetic, concise answers (1-2 sentences).\n\nUser: ${userMessage}\nAssistant:`,
        },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      const aiReply = response.data?.[0]?.generated_text?.split("Assistant:")?.[1]?.trim();
      if (aiReply && aiReply.length > 10) {
        return res.json({ reply: aiReply });
      } else {
        throw new Error("Empty or too short response from AI model");
      }
    } catch (aiError) {
      console.error("AI API Error:", aiError.message);
      // Fall through to fallback
    }

    // Fallback if AI fails
    return res.json({ reply: getFallbackReply(userMessage) });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Server error. Please try again." });
  }
});

module.exports = router;