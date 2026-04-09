import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Chatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load saved chat from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem("cyclecare_chat_history");
    if (savedChat) {
      try {
        setChat(JSON.parse(savedChat));
      } catch (e) {}
    }
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    if (chat.length > 0) {
      localStorage.setItem("cyclecare_chat_history", JSON.stringify(chat));
    }
  }, [chat]);

  // Get user role & name
  useEffect(() => {
    const role = localStorage.getItem("cyclecare_role");
    const user = localStorage.getItem("cyclecare_user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || "User");
      } catch {}
    }
    setUserRole(role);
  }, []);

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const theme = useMemo(
    () =>
      dark
        ? {
            bg: "#0A0A0F",
            card: "rgba(25, 25, 35, 0.85)",
            border: "rgba(255, 105, 150, 0.3)",
            text: "#FDF2F8",
            muted: "rgba(253, 242, 248, 0.7)",
            accent: "#FF6B8B",
            accentLight: "#FF8EAA",
            glow: "rgba(255, 107, 139, 0.35)",
            chip: "rgba(255, 107, 139, 0.15)",
            shadow: "rgba(0, 0, 0, 0.4)",
            gradientStart: "#FF6B8B",
            gradientEnd: "#FF8EAA",
          }
        : {
            bg: "#FFF9FB",
            card: "rgba(255, 245, 248, 0.95)",
            border: "rgba(229, 76, 111, 0.2)",
            text: "#2D1B23",
            muted: "rgba(45, 27, 35, 0.65)",
            accent: "#E54C6F",
            accentLight: "#FB7185",
            glow: "rgba(229, 76, 111, 0.2)",
            chip: "rgba(229, 76, 111, 0.08)",
            shadow: "rgba(0, 0, 0, 0.06)",
            gradientStart: "#E54C6F",
            gradientEnd: "#FF8EAA",
          },
    [dark]
  );

