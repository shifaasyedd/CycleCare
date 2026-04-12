import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, Droplets, Activity, Calendar, Lightbulb, MessageCircle,
  ShoppingBag, AlertCircle, Sparkles, Moon, Sun, Check, X,
  HelpCircle, ClipboardList, TrendingUp, ArrowRight, Trash2,
  Sparkle, Info, Video, Phone
} from "lucide-react";
import logo from "../assets/cyclecare-logo.png";
import Navbar from "../components/Navbar";

export default function GirlsAwareness() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const [quiz, setQuiz] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });
  const [flipped, setFlipped] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [selectedAnatomy, setSelectedAnatomy] = useState("cup");
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("pad");

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const theme = useMemo(
    () =>
      dark
        ? {
            bg: "#0A0A0F",
            card: "rgba(25, 25, 35, 0.75)",
            border: "rgba(255, 105, 150, 0.25)",
            text: "#FDF2F8",
            muted: "rgba(253, 242, 248, 0.7)",
            accent: "#FF6B8B",
            accentLight: "#FF8EAA",
            accentDark: "#E54C6F",
            glow: "rgba(255, 107, 139, 0.35)",
            chip: "rgba(255, 107, 139, 0.2)",
            shadow: "rgba(0, 0, 0, 0.4)",
            gradientStart: "#FF6B8B",
            gradientEnd: "#FF8EAA",
            green: "#4ADE80",
            red: "#FB7185",
          }
        : {
            bg: "#FFF9FB",
            card: "rgba(255, 245, 248, 0.85)",
            border: "rgba(229, 76, 111, 0.2)",
            text: "#2D1B23",
            muted: "rgba(45, 27, 35, 0.65)",
            accent: "#E54C6F",
            accentLight: "#FF6B8B",
            accentDark: "#C73E5E",
            glow: "rgba(229, 76, 111, 0.2)",
            chip: "rgba(229, 76, 111, 0.12)",
            shadow: "rgba(0, 0, 0, 0.08)",
            gradientStart: "#E54C6F",
            gradientEnd: "#FF8EAA",
            green: "#16A34A",
            red: "#DC2626",
          },
    [dark]
  );

  const myths = [
    {
      myth: "You can't exercise on your period.",
      fact: "You can exercise if you feel comfortable. Light movement can even help cramps.",
    },
    {
      myth: "Periods are dirty.",
      fact: "Periods are a normal biological process, not something dirty or shameful.",
    },
    {
      myth: "You cannot bathe during periods.",
      fact: "Bathing is safe and can help you feel cleaner and more comfortable.",
    },
    {
      myth: "All girls get the same kind of period.",
      fact: "Every body is different. Flow, pain, mood, and cycle length can vary.",
    },
  ];

  const symptomTips = {
    cramps: "Try a heating pad, light stretching, hydration, and rest. If pain is severe, seek medical help.",
    fatigue: "Rest, hydrate, and eat iron-rich foods like spinach and beans. Sleep matters a lot during your cycle.",
    mood: "Mood changes can happen due to hormones. Gentle self-care, talking to someone, and light exercise helps.",
    headache: "Drink water, rest in a calm place, and avoid skipping meals. Reduce caffeine if possible.",
    bloating: "Eat lighter meals, reduce salty food, stay hydrated, and keep moving gently.",
  };

  const faqs = [
    {
      q: "Is it normal if my period is irregular in the beginning?",
      a: "Yes, especially in the first few years after periods begin. Your body is still adjusting. But if it's very irregular or concerns you, talk to a trusted adult or doctor.",
    },
    {
      q: "Can I go to school during my period?",
      a: "Yes, absolutely! With proper period products and hygiene, you can continue your usual routine without any issues.",
    },
    {
      q: "What if I stain my clothes?",
      a: "It happens to everyone at some point. Carry an emergency kit, wash with cold water if possible, and remember it's nothing to be ashamed of.",
    },
    {
      q: "Does using a menstrual cup hurt?",
      a: "It may feel unfamiliar at first, but if inserted correctly it should not be painful. Start with a smaller size and take your time learning.",
    },
    {
      q: "How often should I change my pad/tampon?",
      a: "Pads should be changed every 4-6 hours. Tampons should be changed every 4-8 hours and never left in for more than 8 hours.",
    },
  ];

  const learningQuestions = [
    {
      question: "What is the average length of a menstrual cycle?",
      options: ["7-10 days", "21-35 days", "40-50 days", "15-20 days"],
      correct: "21-35 days",
      explanation: "A typical menstrual cycle lasts between 21 to 35 days. It's normal for cycles to vary, especially in the first few years.",
    },
    {
      question: "How long does a period usually last?",
      options: ["1-2 days", "3-7 days", "10-14 days", "2 weeks"],
      correct: "3-7 days",
      explanation: "Most periods last between 3 to 7 days. Everyone is different, and it's normal if yours is a little shorter or longer.",
    },
    {
      question: "What is the main purpose of a period?",
      options: [
        "To clean the body",
        "To prepare the body for a possible pregnancy",
        "To remove toxins",
        "To make you tired",
      ],
      correct: "To prepare the body for a possible pregnancy",
      explanation: "The menstrual cycle prepares the uterus for a potential pregnancy. When pregnancy doesn't happen, the uterine lining sheds - that's your period.",
    },
    {
      question: "When do most girls get their first period?",
      options: ["Between 5-8 years", "Between 9-15 years", "Between 16-20 years", "After 20 years"],
      correct: "Between 9-15 years",
      explanation: "Most girls get their first period between ages 9 and 15. Everyone develops at their own pace!",
    },
    {
      question: "Which of these is a common period symptom?",
      options: ["Cramps", "Mood changes", "Fatigue", "All of the above"],
      correct: "All of the above",
      explanation: "Cramps, mood changes, and fatigue are all common period symptoms. Hormones can affect your body in many ways during your cycle.",
    },
  ];

  const getLearningFeedback = () => {
    const { q1, q2, q3, q4, q5 } = quiz;
    const answers = [q1, q2, q3, q4, q5];
    const answeredQuestions = answers.filter(a => a !== "");
    
    if (answeredQuestions.length === 0) {
      return "✨ Answer the questions above to test your knowledge about periods!";
    }
    
    let correctCount = 0;
    learningQuestions.forEach((item, index) => {
      if (answers[index] === item.correct) correctCount++;
    });
    
    if (correctCount === 5) {
      return "✨ Amazing! You got all 5 correct! You're well-prepared to understand periods. Keep learning and feel confident!";
    } else if (correctCount >= 3) {
      return `📚 Great job! You got ${correctCount}/5 correct. You're on the right track! Review the explanations to learn even more.`;
    } else {
      return `🌸 You got ${correctCount}/5 correct. That's okay - learning takes time! Read the explanations below to understand more about periods.`;
    }
  };

  const toggleFlip = (index) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const productVideos = {
    pad: {
      title: "How to Use a Sanitary Pad",
      embedUrl: "https://www.youtube.com/embed/IWQfC7Y4M8w",
      steps: [
        "Wash your hands thoroughly before and after",
        "Remove the pad from its wrapper",
        "Peel off the backing paper to expose the adhesive",
        "Position the pad in the center of your underwear",
        "Press down firmly to secure it in place",
        "Change every 4-6 hours or when needed",
        "Wrap used pad in paper or wrapper before disposing",
      ],
    },
    tampon: {
      title: "How to Use a Tampon",
      embedUrl: "https://www.youtube.com/embed/dYZL5CfC_1Y",
      steps: [
        "Wash your hands with soap and water",
        "Remove the tampon from its wrapper",
        "Hold the applicator comfortably",
        "Find a comfortable position (sitting or standing)",
        "Gently insert the applicator at an angle",
        "Push the inner tube to release the tampon",
        "Remove the applicator and dispose properly",
        "Change every 4-8 hours, never leave longer than 8 hours",
      ],
    },
    cup: {
      title: "How to Use a Menstrual Cup",
      embedUrl: "https://www.youtube.com/embed/o9fPUfm-uYE",
      steps: [
        "Wash your hands and sterilize the cup",
        "Fold the cup using a C-fold or punch-down fold",
        "Find a comfortable position (squatting or sitting)",
        "Gently insert the folded cup into the vaginal canal",
        "Rotate slightly to ensure it opens and creates a seal",
        "Remove by pinching the base to break the seal",
        "Empty, rinse, and reinsert",
        "Sterilize the cup between cycles",
      ],
    },
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      background: dark
        ? `radial-gradient(circle at 10% 20%, rgba(255, 107, 139, 0.15), transparent 50%),
           radial-gradient(circle at 90% 80%, rgba(255, 142, 170, 0.12), transparent 55%),
           ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229, 76, 111, 0.08), transparent 45%),
           radial-gradient(circle at 100% 100%, rgba(255, 107, 139, 0.1), transparent 50%),
           ${theme.bg}`,
      color: theme.text,
    },
    container: { maxWidth: 1280, margin: "0 auto", padding: "0 24px" },

    nav: {
      position: "sticky",
      top: 20,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      padding: "12px 24px",
      marginTop: 20,
      borderRadius: 100,
      background: dark ? "rgba(20, 20, 28, 0.85)" : "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${theme.border}`,
      boxShadow: `0 8px 32px ${theme.shadow}`,
    },
    brand: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },
    logo: {
      height: 48,
      width: "auto",
      filter: dark ? "drop-shadow(0 4px 12px rgba(255,107,139,0.4))" : "none",
    },
    brandText: { display: "flex", flexDirection: "column" },
    brandName: { fontSize: 20, fontWeight: 800, letterSpacing: -0.3 },
    brandTagline: { fontSize: 11, color: theme.muted, fontWeight: 500 },
    navLinks: { display: "flex", gap: 8, alignItems: "center" },
    navLink: {
      padding: "8px 16px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      color: theme.muted,
      transition: "all 0.2s ease",
      textDecoration: "none",
    },
    navLinkActive: {
      color: theme.accent,
      background: theme.chip,
    },
    navActions: { display: "flex", alignItems: "center", gap: 12 },
    themeToggle: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      borderRadius: 100,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 500,
    },

    hero: {
      marginTop: 48,
      marginBottom: 32,
      padding: 32,
      borderRadius: 32,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      textAlign: "center",
    },
    badge: {
      display: "inline-flex",
      padding: "6px 14px",
      borderRadius: 100,
      background: theme.chip,
      border: `1px solid ${theme.border}`,
      fontSize: 13,
      fontWeight: 600,
      color: theme.accent,
      marginBottom: 20,
    },
    title: { fontSize: 40, fontWeight: 800, margin: "0 0 16px 0", letterSpacing: -1 },
    subtitle: { fontSize: 16, color: theme.muted, lineHeight: 1.6, maxWidth: 700, margin: "0 auto" },

    sectionBlock: {
      marginBottom: 32,
      padding: 28,
      borderRadius: 28,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
    },
    sectionTitle: { fontSize: 24, fontWeight: 700, marginBottom: 16 },
    sectionDesc: { fontSize: 14, color: theme.muted, marginBottom: 20, lineHeight: 1.6 },

    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 32,
      marginBottom: 32,
    },

    productTabs: {
      display: "flex",
      gap: 12,
      marginBottom: 24,
      flexWrap: "wrap",
    },
    productTab: (active) => ({
      padding: "10px 24px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: active ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` : theme.chip,
      border: `1px solid ${theme.border}`,
      color: active ? "white" : theme.text,
      transition: "all 0.2s",
    }),
    videoWrapper: {
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 20,
      boxShadow: `0 8px 20px ${theme.shadow}`,
    },
    stepsList: {
      marginTop: 16,
      paddingLeft: 20,
    },
    stepItem: {
      marginBottom: 10,
      fontSize: 14,
      lineHeight: 1.5,
      color: theme.muted,
    },

    quizSection: {
      background: theme.chip,
      borderRadius: 20,
      padding: 24,
    },
    questionBox: {
      marginBottom: 20,
    },
    questionText: {
      fontWeight: 600,
      marginBottom: 12,
      fontSize: 15,
    },
    optionLabel: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8,
      cursor: "pointer",
    },
    radio: {
      width: 18,
      height: 18,
      cursor: "pointer",
      accentColor: theme.accent,
    },
    resultBox: {
      marginTop: 20,
      padding: 16,
      borderRadius: 16,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
      border: `1px solid ${theme.border}`,
      fontWeight: 500,
      lineHeight: 1.6,
    },
    explanationBox: {
      marginTop: 20,
      padding: 16,
      borderRadius: 16,
      background: dark ? "rgba(255,107,139,0.1)" : "rgba(229,76,111,0.05)",
      border: `1px solid ${theme.border}`,
    },

    mythGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 16,
    },
    flipCard: {
      padding: 20,
      borderRadius: 20,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      transition: "transform 0.2s",
      minHeight: 120,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },

    symptomGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 12,
      marginBottom: 20,
    },
    symptomBtn: {
      padding: "12px",
      borderRadius: 16,
      background: theme.chip,
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      textAlign: "center",
      fontWeight: 600,
      fontSize: 13,
      transition: "all 0.2s",
    },

    dosDontsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 32,
    },
    list: { paddingLeft: 20, marginTop: 12 },
    li: { marginBottom: 8, lineHeight: 1.5 },

    faqGrid: {
      display: "grid",
      gap: 16,
    },
    faqItem: {
      padding: 18,
      borderRadius: 20,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
      border: `1px solid ${theme.border}`,
    },

    chatSection: {
      marginBottom: 32,
      padding: 32,
      borderRadius: 28,
      background: `linear-gradient(135deg, ${theme.gradientStart}15, ${theme.gradientEnd}15)`,
      border: `2px solid ${theme.accent}`,
      backdropFilter: "blur(8px)",
      textAlign: "center",
    },
    chatTitle: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
    chatDesc: { fontSize: 14, color: theme.muted, marginBottom: 24, lineHeight: 1.6 },
    chatButton: {
      padding: "14px 32px",
      borderRadius: 100,
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      boxShadow: `0 8px 20px ${theme.glow}`,
      transition: "transform 0.2s",
    },

    footer: {
      padding: "32px 0",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 20,
      marginTop: 40,
    },

    "@media (max-width: 1024px)": {
      grid2: { gridTemplateColumns: "1fr", gap: 24 },
      mythGrid: { gridTemplateColumns: "1fr" },
      symptomGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      dosDontsGrid: { gridTemplateColumns: "1fr", gap: 20 },
      title: { fontSize: 32 },
    },
    "@media (max-width: 640px)": {
      title: { fontSize: 28 },
      navLinks: { display: "none" },
      sectionBlock: { padding: 20 },
      chatSection: { padding: 24 },
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar active="Categories" />

        {/* Hero Section */}
        <div style={styles.hero}>
          <span style={styles.badge}><Heart size={12} style={{ marginRight: 6 }} /> For Non-Menstruators</span>
          <h1 style={styles.title}>Periods, explained simply and safely</h1>
          <p style={styles.subtitle}>
            This page is for girls who want awareness, confidence, and clear information about menstrual health. 
            Learn at your own pace in a safe, supportive space.
          </p>
        </div>

        {/* Video Tutorials Section */}
        <div style={styles.sectionBlock}>
          <h2 style={styles.sectionTitle}><Video size={18} style={{ marginRight: 8 }} /> Learning About Period Products</h2>
          <p style={styles.sectionDesc}>Watch these videos to understand different period products so you'll feel prepared when your period starts.</p>
          
          <div style={styles.productTabs}>
            <button style={styles.productTab(selectedProduct === "pad")} onClick={() => setSelectedProduct("pad")}>
              <Droplets size={14} style={{ marginRight: 6 }} /> Pad
            </button>
            <button style={styles.productTab(selectedProduct === "tampon")} onClick={() => setSelectedProduct("tampon")}>
              <Activity size={14} style={{ marginRight: 6 }} /> Tampon
            </button>
            <button style={styles.productTab(selectedProduct === "cup")} onClick={() => setSelectedProduct("cup")}>
              <Heart size={14} style={{ marginRight: 6 }} /> Menstrual Cup
            </button>
          </div>

          <div style={styles.videoWrapper}>
            <iframe
              width="100%"
              height="400"
              src={productVideos[selectedProduct].embedUrl}
              title={productVideos[selectedProduct].title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>How to Use:</h3>
          <ul style={styles.stepsList}>
            {productVideos[selectedProduct].steps.map((step, idx) => (
              <li key={idx} style={styles.stepItem}>✨ {step}</li>
            ))}
          </ul>
        </div>

        {/* Knowledge Check Section */}
        <div style={styles.sectionBlock}>
          <h2 style={styles.sectionTitle}>📚 Test Your Knowledge</h2>
          <p style={styles.sectionDesc}>Answer these questions to learn more about periods and feel confident!</p>
          
          <div style={styles.quizSection}>
            {learningQuestions.map((item, idx) => {
              const answerKey = `q${idx + 1}`;
              return (
                <div key={idx} style={styles.questionBox}>
                  <div style={styles.questionText}>
                    {idx + 1}. {item.question}
                  </div>
                  {item.options.map((opt, optIdx) => (
                    <label key={optIdx} style={styles.optionLabel}>
                      <input
                        type="radio"
                        name={`q${idx + 1}`}
                        value={opt}
                        checked={quiz[answerKey] === opt}
                        onChange={(e) => setQuiz({ ...quiz, [answerKey]: e.target.value })}
                        style={styles.radio}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              );
            })}
            
            <div style={styles.resultBox}>
              {getLearningFeedback()}
            </div>
            
            {quiz.q1 && quiz.q2 && quiz.q3 && quiz.q4 && quiz.q5 && (
              <div style={styles.explanationBox}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>📖 Learn More:</div>
                {learningQuestions.map((item, idx) => {
                  const answerKey = `q${idx + 1}`;
                  const userAnswer = quiz[answerKey];
                  const isCorrect = userAnswer === item.correct;
                  return (
                    <div key={idx} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isCorrect ? <Check size={16} color={theme.green} /> : <X size={16} color={theme.red} />}
                        <span style={{ fontWeight: 500 }}>{item.question}</span>
                      </div>
                      <div style={{ fontSize: 13, color: theme.muted, marginLeft: 28, marginTop: 4 }}>
                        {!isCorrect && <span>Correct answer: <strong>{item.correct}</strong><br /></span>}
                        <span>{item.explanation}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* What is a Period Section */}
        <div style={styles.grid2}>
          <div style={styles.sectionBlock}>
            <h2 style={styles.sectionTitle}><Droplets size={18} style={{ marginRight: 8 }} /> What is a period?</h2>
            <p style={styles.sectionDesc}>
              A period is the monthly shedding of the uterus lining. It's a natural part of growing up and reproductive health. 
              Most people start their period between ages 9-15, and it usually comes every 21-35 days.
            </p>
            <div style={{ marginTop: 16, padding: 16, background: theme.chip, borderRadius: 16 }}>
              <p style={{ fontWeight: 600 }}>✨ Fun fact:</p>
              <p style={styles.sectionDesc}>The average period lasts 3-7 days, and it's completely normal for cycles to be irregular when you first start.</p>
            </div>
          </div>

          <div style={styles.sectionBlock}>
            <h2 style={styles.sectionTitle}><Sparkles size={18} style={{ marginRight: 8 }} /> Period Emergency Kit</h2>
            <p style={styles.sectionDesc}>It's good to be prepared! Keep these items in your bag for peace of mind:</p>
            <ul style={styles.list}>
              <li style={styles.li}><Droplets size={14} style={{ marginRight: 6 }} /> 2-3 pads / panty liners</li>
              <li style={styles.li}>Spare underwear</li>
              <li style={styles.li}>Small wipes / tissues</li>
              <li style={styles.li}><Trash2 size={14} style={{ marginRight: 6 }} /> Small bag for disposal</li>
              <li style={styles.li}><Phone size={14} style={{ marginRight: 6 }} /> Phone to call for help if needed</li>
              <li style={styles.li}><ShoppingBag size={14} style={{ marginRight: 6 }} /> A small pouch to keep everything together</li>
            </ul>
          </div>
        </div>

        {/* Myth-Buster Cards */}
        <div style={styles.sectionBlock}>
          <h2 style={styles.sectionTitle}><Sparkle size={18} style={{ marginRight: 8 }} /> Myth-Buster Cards</h2>
          <p style={styles.sectionDesc}>Click on any card to reveal the truth!</p>
          <div style={styles.mythGrid}>
            {myths.map((item, index) => (
              <div key={index} style={styles.flipCard} onClick={() => toggleFlip(index)}>
                {!flipped[index] ? (
                  <>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: theme.accent }}><X size={14} style={{ marginRight: 6 }} /> Myth</div>
                    <div>{item.myth}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: theme.green }}><Check size={14} style={{ marginRight: 6 }} /> Fact</div>
                    <div>{item.fact}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mood & Symptom Help */}
        <div style={styles.sectionBlock}>
          <h2 style={styles.sectionTitle}><MessageCircle size={18} style={{ marginRight: 8 }} /> Understanding Period Symptoms</h2>
          <p style={styles.sectionDesc}>Click on any symptom to learn how to manage it when your period starts:</p>
            <div style={styles.symptomGrid}>
            <button style={styles.symptomBtn} onClick={() => setSelectedSymptom("cramps")}>Cramps</button>
            <button style={styles.symptomBtn} onClick={() => setSelectedSymptom("fatigue")}>Fatigue</button>
            <button style={styles.symptomBtn} onClick={() => setSelectedSymptom("mood")}>Mood Swings</button>
            <button style={styles.symptomBtn} onClick={() => setSelectedSymptom("headache")}>Headache</button>
            <button style={styles.symptomBtn} onClick={() => setSelectedSymptom("bloating")}>Bloating</button>
          </div>
          {selectedSymptom && (
            <div style={styles.resultBox}>
              <span style={{ fontWeight: 700 }}>💡 Tip: </span>
              {symptomTips[selectedSymptom]}
            </div>
          )}
        </div>

        {/* Do's and Don'ts */}
        <div style={styles.dosDontsGrid}>
          <div style={styles.sectionBlock}>
            <h2 style={styles.sectionTitle}><Check size={18} style={{ marginRight: 8 }} /> Do's</h2>
            <ul style={styles.list}>
              <li style={styles.li}><Check size={14} style={{ marginRight: 6 }} /> Learn about periods before they start</li>
              <li style={styles.li}><Check size={14} style={{ marginRight: 6 }} /> Talk to a trusted adult about any questions</li>
              <li style={styles.li}><Check size={14} style={{ marginRight: 6 }} /> Keep a small emergency kit in your bag</li>
              <li style={styles.li}><Check size={14} style={{ marginRight: 6 }} /> Be kind to yourself during your period</li>
              <li style={styles.li}><Check size={14} style={{ marginRight: 6 }} /> Ask questions without shame</li>
            </ul>
          </div>

          <div style={styles.sectionBlock}>
            <h2 style={styles.sectionTitle}><X size={18} style={{ marginRight: 8 }} /> Don'ts</h2>
            <ul style={styles.list}>
              <li style={styles.li}><X size={14} style={{ marginRight: 6 }} /> Don't believe myths without checking facts</li>
              <li style={styles.li}><X size={14} style={{ marginRight: 6 }} /> Don't feel embarrassed — periods are natural</li>
              <li style={styles.li}><X size={14} style={{ marginRight: 6 }} /> Don't ignore severe pain or unusual symptoms</li>
              <li style={styles.li}><X size={14} style={{ marginRight: 6 }} /> Don't be afraid to ask for help</li>
              <li style={styles.li}><X size={14} style={{ marginRight: 6 }} /> Don't compare your experience to others</li>
            </ul>
          </div>
        </div>

        {/* When to Ask for Help */}
        <div style={styles.grid2}>
          <div style={styles.sectionBlock}>
            <h2 style={styles.sectionTitle}><AlertCircle size={18} style={{ marginRight: 8 }} /> When to ask for help</h2>
            <p style={styles.sectionDesc}>
              It's important to know when to talk to a trusted adult or doctor:
            </p>
            <ul style={styles.list}>
              <li style={styles.li}><Droplets size={14} style={{ marginRight: 6 }} /> If you haven't started your period by age 16</li>
              <li style={styles.li}><Droplets size={14} style={{ marginRight: 6 }} /> If periods are extremely painful</li>
              <li style={styles.li}><Droplets size={14} style={{ marginRight: 6 }} /> If bleeding is very heavy</li>
              <li style={styles.li}><Droplets size={14} style={{ marginRight: 6 }} /> If you feel dizzy, weak, or faint</li>
              <li style={styles.li}><Droplets size={14} style={{ marginRight: 6 }} /> If you have any questions or worries</li>
            </ul>
          </div>

          <div style={styles.sectionBlock}>
            <h2 style={styles.sectionTitle}><Heart size={18} style={{ marginRight: 8 }} /> Important Reminder</h2>
            <p style={styles.sectionDesc}>
              Everybody's body is different. There's no "normal" way to experience periods — what matters is what's normal for YOU. 
              This page is for awareness and education. Always talk to a trusted adult or healthcare provider if something doesn't feel right.
            </p>
            <div style={{ marginTop: 16, padding: 12, background: theme.chip, borderRadius: 12 }}>
              <p style={{ fontSize: 13, textAlign: "center" }}>
                <Heart size={14} style={{ marginRight: 6 }} /> You're not alone. Millions of people go through this — and you've got this! <Heart size={14} style={{ marginLeft: 6 }} />
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={styles.sectionBlock}>
          <h2 style={styles.sectionTitle}><HelpCircle size={18} style={{ marginRight: 8 }} /> Frequently Asked Questions</h2>
          <div style={styles.faqGrid}>
            {faqs.map((item, index) => (
              <div key={index} style={styles.faqItem}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: theme.accent }}>{item.q}</div>
                <div style={{ color: theme.muted, lineHeight: 1.5 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Switch to Menstruators */}
        <div style={{ marginBottom: 24, padding: 16, background: theme.chip, borderRadius: 20, textAlign: "center" }}>
          <p style={{ marginBottom: 12, fontSize: 13 }}><Heart size={14} style={{ marginRight: 6 }} /> Started your period?</p>
          <button 
            style={{ padding: "10px 24px", borderRadius: 100, background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, border: "none", color: "white", cursor: "pointer" }}
            onClick={() => {
              if (window.confirm("⚠️ Switching to Menstruators category will give you access to the Period Tracker.Do you want to proceed?")) {
                localStorage.setItem("cyclecare_role", "women");
                navigate("/tracker");
              }
            }}
          >
            Switch to Period Tracker →
          </button>
        </div>

        {/* Chatbot Section */}
        <div style={styles.chatSection}>
          <div style={{ marginBottom: 16 }}><MessageCircle size={48} color={theme.accent} /></div>
          <h2 style={styles.chatTitle}>Still have questions?</h2>
          <p style={styles.chatDesc}>
            Chat with our friendly AI assistant! Ask anything about periods, symptoms, products, or anything else you're curious about.
          </p>
          <button 
            style={styles.chatButton}
            onClick={() => navigate("/chatbot")}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <MessageCircle size={14} style={{ marginRight: 6 }} /> Chat with CycleCare Assistant →
          </button>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={logo} alt="CycleCare" style={{ height: 32 }} />
            <span style={{ fontSize: 12, color: theme.muted }}>© 2025 CycleCare • Girls Awareness</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link to="/category" style={{ ...styles.navLink, color: theme.muted }}>← Back to Categories</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}