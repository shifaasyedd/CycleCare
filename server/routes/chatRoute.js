const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize Hugging Face client with new router endpoint
const hf = new OpenAI({
  baseURL: "https://router.huggingface.co/v1/",
  apiKey: process.env.HF_API_KEY,
  timeout: 10000, // 10 second timeout
});

// Decide if AI is needed (you can remove this to always use AI)
function shouldUseAI(message) {
  const text = message.toLowerCase();
  const triggers = ["how", "why", "can i", "should i", "what", "period", "cramp", "symptom", "normal", "track", "cycle"];
  return triggers.some(word => text.includes(word)) || text.length > 15;
}

// Quick, hardcoded fallback answers (zero API cost)
function getFallbackReply(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes("cramp") || lower.includes("pain")) {
    return "Cramps are very common! 🔥 Try a warm compress, gentle stretching, or ibuprofen. Staying hydrated and reducing salt can also help. Would you like more natural remedies?";
  }
  if (lower.includes("late") || lower.includes("missed")) {
    return "Cycles can vary due to stress, diet, exercise, or hormones. A normal cycle is 21–35 days. If you're concerned, a pregnancy test or talking to a doctor can provide clarity. 💜";
  }
  if (lower.includes("symptom") || lower.includes("symptom")) {
    return "Common menstrual symptoms: cramps, bloating, fatigue, mood swings, breast tenderness, headaches. Everyone's experience is unique! Which symptom bothers you most?";
  }
  if (lower.includes("period") && (lower.includes("what") || lower.includes("normal"))) {
    return "A period is the shedding of the uterine lining. It usually lasts 3–7 days and happens every 21–35 days. Tracking your cycle can help you understand your body better! 📆";
  }
  if (lower.includes("track")) {
    return "Tracking your cycle is super helpful! Note start/end dates, flow intensity, symptoms, and mood. Apps or a simple journal work great. Would you like app recommendations?";
  }
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
    return "Hello! I'm CycleCare, your menstrual health companion. Ask me anything about periods, cramps, cycle tracking, or symptoms. I'm here for you! 😊";
  }
  
  return "Thanks for reaching out! 💬 I can help with period questions, cramp relief, cycle tracking, or symptom advice. What would you like to know?";
}

// Main route handler
router.post("/", async (req, res) => {
  const startTime = Date.now();
  
  try {
    // 1. Extract and validate input
    const userMessage = req.body?.message?.trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    
    if (!userMessage) {
      return res.status(400).json({ reply: "Please send a message. 💬" });
    }
    
    // 2. Instant greeting (fast path)
    const greetingWords = ["hi", "hello", "hey", "greetings"];
    if (greetingWords.includes(userMessage.toLowerCase())) {
      return res.json({ reply: getFallbackReply("hi") });
    }
    
    // 3. Optional: use fallback for short/simple messages to save API calls
    if (!shouldUseAI(userMessage)) {
      return res.json({ reply: getFallbackReply(userMessage) });
    }
    
    // 4. Attempt AI call with timeout race
    const aiPromise = hf.chat.completions.create({
      // Using a fast, free, license-free model
      model: "google/gemma-2-2b-it",
      messages: [
        { 
          role: "system", 
          content: "You are CycleCare, a supportive menstrual health expert. Give accurate, empathetic, and concise advice (max 2 sentences)." 
        },
        ...history.map(msg => ({ 
          role: msg.sender === "user" ? "user" : "assistant", 
          content: msg.text || "" 
        })),
        { role: "user", content: userMessage }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 8000); // 8 second timeout
    });
    
    const completion = await Promise.race([aiPromise, timeoutPromise]);
    const aiReply = completion.choices?.[0]?.message?.content;
    
    if (aiReply && aiReply.trim()) {
      console.log(`AI success (${Date.now() - startTime}ms)`);
      return res.json({ reply: aiReply });
    } else {
      throw new Error("Empty AI response");
    }
    
  } catch (error) {
    console.error(`Error (${Date.now() - startTime}ms):`, error.message);
    
    // 5. Graceful fallback - always return a helpful message
    const fallback = getFallbackReply(req.body?.message || "");
    return res.json({ reply: fallback });
  }
});

module.exports = router;