const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const hf = new OpenAI({
  baseURL: "https://router.huggingface.co/v1/",
  apiKey: process.env.HF_API_KEY,
});

function shouldUseAI(message) {
  const text = message.toLowerCase();
  const triggers = ["how", "why", "can i", "should i", "what", "period", "cramp", "symptom", "normal"];
  return triggers.some(word => text.includes(word)) || text.length > 15;
}

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (["hi", "hello", "hey"].includes(userMessage.toLowerCase())) {
      return res.json({ reply: "Hello! I'm CycleCare. How can I help you with your menstrual health today? 😊" });
    }

    try {
      const completion = await hf.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: "You are CycleCare, a supportive menstrual health expert. Give clear, empathetic advice." },
          ...history.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text || "" })),
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
      });

      const aiReply = completion.choices?.[0]?.message?.content;
      if (aiReply) return res.json({ reply: aiReply });

    } catch (aiError) {
      console.error("AI Error:", aiError.message);
      if (userMessage.toLowerCase().includes("period")) {
        return res.json({ reply: "A period is your body's way of releasing the lining of the uterus. It's a natural part of the reproductive cycle! Do you have questions about pain or tracking?" });
      }
      return res.json({ reply: "I'm here for you! Could you tell me more about what symptoms or questions you have?" });
    }

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Server error. Please try again." });
  }
});

module.exports = router;