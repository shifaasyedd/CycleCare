const express = require("express");
const router = express.Router();
const HF_API_KEY = require("openai");

const hf = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

// Decide if question needs AI
function shouldUseAI(message) {
  const text = message.toLowerCase();

  return (
    text.includes("how") ||
    text.includes("why") ||
    text.includes("can i") ||
    text.includes("should i") ||
    text.includes("what should") ||
    text.includes("recommend") ||
    text.includes("safe") ||
    text.includes("normal") ||
    text.includes("sex") ||
    text.includes("medicine") ||
    text.includes("beginner") ||
    text.includes("comfortable")
  );
}

// Simple rule-based replies
function getRuleBasedReply(message) {
  const text = message.toLowerCase().trim();

  if (["hi", "hello", "hey"].includes(text)) {
    return "Hello! I’m CycleCare support bot. How can I help you today?";
  }

  if (text === "how are you") {
    return "I’m doing well 😊 I’m here to help you with menstrual health and support-related questions.";
  }

  if (
    text === "tampon" ||
    text === "tampons" ||
    text === "what are tampons"
  ) {
    return "Tampons are menstrual products inserted into the vagina to absorb menstrual flow. They are convenient and allow more freedom of movement.";
  }

  if (
    text === "pads" ||
    text === "what are pads"
  ) {
    return "Pads are absorbent products worn in underwear to absorb menstrual blood. They are easy to use and widely preferred.";
  }

  if (
    text === "what is menstruation" ||
    text === "what are periods"
  ) {
    return "Menstruation is the monthly shedding of the uterine lining, released as blood through the vagina. It is a natural biological process.";
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

    console.log("User:", userMessage);

    // Convert history → AI format
    const formattedHistory = history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    // 🔥 AI-FIRST for complex queries
    if (shouldUseAI(userMessage)) {
      try {
        const completion = await hf.chat.completions.create({
          model: "katanemo/Arch-Router-1.5B:hf-inference",
          messages: [
            {
              role: "system",
              content:
                "You are CycleCare, a supportive menstrual health chatbot. Give clear, safe, respectful answers. Do not diagnose diseases. Suggest doctor if needed.",
            },
            ...formattedHistory,
            { role: "user", content: userMessage },
          ],
          temperature: 0.6,
          max_tokens: 200,
        });

        const aiReply =
          completion.choices?.[0]?.message?.content?.trim();

        if (aiReply) {
          console.log("Reply: AI");
          return res.json({ reply: aiReply });
        }
      } catch (err) {
        console.log("AI failed, fallback to rules");
      }
    }

    // 🔹 RULE-BASED fallback
    const ruleReply = getRuleBasedReply(userMessage);
    if (ruleReply) {
      console.log("Reply: Rule");
      return res.json({ reply: ruleReply });
    }

    // 🔥 FINAL AI fallback
    try {
      const completion = await hf.chat.completions.create({
        model: "katanemo/Arch-Router-1.5B:hf-inference",
        messages: [
          {
            role: "system",
            content:
              "You are CycleCare, a menstrual health chatbot. Answer clearly and safely.",
          },
          ...formattedHistory,
          { role: "user", content: userMessage },
        ],
      });

      const aiReply =
        completion.choices?.[0]?.message?.content?.trim();

      if (aiReply) {
        console.log("Reply: AI fallback");
        return res.json({ reply: aiReply });
      }
    } catch (err) {
      console.error(err.message);
    }

    // Last fallback
    return res.json({
      reply:
        "I can help with periods, cramps, hygiene, mood changes, and support-related questions. Please ask something more specific.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Server error. Please try again.",
    });
  }
});

module.exports = router;