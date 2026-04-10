import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PCOSPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Cycle Log Data
  const [cycles, setCycles] = useState([]);
  const [newCycle, setNewCycle] = useState({
    startDate: "",
    endDate: "",
    flowType: "medium",
    symptoms: [],
  });

  // Symptom Tracking
  const [dailyLog, setDailyLog] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [dailyNote, setDailyNote] = useState("");

  // Lifestyle Log
  const [lifestyle, setLifestyle] = useState({
    exercise: "",
    sleep: "",
    stress: "",
    meals: "",
  });

  // Medications/Supplements
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", time: "" });

  // Doctor Visits
  const [visits, setVisits] = useState([]);
  const [newVisit, setNewVisit] = useState({ date: "", doctor: "", notes: "", tests: "" });

  // API setup
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("cyclecare_token");

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  // Load all data from database
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    Promise.all([
      fetch(`${API_URL}/api/tracker/cycles`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/api/tracker/daily-logs`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/api/tracker/medications`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/api/tracker/visits`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ]).then(([cyclesData, logsData, medsData, visitsData]) => {
      if (cyclesData.success) setCycles(cyclesData.data);
      if (logsData.success) setDailyLog(logsData.data);
      if (medsData.success) setMedications(medsData.data);
      if (visitsData.success) setVisits(visitsData.data);
      setIsLoading(false);
    }).catch(err => {
      console.error("Error loading data:", err);
      setIsLoading(false);
    });
  }, [token, navigate]);

  // Load today's log when logs load
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = dailyLog.find(log => log.date === todayStr);
    if (todayLog) {
      setSelectedSymptoms(todayLog.symptoms || []);
      setDailyNote(todayLog.note || "");
      setLifestyle(todayLog.lifestyle || { exercise: "", sleep: "", stress: "", meals: "" });
    } else {
      setSelectedSymptoms([]);
      setDailyNote("");
      setLifestyle({ exercise: "", sleep: "", stress: "", meals: "" });
    }
  }, [dailyLog]);

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
            purple: "#A855F7",
            yellow: "#FBBF24",
            blue: "#3B82F6",
            orange: "#FB923C",
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
            purple: "#9333EA",
            yellow: "#EAB308",
            blue: "#2563EB",
            orange: "#F97316",
          },
    [dark]
  );

  // Symptom Lists
  const commonSymptoms = [
    "Irregular Period", "Heavy Bleeding", "Spotting", "Cramps",
    "Acne Breakout", "Hair Thinning", "Excess Hair Growth",
    "Mood Swings", "Anxiety", "Fatigue", "Brain Fog",
    "Weight Gain", "Bloating", "Cravings", "Headache",
    "Sleep Issues", "Low Energy", "Joint Pain"
  ];

  const lifestyleOptions = {
    exercise: ["None", "Light walk", "Yoga", "Cardio", "Strength training"],
    sleep: ["< 5 hrs", "5-6 hrs", "7-8 hrs", "> 8 hrs"],
    stress: ["Very low", "Low", "Moderate", "High", "Very high"],
  };

  const flowOptions = ["Light", "Medium", "Heavy", "Spotting", "None"];

  // Calculate cycle statistics
  const cycleStats = useMemo(() => {
    if (cycles.length === 0) return { avgLength: 0, shortest: 0, longest: 0, lastPeriod: null };
    
    const lengths = cycles.map(c => {
      if (c.startDate && c.endDate) {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      }
      return 0;
    }).filter(l => l > 0);
    
    const validLengths = lengths.filter(l => l > 0);
    const sortedCycles = [...cycles].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    return {
      avgLength: validLengths.length ? Math.round(validLengths.reduce((a, b) => a + b, 0) / validLengths.length) : 0,
      shortest: validLengths.length ? Math.min(...validLengths) : 0,
      longest: validLengths.length ? Math.max(...validLengths) : 0,
      lastPeriod: sortedCycles[0]?.startDate || null,
      totalCycles: cycles.length,
    };
  }, [cycles]);

  // Add cycle
  const addCycle = () => {
    if (!newCycle.startDate) return alert("Please select a start date");
    
    fetch(`${API_URL}/api/tracker/cycles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newCycle)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCycles([data.data, ...cycles]);
          setNewCycle({ startDate: "", endDate: "", flowType: "medium", symptoms: [] });
          alert("Cycle saved to database! ✅");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Error saving cycle:", err);
        alert("Network error. Please try again.");
      });
  };

  // Save daily log (symptoms + lifestyle together)
  const saveDailyLog = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const logData = {
      date: today,
      symptoms: selectedSymptoms,
      note: dailyNote,
      lifestyle: { ...lifestyle }
    };
    
    fetch(`${API_URL}/api/tracker/daily-logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(logData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const existingIndex = dailyLog.findIndex(log => log.date === today);
          if (existingIndex !== -1) {
            const updatedLogs = [...dailyLog];
            updatedLogs[existingIndex] = data.data;
            setDailyLog(updatedLogs);
          } else {
            setDailyLog([data.data, ...dailyLog]);
          }
          alert("Daily log saved to database! ✅");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Error saving daily log:", err);
        alert("Network error. Please try again.");
      });
  };

  // Add medication
  const addMedication = () => {
    if (!newMed.name) return alert("Please enter medication name");
    
    fetch(`${API_URL}/api/tracker/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newMed)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMedications([...medications, data.data]);
          setNewMed({ name: "", dosage: "", time: "" });
          alert("Medication saved to database! ✅");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Error saving medication:", err);
        alert("Network error. Please try again.");
      });
  };

  // Add doctor visit
  const addVisit = () => {
    if (!newVisit.date) return alert("Please select a date");
    
    fetch(`${API_URL}/api/tracker/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newVisit)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVisits([...visits, data.data]);
          setNewVisit({ date: "", doctor: "", notes: "", tests: "" });
          alert("Doctor visit saved to database! ✅");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Error saving visit:", err);
        alert("Network error. Please try again.");
      });
  };

  const goToChatbot = () => {
    navigate("/chatbot");
  };

  const CARD_HEIGHT = "450px";

  const styles = {
    page: {
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif",
      background: dark
        ? `radial-gradient(circle at 0% 0%, rgba(255,107,139,0.1), transparent 40%), ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229,76,111,0.05), transparent 40%), ${theme.bg}`,
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
      padding: "10px 20px",
      marginTop: 16,
      borderRadius: 100,
      background: dark ? "rgba(20,20,28,0.9)" : "rgba(255,255,255,0.9)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${theme.border}`,
    },
    brand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logo: { height: 36, width: "auto" },
    brandName: { fontSize: 16, fontWeight: 700 },
    brandTagline: { fontSize: 10, color: theme.muted },
    navLinks: { display: "flex", gap: 6 },
    navLink: {
      padding: "6px 14px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      color: theme.muted,
      textDecoration: "none",
    },
    navLinkActive: { color: theme.accent, background: theme.chip },
    themeToggle: {
      padding: "6px 12px",
      borderRadius: 100,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      fontSize: 12,
    },

    hero: {
      marginTop: 24,
      marginBottom: 20,
      padding: 28,
      borderRadius: 24,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    },
    badge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 100,
      background: theme.chip,
      fontSize: 11,
      color: theme.accent,
      marginBottom: 10,
    },
    title: { fontSize: 28, fontWeight: 700, margin: "0 0 8px" },
    subtitle: { fontSize: 13, color: theme.muted },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      marginBottom: 24,
    },
    statCard: {
      padding: 16,
      borderRadius: 20,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    },
    statValue: { fontSize: 28, fontWeight: 800, color: theme.accent },
    statLabel: { fontSize: 11, color: theme.muted, marginTop: 4 },

    tabs: {
      display: "flex",
      justifyContent: "center",
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap",
    },
    
    tabBtn: (active) => ({
      padding: "8px 20px",
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      background: active ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` : "transparent",
      border: active ? "none" : `1px solid ${theme.border}`,
      color: active ? "white" : theme.text,
    }),

    card: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 20,
      height: CARD_HEIGHT,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    cardHeader: {
      padding: "12px 16px 8px 16px",
      borderBottom: `1px solid ${theme.border}`,
      fontWeight: 700,
      fontSize: 15,
    },
    cardBody: {
      flex: 1,
      overflowY: "auto",
      padding: "14px 16px",
    },

    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },

    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 12,
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "white",
      color: theme.text,
      fontSize: 13,
      marginBottom: 12,
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 12,
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "white",
      color: theme.text,
      fontSize: 13,
      fontFamily: "inherit",
      resize: "vertical",
      minHeight: 70,
      marginBottom: 12,
      outline: "none",
    },
    select: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 12,
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "white",
      color: theme.text,
      fontSize: 13,
      marginBottom: 12,
      outline: "none",
    },
    label: { fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" },

    btnPrimary: {
      padding: "8px 16px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
    },
    btnSecondary: {
      padding: "8px 16px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.text,
    },

    symptomGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 8,
      marginBottom: 12,
    },
    symptomBtn: (selected) => ({
      padding: "6px 10px",
      borderRadius: 20,
      fontSize: 11,
      cursor: "pointer",
      background: selected ? theme.accent : theme.chip,
      color: selected ? "white" : theme.text,
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    }),

    list: {
      maxHeight: "200px",
      overflowY: "auto",
    },
    listItem: {
      padding: 10,
      borderBottom: `1px solid ${theme.border}`,
      fontSize: 12,
    },

    row: { display: "flex", gap: 10, marginTop: 6 },
    infoBox: {
      marginTop: 12,
      padding: 12,
      background: theme.chip,
      borderRadius: 12,
    },

    chatbotSection: {
      marginTop: 28,
      marginBottom: 20,
      padding: 28,
      borderRadius: 28,
      background: `linear-gradient(135deg, ${theme.gradientStart}15, ${theme.gradientEnd}15)`,
      border: `2px solid ${theme.accent}`,
      textAlign: "center",
      cursor: "pointer",
    },
    chatbotIcon: { fontSize: 56, marginBottom: 16 },
    chatbotTitle: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
    chatbotDesc: { fontSize: 14, color: theme.muted, marginBottom: 20, lineHeight: 1.5 },
    chatbotBtn: {
      padding: "12px 28px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
    },

    footer: {
      padding: "20px 0",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
    },

    "@media (max-width: 1024px)": {
      statsGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      grid2: { gridTemplateColumns: "1fr", gap: 16 },
      symptomGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      card: { height: "auto", minHeight: "400px" },
    },
    "@media (max-width: 640px)": {
      statsGrid: { gridTemplateColumns: "1fr" },
      title: { fontSize: 24 },
      navLinks: { display: "none" },
      hero: { padding: 20 },
      symptomGrid: { gridTemplateColumns: "1fr" },
      chatbotTitle: { fontSize: 18 },
      chatbotSection: { padding: 20 },
    },
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>💡 Understanding PCOS / PCOD</div>
              <div style={styles.cardBody}>
                <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
                  Polycystic Ovary Syndrome (PCOS) / Polycystic Ovary Disease (PCOD) is a hormonal disorder common among women of reproductive age. It affects how the ovaries work and can impact overall health.
                </p>
                <ul style={{ paddingLeft: 20, fontSize: 12, margin: "0 0 12px 0" }}>
                  <li style={{ marginBottom: 6 }}>Irregular or absent periods</li>
                  <li style={{ marginBottom: 6 }}>Excess androgen (male hormone) levels – may cause acne, hair thinning, or excess hair growth</li>
                  <li style={{ marginBottom: 6 }}>Polycystic ovaries (enlarged ovaries with many small follicles)</li>
                  <li style={{ marginBottom: 6 }}>Difficulty with fertility / ovulation</li>
                  <li style={{ marginBottom: 6 }}>Weight gain, especially around the abdomen</li>
                  <li style={{ marginBottom: 6 }}>Insulin resistance – increases risk of type 2 diabetes</li>
                  <li style={{ marginBottom: 6 }}>Mood swings, anxiety, and depression</li>
                  <li style={{ marginBottom: 6 }}>Fatigue and low energy</li>
                </ul>
                <div style={styles.infoBox}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>✨ What helps:</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    • Balanced diet (low GI foods, lots of veggies, protein)<br />
                    • Regular exercise (strength training + cardio)<br />
                    • Stress management (yoga, meditation, enough sleep)<br />
                    • Medications as prescribed (metformin, birth control, etc.)<br />
                    • Consistent tracking – you're already doing it! 💪
                  </div>
                </div>
                <div style={{ ...styles.infoBox, marginTop: 12, background: theme.chip }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>📚 Did you know?</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    PCOS/PCOD is one of the most common endocrine disorders, affecting up to 1 in 10 women of childbearing age. With proper management, many women lead healthy lives and even improve fertility.
                  </div>
                </div>
              </div>
            </div>
            

            <div style={styles.card}>
              <div style={styles.cardHeader}>📋 Quick Actions</div>
              <div style={styles.cardBody}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button style={styles.btnPrimary} onClick={() => setActiveTab("cycles")}>➕ Log a Cycle</button>
                  <button style={styles.btnSecondary} onClick={() => setActiveTab("symptoms")}>📝 Log Daily Symptoms</button>
                  <button style={styles.btnSecondary} onClick={() => setActiveTab("medications")}>💊 Add Medication</button>
                  <button style={styles.btnSecondary} onClick={() => setActiveTab("doctor")}>🏥 Record Doctor Visit</button>
                </div>
                <div style={styles.infoBox}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>📊 Did you know?</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    Tracking PCOS/PCOD symptoms can help identify triggers and effective management strategies. You're already taking the first step toward better health!
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "cycles":
        return (
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>➕ Add Cycle</div>
              <div style={styles.cardBody}>
                <div style={styles.label}>📅 Period Start Date</div>
                <input type="date" style={styles.input} value={newCycle.startDate} onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })} />
                <div style={styles.label}>📅 Period End Date</div>
                <input type="date" style={styles.input} value={newCycle.endDate} onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })} />
                <div style={styles.label}>🩸 Flow Type</div>
                <select style={styles.select} value={newCycle.flowType} onChange={(e) => setNewCycle({ ...newCycle, flowType: e.target.value })}>
                  {flowOptions.map(opt => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
                </select>
                <button style={styles.btnPrimary} onClick={addCycle}>Save Cycle</button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>📅 Cycle History</div>
              <div style={styles.cardBody}>
                <div style={styles.list}>
                  {cycles.length === 0 ? (
                    <div style={{ textAlign: "center", color: theme.muted, padding: 20, fontSize: 12 }}>No cycles logged yet</div>
                  ) : (
                    cycles.slice(0, 5).map(cycle => (
                      <div key={cycle._id} style={styles.listItem}>
                        <div><strong>Start:</strong> {new Date(cycle.startDate).toLocaleDateString()}</div>
                        {cycle.endDate && <div><strong>End:</strong> {new Date(cycle.endDate).toLocaleDateString()}</div>}
                        <div><strong>Flow:</strong> {cycle.flowType}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "symptoms":
        return (
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>📝 Log Today's Symptoms</div>
              <div style={styles.cardBody}>
                <div style={styles.symptomGrid}>
                  {commonSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      style={styles.symptomBtn(selectedSymptoms.includes(symptom))}
                      onClick={() => {
                        if (selectedSymptoms.includes(symptom)) {
                          setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                        } else {
                          setSelectedSymptoms([...selectedSymptoms, symptom]);
                        }
                      }}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <textarea 
                  style={styles.textarea} 
                  placeholder="Additional notes (e.g., how you're feeling, any other symptoms...)" 
                  value={dailyNote} 
                  onChange={(e) => setDailyNote(e.target.value)} 
                />
                <button style={styles.btnPrimary} onClick={saveDailyLog}>Save Today's Log</button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>📋 Recent Logs</div>
              <div style={styles.cardBody}>
                <div style={styles.list}>
                  {dailyLog.length === 0 ? (
                    <div style={{ textAlign: "center", color: theme.muted, padding: 20, fontSize: 12 }}>No logs yet</div>
                  ) : (
                    dailyLog.slice(0, 5).map(log => (
                      <div key={log._id} style={styles.listItem}>
                        <div><strong>{new Date(log.date).toLocaleDateString()}</strong></div>
                        <div>Symptoms: {log.symptoms?.slice(0, 4).join(", ")}{log.symptoms?.length > 4 && "..."}</div>
                        {log.note && <div style={{ fontSize: 11, color: theme.muted, marginTop: 4 }}>Note: {log.note.substring(0, 60)}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "lifestyle":
        return (
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>🥗 Log Today's Lifestyle</div>
              <div style={styles.cardBody}>
                <div style={styles.label}>🏃 Exercise</div>
                <select style={styles.select} value={lifestyle.exercise} onChange={(e) => setLifestyle({ ...lifestyle, exercise: e.target.value })}>
                  <option value="">Select</option>
                  {lifestyleOptions.exercise.map(opt => <option key={opt}>{opt}</option>)}
                </select>

                <div style={styles.label}>😴 Sleep</div>
                <select style={styles.select} value={lifestyle.sleep} onChange={(e) => setLifestyle({ ...lifestyle, sleep: e.target.value })}>
                  <option value="">Select</option>
                  {lifestyleOptions.sleep.map(opt => <option key={opt}>{opt}</option>)}
                </select>

                <div style={styles.label}>😰 Stress Level</div>
                <select style={styles.select} value={lifestyle.stress} onChange={(e) => setLifestyle({ ...lifestyle, stress: e.target.value })}>
                  <option value="">Select</option>
                  {lifestyleOptions.stress.map(opt => <option key={opt}>{opt}</option>)}
                </select>

                <div style={styles.label}>🍽️ Meals</div>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="What did you eat today?"
                  value={lifestyle.meals}
                  onChange={(e) => setLifestyle({ ...lifestyle, meals: e.target.value })}
                />

                <button style={styles.btnPrimary} onClick={saveDailyLog}>Save Lifestyle Log</button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>📋 Recent Lifestyle Logs</div>
              <div style={styles.cardBody}>
                <div style={styles.list}>
                  {dailyLog.length === 0 ? (
                    <div style={{ textAlign: "center", color: theme.muted, padding: 20, fontSize: 12 }}>No logs yet</div>
                  ) : (
                    dailyLog.slice(0, 5).map(log => (
                      <div key={log._id} style={styles.listItem}>
                        <div><strong>{new Date(log.date).toLocaleDateString()}</strong></div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>
                          {log.lifestyle?.exercise && `🏃 ${log.lifestyle.exercise} • `}
                          {log.lifestyle?.sleep && `😴 ${log.lifestyle.sleep} • `}
                          {log.lifestyle?.stress && `😰 ${log.lifestyle.stress}`}
                        </div>
                        {log.lifestyle?.meals && (
                          <div style={{ fontSize: 11, marginTop: 2, color: theme.muted }}>
                            🍽️ {log.lifestyle.meals.substring(0, 80)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "medications":
        return (
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>💊 Add Medication/Supplement</div>
              <div style={styles.cardBody}>
                <div style={styles.label}>💊 Medication Name</div>
                <input type="text" style={styles.input} placeholder="Medication name" value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} />
                <div style={styles.label}>📏 Dosage</div>
                <input type="text" style={styles.input} placeholder="Dosage (e.g., 500mg)" value={newMed.dosage} onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })} />
                <div style={styles.label}>⏰ Time</div>
                <input type="text" style={styles.input} placeholder="Time (e.g., morning)" value={newMed.time} onChange={(e) => setNewMed({ ...newMed, time: e.target.value })} />
                <button style={styles.btnPrimary} onClick={addMedication}>Add</button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>📋 My Medications</div>
              <div style={styles.cardBody}>
                <div style={styles.list}>
                  {medications.length === 0 ? (
                    <div style={{ textAlign: "center", color: theme.muted, padding: 20, fontSize: 12 }}>No medications added</div>
                  ) : (
                    medications.map(med => (
                      <div key={med._id} style={styles.listItem}>
                        <div><strong>{med.name}</strong> - {med.dosage}</div>
                        <div style={{ fontSize: 11, color: theme.muted }}>Time: {med.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

        case "doctor":
          return (
            <div style={styles.grid2}>
              {/* Left card – Add Visit */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>🏥 Record Doctor Visit</div>
                <div style={styles.cardBody}>
                  <div style={styles.label}>📅 Visit Date</div>
                  <input type="date" style={styles.input} value={newVisit.date} onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })} />
                  <div style={styles.label}>👨‍⚕️ Doctor's Name</div>
                  <input type="text" style={styles.input} placeholder="Doctor's name" value={newVisit.doctor} onChange={(e) => setNewVisit({ ...newVisit, doctor: e.target.value })} />
                  <div style={styles.label}>📝 Notes</div>
                  <textarea style={styles.textarea} placeholder="Notes from visit" value={newVisit.notes} onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })} />
                  <div style={styles.label}>🔬 Tests Ordered / Results</div>
                  <textarea style={styles.textarea} placeholder="Tests ordered / results" value={newVisit.tests} onChange={(e) => setNewVisit({ ...newVisit, tests: e.target.value })} />
                  <button style={styles.btnPrimary} onClick={addVisit}>Save Visit</button>
                </div>
              </div>

              {/* Right card – Visit History */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>📋 Visit History</div>
                <div style={styles.cardBody}>
                  <div style={styles.list}>
                    {visits.length === 0 ? (
                      <div style={{ textAlign: "center", color: theme.muted, padding: 20, fontSize: 12 }}>No visits recorded</div>
                    ) : (
                      visits.map(visit => (
                        <div key={visit._id} style={styles.listItem}>
                          <div><strong>{new Date(visit.date).toLocaleDateString()}</strong> - {visit.doctor}</div>
                          {visit.notes && <div style={{ fontSize: 11, marginTop: 4 }}>📝 {visit.notes.substring(0, 80)}</div>}
                          {visit.tests && (
                            <div style={{ fontSize: 11, marginTop: 2, color: theme.accent }}>
                              🔬 Tests: {visit.tests.substring(0, 80)}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", padding: "50px" }}>Loading your data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar active="Categories" />

        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.badge}>🌸 PCOS/PCOD Management</span>
          <h1 style={styles.title}>Track Your PCOS/PCOD Journey</h1>
          <p style={styles.subtitle}>Designed for irregular cycles. Track symptoms, medications, and lifestyle factors.</p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{cycleStats.totalCycles}</div>
            <div style={styles.statLabel}>Cycles Tracked</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{cycleStats.avgLength || "—"}</div>
            <div style={styles.statLabel}>Avg Cycle (days)</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{cycleStats.shortest || "—"} - {cycleStats.longest || "—"}</div>
            <div style={styles.statLabel}>Cycle Range</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{cycleStats.lastPeriod ? new Date(cycleStats.lastPeriod).toLocaleDateString() : "—"}</div>
            <div style={styles.statLabel}>Last Period</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={styles.tabBtn(activeTab === "overview")} onClick={() => setActiveTab("overview")}>📊 Overview</button>
          <button style={styles.tabBtn(activeTab === "cycles")} onClick={() => setActiveTab("cycles")}>📅 Cycles</button>
          <button style={styles.tabBtn(activeTab === "symptoms")} onClick={() => setActiveTab("symptoms")}>💭 Symptoms</button>
          <button style={styles.tabBtn(activeTab === "lifestyle")} onClick={() => setActiveTab("lifestyle")}>🥗 Lifestyle</button>
          <button style={styles.tabBtn(activeTab === "medications")} onClick={() => setActiveTab("medications")}>💊 Meds</button>
          <button style={styles.tabBtn(activeTab === "doctor")} onClick={() => setActiveTab("doctor")}>🏥 Doctor</button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Switch to Non-Menstruators */}
        <div style={{ marginBottom: 24, padding: 16, background: theme.chip, borderRadius: 20, textAlign: "center" }}>
          <p style={{ marginBottom: 12, fontSize: 13 }}>🌸 Want to learn about Menstrual Health?</p>
          <button 
            style={{ padding: "10px 24px", borderRadius: 100, background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, border: "none", color: "white", cursor: "pointer" }}
            onClick={() => {
              if (window.confirm("⚠️ Switching to Non-Menstruators category will give you access to the Non-Menstruators content about Menstrual Health. Do you want to proceed?")) {
                localStorage.setItem("cyclecare_role", "women");
                navigate("/girls-awareness");
              }
            }}
          >
            Switch to Menstrual Awareness →
          </button>
        </div>

        {/* Chatbot Section */}
        <div style={styles.chatbotSection} onClick={goToChatbot}>
          <div style={styles.chatbotIcon}>💬</div>
          <div style={styles.chatbotTitle}>Still have questions about PCOS/PCOD?</div>
          <div style={styles.chatbotDesc}>
            Chat with our friendly AI assistant about PCOS/PCOD symptoms, medications, lifestyle changes, or anything else you're curious about.
          </div>
          <button style={styles.chatbotBtn} onClick={goToChatbot}>
            💬 Chat with CycleCare Assistant →
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
          <span style={{ fontSize: 11, color: theme.muted }}>© 2025 CycleCare • PCOS/PCOD Tracker</span>
          <Link to="/category" style={{ ...styles.navLink, fontSize: 11 }}>← Back to Categories</Link>
        </footer>
      </div>
    </div>
  );
}