<<<<<<< HEAD
  const getBackPath = () => {
    switch(userRole) {
      case "men": return "/men-support";
      case "girls": return "/girls-awareness";
      case "women": return "/tracker";
      default: return "/category";
=======
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message.trim();
    const userMsg = { sender: "user", text: currentMessage };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          history: chat,
        }),
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.reply,
      };

      setChat((prev) => [...prev, botMsg]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
>>>>>>> 168d7c5cba798b3548c411062c06277c019d53dc
    }
  };

  const getBackButtonText = () => {
    switch(userRole) {
      case "men": return "← Back to Support Guide";
      case "girls": return "← Back to Girls Awareness";
      case "women": return "← Back to Period Tracker";
      default: return "← Back to Categories";
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all messages?")) {
      setChat([]);
      localStorage.removeItem("cyclecare_chat_history");
      setErrorMsg("");
    }
  };

  const sendMessage = async (customMessage = null, retry = false) => {
    const currentMessage = (customMessage || message).trim();
    if (!currentMessage || loading) return;

    if (!retry) {
      setMessage("");
      setErrorMsg("");
      setRetryCount(0);
      const userMsg = { sender: "user", text: currentMessage, timestamp: Date.now() };
      setChat((prev) => [...prev, userMsg]);
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          history: chat.filter(m => m.sender !== "error").slice(-10),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const reply = data.reply || "I'm having trouble understanding. Could you rephrase?";

      const botMsg = { sender: "bot", text: reply, timestamp: Date.now() };
      setChat((prev) => [...prev, botMsg]);
      setRetryCount(0);
    } catch (error) {
      console.error("Chat error:", error);
      let errorText = "Something went wrong. Please try again.";
      if (error.name === "AbortError") errorText = "Request timed out. Please try again.";
      
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setErrorMsg(`Retrying (${retryCount + 1}/2)...`);
        setTimeout(() => sendMessage(currentMessage, true), 1500);
      } else {
        setErrorMsg("");
        setChat((prev) => [
          ...prev,
          { sender: "bot", text: errorText, timestamp: Date.now(), isError: true },
        ]);
      }
    } finally {
      setLoading(false);
      setErrorMsg("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestionQuestions = [
    "What are periods?",
    "How to relieve cramps?",
    "Staying hydrated during periods",
    "Tampons vs pads?",
    "Is it normal to be emotional?",
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "24px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: theme.text,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      background: dark
        ? `radial-gradient(circle at 0% 0%, rgba(255, 107, 139, 0.1), transparent 40%),
           radial-gradient(circle at 100% 100%, rgba(255, 142, 170, 0.08), transparent 50%),
           ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229, 76, 111, 0.05), transparent 40%),
           radial-gradient(circle at 100% 100%, rgba(251, 113, 133, 0.08), transparent 50%),
           ${theme.bg}`,
    },
    wrap: {
      width: "100%",
      maxWidth: "1200px",
    },
    card: {
      width: "100%",
      minHeight: "88vh",
      display: "flex",
      flexDirection: "column",
      borderRadius: "32px",
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(10px)",
      boxShadow: `0 25px 50px -12px ${theme.shadow}`,
      overflow: "hidden",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      padding: "20px 28px",
      borderBottom: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.60)",
      flexWrap: "wrap",
    },
    headerLeft: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    title: {
      margin: 0,
      fontSize: "32px",
      fontWeight: "800",
      letterSpacing: "-0.5px",
      color: theme.accent,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    subtitle: {
      margin: 0,
      color: theme.muted,
      fontSize: "13px",
      lineHeight: "1.5",
    },
    headerRight: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    toggle: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      borderRadius: "100px",
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 12,
      whiteSpace: "nowrap",
      transition: "all 0.2s",
    },
    backBtn: {
      textDecoration: "none",
      color: theme.text,
      padding: "8px 16px",
      borderRadius: "100px",
      fontWeight: "600",
      fontSize: 12,
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      whiteSpace: "nowrap",
      transition: "all 0.2s",
    },
    chatArea: {
      flex: 1,
      height: "65vh",
      overflowY: "auto",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    emptyState: {
      alignSelf: "center",
      marginTop: "40px",
      maxWidth: "600px",
      textAlign: "center",
      padding: "32px 40px",
      borderRadius: "28px",
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",
      color: theme.muted,
      lineHeight: "1.6",
      fontSize: "14px",
    },
    messageRow: (sender) => ({
      display: "flex",
      justifyContent: sender === "user" ? "flex-end" : "flex-start",
    }),
    bubble: (sender, isError) => ({
      maxWidth: "70%",
      padding: "14px 20px",
      borderRadius: sender === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
      background: isError
        ? dark ? "#FF6B8B20" : "#FFE5E5"
        : sender === "user"
        ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`
        : dark
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.85)",
      color: isError ? (dark ? "#FF8EAA" : "#E54C6F") : sender === "user" ? "#fff" : theme.text,
      border: sender === "user" ? "none" : `1px solid ${theme.border}`,
      boxShadow: sender === "user" ? `0 4px 14px ${theme.glow}` : "none",
      fontSize: "14px",
      lineHeight: "1.6",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }),
    typingBubble: {
      padding: "12px 18px",
      borderRadius: "20px 20px 20px 6px",
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",
      border: `1px solid ${theme.border}`,
      color: theme.muted,
      fontSize: "13px",
      fontWeight: "500",
    },
    bottom: {
      padding: "20px 28px 24px",
      borderTop: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.55)",
    },
    inputWrap: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)",
      border: `1px solid ${theme.border}`,
      borderRadius: "24px",
      padding: "6px 6px 6px 18px",
      boxShadow: `0 4px 12px ${theme.shadow}`,
    },
    input: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: theme.text,
      fontSize: "14px",
      padding: "12px 8px",
      fontFamily: "inherit",
    },
    sendBtn: {
      border: "none",
      outline: "none",
      borderRadius: "20px",
      padding: "12px 28px",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      color: "#fff",
      fontWeight: "600",
      fontSize: "13px",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.6 : 1,
      boxShadow: `0 2px 8px ${theme.glow}`,
      whiteSpace: "nowrap",
      transition: "transform 0.2s",
    },
    disclaimer: {
      marginTop: "16px",
      padding: "12px 16px",
      borderRadius: "16px",
      background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.70)",
      border: `1px solid ${theme.border}`,
      color: theme.muted,
      fontSize: "11px",
      lineHeight: "1.5",
      textAlign: "center",
    },
    suggestions: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "12px",
      justifyContent: "center",
    },
    suggestionChip: {
      padding: "6px 14px",
      borderRadius: "100px",
      background: theme.chip,
      border: `1px solid ${theme.border}`,
      fontSize: "12px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    clearBtn: {
      padding: "6px 12px",
      borderRadius: "100px",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      fontSize: "11px",
      cursor: "pointer",
      color: theme.muted,
    },
    errorMsg: {
      textAlign: "center",
      fontSize: "11px",
      color: theme.accent,
      marginTop: "8px",
    },
    responsive: `
      @keyframes dot-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      .typing-dot { animation: dot-pulse 1.5s infinite; display: inline-block; margin: 0 2px; }
      @media (max-width: 768px) {
        .chat-area { padding: 16px !important; }
        .chat-bubble { max-width: 85% !important; }
        .chat-bottom { padding: 16px !important; }
        .chat-input-wrap { padding: 4px 4px 4px 12px !important; }
        .chat-send-btn { padding: 10px 20px !important; }
        .chat-title { font-size: 24px !important; }
      }
      @media (max-width: 520px) {
        .chat-header { flex-direction: column; align-items: flex-start !important; }
        .chat-input-wrap { flex-direction: column; align-items: stretch !important; gap: 8px !important; padding: 12px !important; }
        .chat-send-btn { width: 100%; }
      }
    `,
  };

  return (
    <div style={styles.page}>
      <style>{styles.responsive}</style>
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div className="chat-header" style={styles.header}>
            <div style={styles.headerLeft}>
              <h1 className="chat-title" style={styles.title}>
                <span>💬</span> CycleCare Chatbot
              </h1>
              <p style={styles.subtitle}>
                Hi {userName || "there"}! Ask about periods, cramps, symptoms, mood changes, and support in a calm, safe space.
              </p>
            </div>
            <div style={styles.headerRight}>
              <div style={styles.toggle} onClick={() => setDark(v => !v)}>
                <span style={{ fontSize: 14 }}>{dark ? "🌙" : "☀️"}</span>
                <span>{dark ? "Dark" : "Light"}</span>
              </div>
              <div style={styles.clearBtn} onClick={clearChat}>🗑️ Clear</div>
              <Link to={getBackPath()} style={styles.backBtn}>{getBackButtonText()}</Link>
            </div>
          </div>

          <div className="chat-area" style={styles.chatArea}>
            {chat.length === 0 && (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>💬</div>
                <div style={{ fontWeight: "700", fontSize: "18px", marginBottom: "12px", color: theme.accent }}>
                  Ask me anything about menstrual health
                </div>
                <div style={styles.suggestions}>
                  {suggestionQuestions.map((q, idx) => (
                    <span key={idx} style={styles.suggestionChip} onClick={() => sendMessage(q)}>
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {chat.map((msg, index) => (
              <div key={index} style={styles.messageRow(msg.sender)}>
                <div className="chat-bubble" style={styles.bubble(msg.sender, msg.isError)}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.messageRow("bot")}>
                <div style={styles.typingBubble}>
                  <span className="typing-dot">●</span>
                  <span className="typing-dot" style={{ animationDelay: "0.2s" }}>●</span>
                  <span className="typing-dot" style={{ animationDelay: "0.4s" }}>●</span>
                  Typing...
                </div>
              </div>
            )}
            {errorMsg && <div style={styles.errorMsg}>{errorMsg}</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-bottom" style={styles.bottom}>
            <div className="chat-input-wrap" style={styles.inputWrap}>
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="chat-input"
                style={styles.input}
              />
              <button
                className="chat-send-btn"
                onClick={() => sendMessage()}
                disabled={loading}
                style={styles.sendBtn}
              >
                Send →
              </button>
            </div>
            <div style={styles.disclaimer}>
              ⚠️ This chatbot provides general information about menstrual health and support. It should not be relied upon as medical advice. Please consult a qualified healthcare professional for any serious or personal health concerns.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}