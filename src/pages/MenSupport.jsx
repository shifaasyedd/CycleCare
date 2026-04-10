import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MenSupport() {
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const [flipped, setFlipped] = useState({});
  const [activeScenario, setActiveScenario] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(null);
  const [personalNote, setPersonalNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [viewedSections, setViewedSections] = useState({});
  const [showKit, setShowKit] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState("menstruation");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  useEffect(() => {
    const savedNote = localStorage.getItem("cyclecare_personal_note");
    if (savedNote) setPersonalNote(savedNote);
  }, []);

  useEffect(() => {
    localStorage.setItem("cyclecare_personal_note", personalNote);
  }, [personalNote]);

  const toggleCard = (index) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const markSectionViewed = (section) => {
    setViewedSections(prev => ({ ...prev, [section]: true }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    markSectionViewed('quiz');
  };

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
            glow: "rgba(255, 107, 139, 0.3)",
            chip: "rgba(255, 107, 139, 0.15)",
            shadow: "rgba(0, 0, 0, 0.4)",
            gradientStart: "#FF6B8B",
            gradientEnd: "#FF8EAA",
            green: "#4ADE80",
            blue: "#60A5FA",
            yellow: "#FBBF24",
          }
        : {
            bg: "#FFF9FB",
            card: "rgba(255, 245, 248, 0.95)",
            border: "rgba(229, 76, 111, 0.2)",
            text: "#2D1B23",
            muted: "rgba(45, 27, 35, 0.65)",
            accent: "#E54C6F",
            accentLight: "#FB7185",
            glow: "rgba(229, 76, 111, 0.15)",
            chip: "rgba(229, 76, 111, 0.08)",
            shadow: "rgba(0, 0, 0, 0.06)",
            gradientStart: "#E54C6F",
            gradientEnd: "#FF8EAA",
            green: "#16A34A",
            blue: "#3B82F6",
            yellow: "#EAB308",
          },
    [dark]
  );

  const cyclePhases = {
    menstruation: {
      name: "Menstruation",
      days: "Days 1-5",
      icon: "🩸",
      vibe: "Low energy, rest needed",
      tips: [
        "Offer heating pad without asking",
        "Bring favorite snacks",
        "Handle chores/dinner",
        "Movie night in",
      ],
    },
    follicular: {
      name: "Follicular",
      days: "Days 6-14",
      icon: "💙",
      vibe: "Energy rising, creative",
      tips: [
        "Plan fun activities",
        "Go on adventures",
        "Share ideas together",
        "Enjoy the good vibes",
      ],
    },
    ovulation: {
      name: "Ovulation",
      days: "Days 15-17",
      icon: "⭐",
      vibe: "Peak energy, confident",
      tips: [
        "Deep conversations",
        "Quality time together",
        "Celebrate energy",
        "Make plans together",
      ],
    },
    luteal: {
      name: "Luteal",
      days: "Days 18-28",
      icon: "🌸",
      vibe: "Lower energy, sensitive",
      tips: [
        "Extra patience",
        "Don't take things personally",
        "Offer gentle support",
        "Low-key activities",
      ],
    },
  };

  const currentPhase = cyclePhases[selectedPhase];

  const quickTips = [
    { title: "👂 Listen First", desc: "Don't try to fix. Just listen and say: 'That sounds really hard. I'm here.'" },
    { title: "🎁 Small Gestures Matter", desc: "Heating pad, tea, or taking over chores speaks louder than words." },
    { title: "🤝 Ask, Don't Assume", desc: "Simply ask: 'What would help right now?' It shows you care." },
    { title: "📚 Learn on Your Own", desc: "Use this guide! Don't make them educate you about their body." },
  ];

  const flashCards = [
    {
      front: "Why do mood swings happen?",
      back: "Hormonal changes during the menstrual cycle can affect mood, energy, patience, and emotional sensitivity. It's not 'drama' — it can feel very real.",
      emoji: "🧠",
    },
    {
      front: "What should you do when someone feels low?",
      back: "Stay calm, listen without interrupting, ask what would help them, and avoid dismissing their feelings.",
      emoji: "🤝",
    },
    {
      front: "What should you not say?",
      back: "Avoid saying things like 'you're overreacting' or 'it's just a period.' These feel invalidating.",
      emoji: "🚫",
    },
    {
      front: "What actually helps?",
      back: "Comfort, patience, hydration, rest, a heating pad, snacks, and small practical support often help more than advice.",
      emoji: "💗",
    },
  ];

  const whatToSay = [
    { situation: "Someone is in pain", script: "I can see you're uncomfortable. Want me to grab your heating pad?" },
    { situation: "Someone is emotional", script: "It's okay to feel this way. I'm right here with you." },
    { situation: "Someone is overwhelmed", script: "What's one thing I can take off your plate today?" },
    { situation: "You're not sure what to do", script: "I want to support you. What would be most helpful right now?" },
  ];

  const alternatives = [
    { avoid: "You're overreacting", instead: "I see this is really affecting you. How can I help?" },
    { avoid: "It's just a period", instead: "I want to understand what you're going through." },
    { avoid: "Comparing to others", instead: "Everyone experiences periods differently. I'm here to support you." },
    { avoid: "Just take some medicine", instead: "Do you want me to get you anything? Heating pad? Pain relief?" },
    { avoid: "You should exercise, it helps", instead: "Do you feel like moving around or resting today?" },
  ];

  const scenarios = [
    {
      title: "Long day, just got their period",
      situation: "Someone comes home exhausted, in pain, and overwhelmed.",
      helpful: "Ask if they want to rest, offer to handle dinner or chores, and have a heating pad ready. Sometimes just taking tasks off their plate is the best support.",
    },
    {
      title: "Feeling emotional and doesn't know why",
      situation: "Someone seems tearful or irritable but can't pinpoint a reason.",
      helpful: "Say 'It's okay to feel this way. I'm here.' Offer space if needed. Don't try to fix it — just be present.",
    },
    {
      title: "In pain but doesn't want to ask for help",
      situation: "Someone is clearly uncomfortable but says 'I'm fine' when you ask.",
      helpful: "Quietly bring a heating pad, water, or pain relief. Say 'I got you this if you need it' to make accepting help easier.",
    },
  ];

  const pcosSigns = [
    { sign: "Irregular or absent periods", emoji: "📅" },
    { sign: "Difficulty conceiving", emoji: "👶" },
    { sign: "Acne or hair thinning", emoji: "✨" },
    { sign: "Weight changes", emoji: "⚖️" },
    { sign: "Excess hair growth", emoji: "🌸" },
    { sign: "Mood changes", emoji: "💭" },
  ];

  const pcosTips = [
    "Listen without judgment",
    "Join them in healthy habits",
    "Go to appointments if they want",
    "Never suggest it's their fault",
    "Be patient with fertility struggles",
  ];

  const comfortKit = [
    { item: "Heating Pad / Hot Water Bottle", icon: "🔥" },
    { item: "Pain Relief (ibuprofen)", icon: "💊" },
    { item: "Herbal Tea", icon: "🍵" },
    { item: "Dark Chocolate", icon: "🍫" },
    { item: "Comfort Snacks", icon: "🍿" },
    { item: "Period Products", icon: "🩸" },
    { item: "Cozy Blanket/Socks", icon: "🧦" },
    { item: "Scented Candle", icon: "🕯️" },
  ];

  const productCards = [
    { icon: "🔥", title: "Heating Pad", text: "Provides warmth to relax cramped muscles and ease abdominal pain." },
    { icon: "🩸", title: "Sanitary Pads", text: "External absorbent product that sticks to underwear. Easy to use." },
    { icon: "🌸", title: "Menstrual Cup", text: "Reusable silicone cup that collects blood. Eco-friendly." },
    { icon: "📍", title: "Tampons", text: "Internal absorbent product. Great for swimming." },
    { icon: "💊", title: "Pain Relief", text: "Over-the-counter medications like ibuprofen help with cramps." },
    { icon: "👙", title: "Period Underwear", text: "Absorbent underwear that can be worn alone or as backup." },
  ];

  const emergencyResponses = [
    { situation: "Caught without period products", response: "Offer to go buy pads/tampons. Treat it like grabbing any other essential item." },
    { situation: "In severe pain", response: "Encourage rest and hydration. If pain is extreme, suggest seeing a doctor." },
    { situation: "Needs to get home but can't drive", response: "Offer to drive or help arrange transportation. Say 'Let's get you home. I've got this.'" },
  ];

  const shareableTakeaways = [
    "Be patient and listen without judgment",
    "Small acts of kindness matter more than grand gestures",
    "Ask what they need instead of assuming",
    "Periods affect the whole month, not just the week of bleeding",
    "Believe their experience — everyone's body is different",
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      background: dark
        ? `radial-gradient(circle at 0% 0%, rgba(255, 107, 139, 0.1), transparent 40%),
           ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229, 76, 111, 0.05), transparent 40%),
           ${theme.bg}`,
      color: theme.text,
    },
    container: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },

    nav: {
      position: "sticky",
      top: 20,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      padding: "10px 20px",
      marginTop: 20,
      borderRadius: 100,
      background: dark ? "rgba(20, 20, 28, 0.9)" : "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${theme.border}`,
    },
    brand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logo: { height: 42, width: "auto" },
    brandName: { fontSize: 18, fontWeight: 700 },
    brandTagline: { fontSize: 10, color: theme.muted },
    navLinks: { display: "flex", gap: 6 },
    navLink: {
      padding: "6px 14px",
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      color: theme.muted,
      textDecoration: "none",
    },
    navLinkActive: { color: theme.accent, background: theme.chip },
    themeToggle: {
      padding: "8px 14px",
      borderRadius: 100,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
    },

    hero: {
      marginTop: 32,
      marginBottom: 32,
      padding: 48,
      borderRadius: 40,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    },
    badge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 100,
      background: theme.chip,
      fontSize: 12,
      fontWeight: 500,
      color: theme.accent,
      marginBottom: 20,
    },
    title: { fontSize: 44, fontWeight: 800, margin: "0 0 12px", letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: theme.muted, maxWidth: 550, margin: "0 auto" },
    btnRow: { marginTop: 28, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
    btnPrimary: {
      padding: "12px 28px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
    },
    btnOutline: {
      padding: "12px 28px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.text,
    },

    section: {
      marginBottom: 32,
      padding: 28,
      borderRadius: 28,
      background: theme.card,
      border: `1px solid ${theme.border}`,
    },
    sectionTitle: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
    sectionDesc: { fontSize: 14, color: theme.muted, marginBottom: 20 },

    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
    grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
    grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },

    tipCard: { padding: 20, borderRadius: 24, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${theme.border}` },
    tipTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8 },
    tipDesc: { fontSize: 13, color: theme.muted },

    phaseSelector: { display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" },
    phaseBtn: (active) => ({
      padding: "10px 20px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      background: active ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` : theme.chip,
      border: `1px solid ${theme.border}`,
      color: active ? "white" : theme.text,
    }),
    phaseCard: { padding: 24, borderRadius: 24, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${theme.border}` },
    phaseIcon: { fontSize: 48, marginBottom: 12 },
    phaseName: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
    phaseDays: { fontSize: 13, color: theme.muted, marginBottom: 8 },
    phaseVibe: { fontSize: 14, marginBottom: 16 },
    phaseTipList: { paddingLeft: 20, margin: 0 },
    phaseTipItem: { marginBottom: 6, fontSize: 13 },

    flashGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 20 },
    flashCard: { minHeight: 160, borderRadius: 20, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", border: `1px solid ${theme.border}`, padding: 20, cursor: "pointer" },

    scriptCard: { padding: 16, borderRadius: 20, background: theme.chip, border: `1px solid ${theme.border}`, marginBottom: 12 },
    scriptSituation: { fontSize: 12, color: theme.muted, marginBottom: 6 },
    scriptText: { fontSize: 15, fontWeight: 500, fontStyle: "italic" },

    alternativeCard: { padding: 16, borderRadius: 20, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", border: `1px solid ${theme.border}`, marginBottom: 12 },

    scenarioCard: { padding: 20, borderRadius: 20, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", border: `1px solid ${theme.border}`, marginBottom: 16, cursor: "pointer" },
    scenarioTitle: { fontSize: 18, fontWeight: 700, marginBottom: 8 },
    scenarioSituation: { fontSize: 14, color: theme.muted, marginBottom: 12 },
    scenarioHelpful: { fontSize: 13, background: theme.chip, padding: 12, borderRadius: 12, marginTop: 8 },

    productGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 20 },
    productCard: { padding: 20, borderRadius: 20, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", border: `1px solid ${theme.border}`, textAlign: "center" },
    productIcon: { width: 60, height: 60, borderRadius: 30, margin: "0 auto 12px", display: "grid", placeItems: "center", fontSize: 28, background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, color: "white" },
    productTitle: { fontWeight: 700, fontSize: 16, marginBottom: 8 },
    productDesc: { fontSize: 13, color: theme.muted },

    kitGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 },
    kitItem: { padding: 12, borderRadius: 16, background: theme.chip, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 10 },

    pcosSignGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 },
    pcosSign: { padding: 12, borderRadius: 16, background: theme.chip, textAlign: "center" },
    pcosTipList: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 },

    noteArea: { width: "100%", padding: 10, borderRadius: 20, background: dark ? "rgba(255,255,255,0.05)" : "white", border: `1px solid ${theme.border}`, color: theme.text, fontFamily: "inherit", resize: "vertical" },
    confidenceButtons: { display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" },
    confidenceBtn: { padding: "10px 20px", borderRadius: 100, cursor: "pointer", background: theme.chip, border: `1px solid ${theme.border}` },

    footer: { padding: "32px 0", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" },

    "@media (max-width: 1024px)": {
      grid3: { gridTemplateColumns: "repeat(2, 1fr)" },
      grid4: { gridTemplateColumns: "repeat(2, 1fr)" },
      flashGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      productGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      kitGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      pcosSignGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      title: { fontSize: 36 },
    },
    "@media (max-width: 640px)": {
      grid3: { gridTemplateColumns: "1fr" },
      grid4: { gridTemplateColumns: "1fr" },
      flashGrid: { gridTemplateColumns: "1fr" },
      productGrid: { gridTemplateColumns: "1fr" },
      kitGrid: { gridTemplateColumns: "1fr" },
      pcosSignGrid: { gridTemplateColumns: "1fr" },
      title: { fontSize: 28 },
      navLinks: { display: "none" },
      hero: { padding: 24 },
      section: { padding: 20 },
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar active="Categories" />

        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.badge}>🤝 Be a True Ally</span>
          <h1 style={styles.title}>Understand. Support. Show Up.</h1>
          <p style={styles.subtitle}>It's not about having all the answers. It's about showing up with an open heart and willingness to learn.</p>
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => navigate("/chatbot")}>💬 Ask Questions Anonymously</button>
            <button style={styles.btnOutline} onClick={() => navigate("/category")}>← Back</button>
          </div>
        </div>

        {/* Quick Tips */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💡 Quick Tips</h2>
          <div style={styles.grid4}>
            {quickTips.map((tip, i) => (
              <div key={i} style={styles.tipCard}>
                <div style={styles.tipTitle}>{tip.title}</div>
                <div style={styles.tipDesc}>{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cycle Support Chart */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📊 How to Support Throughout the Cycle</h2>
          <p style={styles.sectionDesc}>Select a phase to see what helps</p>
          <div style={styles.phaseSelector}>
            {Object.keys(cyclePhases).map(phase => (
              <button key={phase} style={styles.phaseBtn(selectedPhase === phase)} onClick={() => setSelectedPhase(phase)}>
                {cyclePhases[phase].icon} {cyclePhases[phase].name}
              </button>
            ))}
          </div>
          <div style={styles.phaseCard}>
            <div style={styles.phaseIcon}>{currentPhase.icon}</div>
            <div style={styles.phaseName}>{currentPhase.name}</div>
            <div style={styles.phaseDays}>{currentPhase.days}</div>
            <div style={styles.phaseVibe}>✨ {currentPhase.vibe}</div>
            <ul style={styles.phaseTipList}>
              {currentPhase.tips.map((tip, i) => <li key={i} style={styles.phaseTipItem}>✓ {tip}</li>)}
            </ul>
          </div>
        </div>

        {/* Understanding Mood Swings - Flash Cards */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🧠 Understanding Mood Changes</h2>
          <p style={styles.sectionDesc}>Click each card to learn how to respond better</p>
          <div style={styles.flashGrid}>
            {flashCards.map((item, index) => (
              <div key={index} style={styles.flashCard} onClick={() => { toggleCard(index); markSectionViewed("flashcards"); }}>
                {!flipped[index] ? (
                  <>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{item.emoji}</div>
                    <div style={{ fontWeight: 700 }}>{item.front}</div>
                    <div style={{ fontSize: 12, color: theme.muted, marginTop: 12 }}>Tap to learn →</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, color: theme.accent, marginBottom: 12 }}>💡 What helps</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>{item.back}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What to Say */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💬 What to Say (Actual Scripts)</h2>
          <div style={styles.grid2}>
            {whatToSay.map((item, i) => (
              <div key={i} style={styles.scriptCard}>
                <div style={styles.scriptSituation}>📌 {item.situation}</div>
                <div style={styles.scriptText}>"{item.script}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Life Scenarios */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📖 Real-Life Scenarios</h2>
          {scenarios.map((scenario, idx) => (
            <div key={idx} style={styles.scenarioCard} onClick={() => { setActiveScenario(activeScenario === idx ? null : idx); markSectionViewed("scenarios"); }}>
              <div style={styles.scenarioTitle}>{scenario.title}</div>
              <div style={styles.scenarioSituation}>{scenario.situation}</div>
              {activeScenario === idx && <div style={styles.scenarioHelpful}>💡 <strong>What would help:</strong> {scenario.helpful}</div>}
              {activeScenario !== idx && <div style={{ fontSize: 12, color: theme.muted, marginTop: 8 }}>Tap for guidance →</div>}
            </div>
          ))}
        </div>

        {/* What NOT to Say */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🚫 What NOT to Say → Better Alternatives</h2>
          {alternatives.map((alt, idx) => (
            <div key={idx} style={styles.alternativeCard} onMouseEnter={() => markSectionViewed("alternatives")}>
              <div style={{ color: theme.accent, textDecoration: "line-through" }}>❌ {alt.avoid}</div>
              <div style={{ color: theme.green, marginTop: 6 }}>✅ Instead: "{alt.instead}"</div>
            </div>
          ))}
        </div>

        {/* Helpful Products */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🩸 Helpful Products to Know</h2>
          <p style={styles.sectionDesc}>Understanding these basics makes it easier to support practically.</p>
          <div style={styles.productGrid}>
            {productCards.map((item, index) => (
              <div key={index} style={styles.productCard} onMouseEnter={() => markSectionViewed("products")}>
                <div style={styles.productIcon}>{item.icon}</div>
                <div style={styles.productTitle}>{item.title}</div>
                <div style={styles.productDesc}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comfort Kit */}
        <div style={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setShowKit(!showKit)}>
            <h2 style={styles.sectionTitle}>🎁 The Comfort Kit</h2>
            <span>{showKit ? "▼" : "▶"}</span>
          </div>
          {showKit && (
            <div style={styles.kitGrid}>
              {comfortKit.map((item, idx) => (
                <div key={idx} style={styles.kitItem}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <span>{item.item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Understanding PCOS/PCOD */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🌸 Understanding PCOS & PCOD</h2>
          <p style={styles.sectionDesc}>A common hormonal condition affecting 1 in 10 women. Here's what you should know:</p>
          <div style={styles.pcosSignGrid}>
            {pcosSigns.map((sign, i) => (
              <div key={i} style={styles.pcosSign}>
                <span style={{ fontSize: 24 }}>{sign.emoji}</span>
                <div style={{ fontSize: 12, marginTop: 4 }}>{sign.sign}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>🤝 How to Support Someone with PCOS:</div>
            <div style={styles.pcosTipList}>
              {pcosTips.map((tip, i) => (
                <span key={i} style={{ padding: "6px 14px", background: theme.chip, borderRadius: 100, fontSize: 13 }}>✓ {tip}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Preparedness */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🆘 Emergency Preparedness</h2>
          {emergencyResponses.map((item, idx) => (
            <div key={idx} style={styles.alternativeCard} onMouseEnter={() => markSectionViewed("emergency")}>
              <div style={{ fontWeight: 700 }}>⚠️ {item.situation}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>💡 {item.response}</div>
            </div>
          ))}
        </div>

        {/* Shareable Takeaways + Personal Notes */}
        <div style={styles.grid2}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📌 Key Takeaways</h2>
            <ul style={{ paddingLeft: 20 }}>
              {shareableTakeaways.map((item, idx) => <li key={idx} style={{ marginBottom: 8 }}>✨ {item}</li>)}
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📝 Personal Notes</h2>
            <textarea
              style={styles.noteArea}
              rows={4}
              placeholder="Write your own notes here... e.g., 'Remember to ask what they need instead of assuming'"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
            />
            <button 
              style={{ ...styles.btnOutline, marginTop: 12 }} 
              onClick={() => setNoteSaved(true)}
            >
              Save Note
            </button>
            {noteSaved && <div style={{ fontSize: 12, color: theme.green, marginTop: 8 }}>✨ Note saved!</div>}
          </div>
        </div>

        {/* Confidence Check */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🌟 Confidence Check</h2>
          <p style={styles.sectionDesc}>How confident do you feel about supporting someone through their menstrual health journey?</p>
          <div style={styles.confidenceButtons}>
            <button style={styles.confidenceBtn} onClick={() => { setConfidenceLevel(1); markSectionViewed("confidence"); }}>😕 Not confident</button>
            <button style={styles.confidenceBtn} onClick={() => { setConfidenceLevel(2); markSectionViewed("confidence"); }}>🙂 Somewhat</button>
            <button style={styles.confidenceBtn} onClick={() => { setConfidenceLevel(3); markSectionViewed("confidence"); }}>😊 Confident</button>
            <button style={styles.confidenceBtn} onClick={() => { setConfidenceLevel(4); markSectionViewed("confidence"); }}>💪 Very confident</button>
          </div>
          {confidenceLevel && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              {confidenceLevel <= 2 ? "Keep learning — you're on the right track!" : "That's great! Keep being the supportive ally you are!"}
            </div>
          )}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button style={styles.btnPrimary} onClick={() => navigate("/chatbot")}>💬 Still have questions? Chat with us</button>
          </div>
        </div>

        {/* Shopping Promo Section */}
        <div
          style={{
            marginTop: 32,
            marginBottom: 24,
            padding: "28px 24px",
            borderRadius: 28,
            background: dark ? "rgba(25, 25, 35, 0.9)" : "rgba(255, 245, 248, 0.95)",
            border: `1px solid ${theme.border}`,
            textAlign: "center",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => navigate("/shopping")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Shop Period Care Essentials</div>
          <div style={{ fontSize: 13, color: theme.muted, marginBottom: 16, maxWidth: 500, margin: "0 auto 16px auto" }}>
            Find pads, cups, heating pads, chocolates, and more – all in one place.
          </div>
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
              border: "none",
              color: "white",
              padding: "10px 24px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Visit Shopping Guide →
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <span style={{ fontSize: 12, color: theme.muted }}>© 2025 CycleCare • Support Guide</span>
          <Link to="/category" style={{ ...styles.navLink, color: theme.muted }}>← Back to Categories</Link>
        </footer>
      </div>
    </div>
  );
}