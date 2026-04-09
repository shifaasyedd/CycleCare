import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

// ---------- Date helpers ----------
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const monthLabel = (d) => d.toLocaleDateString(undefined, { 
    month: "long", 
    year: "numeric" 
});

const flowOptions = ["Light", "Medium", "Heavy", "Spotting", "None"];

const toISO = (d) => {
    if (!(d instanceof Date) || isNaN(d.getTime())) return null;
    // Fixes timezone offset issues
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const parseISO = (s) => {
    if (!s || typeof s !== 'string') return null;
    let dateStr = s.includes('T') ? s.split('T')[0] : s;
    const [y, m, d] = dateStr.split("-").map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
};

const addDays = (date, days) => {
    if (!date) return null;
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const diffDays = (a, b) => {
    const da = parseISO(toISO(a));
    const db = parseISO(toISO(b));
    if (!da || !db) return 0;
    return Math.round((db - da) / (1000 * 60 * 60 * 24));
};

const sameDay = (a, b) => {
  const aStr = toISO(a);
  const bStr = toISO(b);
  if (!aStr || !bStr) return false;
  return aStr === bStr;
};

function buildMonthGrid(viewDate) {
  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const start = addDays(first, -startDow);
  const days = [];
  for (let i = 0; i < 42; i++) days.push(addDays(start, i));
  return { days, month: m, year: y };
}

function pretty(d) {
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Tracker() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [quiz, setQuiz] = useState({ flow: "", activity: "", internalComfort: "" });
  const [activeTab, setActiveTab] = useState("period");
  const [isLoading, setIsLoading] = useState(true);

  // Cycle Form
  const [start, setStart] = useState("");
  const [periodLen, setPeriodLen] = useState(5);
  const [notes, setNotes] = useState("");
  const [flowType, setFlowType] = useState("medium");

  // Data
  const [entries, setEntries] = useState([]);
  
  // Symptom Tracking
  const [dailyLogs, setDailyLogs] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [dailyNote, setDailyNote] = useState("");
  
  // Lifestyle Log
  const [lifestyle, setLifestyle] = useState({
    exercise: "",
    sleep: "",
    stress: "",
    meals: "",
  });
  
  // Medications
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", time: "" });
  
  // Doctor Visits
  const [visits, setVisits] = useState([]);
  const [newVisit, setNewVisit] = useState({ date: "", doctor: "", notes: "", tests: "" });

  // Calendar UI
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showQuiz, setShowQuiz] = useState(false);

  // API setup
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("cyclecare_token");
  // Load all data from database
  useEffect(() => {
    const savedTheme = localStorage.getItem("cyclecare_theme");
    if (savedTheme === "dark") setDark(true);
    
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
      if (cyclesData.success) setEntries(cyclesData.data);
      if (logsData.success) setDailyLogs(logsData.data);
      if (medsData.success) setMedications(medsData.data);
      if (visitsData.success) setVisits(visitsData.data);
      setIsLoading(false);
    }).catch(err => {
      console.error("Error loading data:", err);
      setIsLoading(false);
    });
  }, [token, navigate, API_URL]);

  // Save theme only
  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  // Load today's log when date changes or logs load
  useEffect(() => {
    const todayStr = toISO(new Date());
    const todayLog = dailyLogs.find(log => log.date === todayStr);
    if (todayLog) {
      setSelectedSymptoms(todayLog.symptoms || []);
      setDailyNote(todayLog.note || "");
      setLifestyle(todayLog.lifestyle || { exercise: "", sleep: "", stress: "", meals: "" });
    } else {
      setSelectedSymptoms([]);
      setDailyNote("");
      setLifestyle({ exercise: "", sleep: "", stress: "", meals: "" });
    }
  }, [dailyLogs]);

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
            pink: "#FF6B8B",
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
            pink: "#EC489A",
          },
    [dark]
  );

  // Common symptoms list
  const commonSymptoms = [
    "Cramps", "Bloating", "Fatigue", "Headache", "Mood Swings",
    "Back Pain", "Breast Tenderness", "Nausea", "Acne", "Cravings",
  ];

  const lifestyleOptions = {
    exercise: ["None", "Light walk", "Yoga", "Cardio", "Strength training"],
    sleep: ["< 5 hrs", "5-6 hrs", "7-8 hrs", "> 8 hrs"],
    stress: ["Very low", "Low", "Moderate", "High", "Very high"],
  };

  // Compute avg cycle length
const startsSorted = useMemo(() => {
  const list = entries
    .filter((e) => e.startDate)
    .map((e) => parseISO(e.startDate))
    .filter(d => d !== null)   // filter out invalid dates
    .sort((a, b) => b.getTime() - a.getTime());
  return list;
}, [entries]);

  const avgCycle = useMemo(() => {
    if (startsSorted.length < 2) return 28;
    const lens = [];
    for (let i = 0; i < startsSorted.length - 1; i++) {
      const cur = startsSorted[i];
      const prev = startsSorted[i + 1];
      const len = diffDays(prev, cur) * -1;
      if (len >= 15 && len <= 60) lens.push(len);
    }
    if (lens.length === 0) return 28;
    return Math.round(lens.reduce((a, b) => a + b, 0) / lens.length);
  }, [startsSorted]);

  const lastStart = useMemo(() => (startsSorted[0] ? startsSorted[0] : null), [startsSorted]);

  const typicalPeriodLen = useMemo(() => {
    const latest = entries
      .filter((e) => Number.isFinite(e.periodLen))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
    const v = latest?.periodLen;
    return clamp(Number(v || periodLen || 5), 1, 10);
  }, [entries, periodLen]);

  // Phase Colors
  const phaseColors = useMemo(
    () => ({
      Menstrual: theme.pink,
      Follicular: theme.purple,
      Ovulatory: theme.yellow,
      Luteal: theme.blue,
    }),
    [theme]
  );

function cycleStartForDate(date) {
  if (!lastStart) return null;
  if (!(date instanceof Date) || isNaN(date.getTime())) return null;
  for (let i = 0; i < startsSorted.length; i++) {
    if (startsSorted[i].getTime() <= date.getTime()) return startsSorted[i];
  }
  let s = new Date(lastStart);
  let guard = 0;
  while (s.getTime() > date.getTime() && guard < 24) {
    s = addDays(s, -avgCycle);
    if (!s) break;
    guard++;
  }
  return s;
}

  function phaseForDate(date) {
    if (!lastStart) return null;
    let s = cycleStartForDate(date);
    if (!s) return null;
    let dayInCycle = diffDays(s, date) + 1;
    while (dayInCycle > avgCycle) {
      s = addDays(s, avgCycle);
      dayInCycle = diffDays(s, date) + 1;
    }
    const pLen = typicalPeriodLen;
    const ovulationDay = clamp(avgCycle - 14, 8, 25);
    const fertileStartDay = clamp(ovulationDay - 2, 1, avgCycle);
    const fertileEndDay = clamp(ovulationDay + 2, 1, avgCycle);

    let phase = "Luteal";
    if (dayInCycle >= 1 && dayInCycle <= pLen) phase = "Menstrual";
    else if (dayInCycle >= fertileStartDay && dayInCycle <= fertileEndDay) phase = "Ovulatory";
    else if (dayInCycle > pLen && dayInCycle < fertileStartDay) phase = "Follicular";
    else phase = "Luteal";

    let phaseDay = 1, phaseTotal = 1;
    if (phase === "Menstrual") {
      phaseDay = dayInCycle;
      phaseTotal = pLen;
    } else if (phase === "Follicular") {
      phaseDay = dayInCycle - pLen;
      phaseTotal = Math.max(1, fertileStartDay - pLen - 1);
    } else if (phase === "Ovulatory") {
      phaseDay = dayInCycle - fertileStartDay + 1;
      phaseTotal = fertileEndDay - fertileStartDay + 1;
    } else {
      phaseDay = dayInCycle - fertileEndDay;
      phaseTotal = Math.max(1, avgCycle - fertileEndDay);
    }
    return { phase, dayInCycle, phaseDay, phaseTotal };
  }

  const selectedInfo = useMemo(() => phaseForDate(selectedDate), [
    selectedDate, avgCycle, typicalPeriodLen, lastStart, phaseForDate
  ]);

  const getRecommendation = () => {
    const { flow, activity, internalComfort } = quiz;
    if (!flow || !activity || !internalComfort) {
      return "✨ Answer all 3 questions to get a personalized recommendation";
    }
    if (internalComfort === "no") {
      if (flow === "heavy") return "🌟 Try heavy-flow pads or period underwear";
      return "🌸 Regular pads or pantyliners are perfect for starting out";
    }
    if (activity === "yes" && internalComfort === "yes") {
      if (flow === "heavy") return "💪 A menstrual cup is excellent for heavy flow and active days";
      return "🏊‍♀️ Tampons or a menstrual cup work well for swimming and active lifestyles";
    }
    if (flow === "heavy") return "🩸 A menstrual cup or heavy-flow pad would work best";
    return "🌷 Start with pads, and explore tampons or cups when you feel ready";
  };

  const addEntry = () => {
    if (!start) return alert("Please select a Period Start Date.");
    const p = clamp(Number(periodLen || 5), 1, 10);
    
    const cycleData = {
      startDate: start,
      periodLen: p,
      flowType: flowType,   // <-- use state
      notes: notes.trim(),
    };
    
    fetch(`${API_URL}/api/tracker/cycles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cycleData)
    })
      .then(res => res.json())
      .then(data => {
      if (data.success) {
        setEntries([data.data, ...entries]);
        setStart("");
        setPeriodLen(5);
        setFlowType("medium");
        setNotes("");
        const newDate = new Date(data.data.startDate);
        if (!isNaN(newDate.getTime())) setSelectedDate(newDate);
        alert("Cycle saved! ✅");
      }else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Error saving cycle:", err);
        alert("Network error. Please try again.");
      });
  };

  const clearAll = () => {
    if (window.confirm("Clear all saved cycle data?")) {
      setEntries([]);
    }
  };

  const saveDailyLog = () => {
    const today = toISO(new Date());
    
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
          // Update the dailyLogs state
          const existingIndex = dailyLogs.findIndex(log => log.date === today);
          if (existingIndex !== -1) {
            const updatedLogs = [...dailyLogs];
            updatedLogs[existingIndex] = data.data;
            setDailyLogs(updatedLogs);
          } else {
            setDailyLogs([data.data, ...dailyLogs]);
          }
          alert("Daily log saved! ✅");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Error saving daily log:", err);
        alert("Network error. Please try again.");
      });
  };

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
          alert("Medication saved! ✅");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Error saving medication:", err);
        alert("Network error. Please try again.");
      });
  };

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
          alert("Doctor visit saved! ✅");
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

  const phaseDescriptions = {
    Menstrual: { emoji: "🩸", tip: "Heating pads, rest, hydration", color: theme.pink },
    Follicular: { emoji: "🌱", tip: "Exercise, nutritious foods, set goals", color: theme.purple },
    Ovulatory: { emoji: "🥚", tip: "Track fertility, enjoy peak energy", color: theme.yellow },
    Luteal: { emoji: "🌙", tip: "Self-care, manage stress, rest", color: theme.blue },
  };

  const CARD_HEIGHT = "500px";

  const styles = {
    page: {
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif",
      background: dark
        ? `radial-gradient(circle at 0% 0%, rgba(255,107,139,0.1), transparent 40%), ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229,76,111,0.05), transparent 40%), ${theme.bg}`,
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
      padding: "10px 24px",
      marginTop: 20,
      borderRadius: 100,
      background: dark ? "rgba(20,20,28,0.9)" : "rgba(255,255,255,0.9)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${theme.border}`,
    },
    brand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logo: { height: 40, width: "auto" },
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
      padding: "6px 12px",
      borderRadius: 100,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      fontSize: 13,
    },

    hero: {
      marginTop: 32,
      marginBottom: 24,
      padding: 32,
      borderRadius: 28,
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
      color: theme.accent,
      marginBottom: 12,
    },
    title: { fontSize: 32, fontWeight: 800, margin: "0 0 8px" },
    subtitle: { fontSize: 13, color: theme.muted },

    topInfo: {
      marginTop: 20,
      marginBottom: 20,
      padding: 20,
      borderRadius: 24,
      background: `linear-gradient(135deg, ${theme.gradientStart}10, ${theme.gradientEnd}10)`,
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    },
    cycleDay: { fontSize: 36, fontWeight: 800, color: theme.accent },
    phaseText: { fontSize: 14, fontWeight: 600, marginTop: 4 },

    mainTabs: {
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

    legend: {
      display: "flex",
      justifyContent: "center",
      gap: 20,
      marginBottom: 20,
    },
    legendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 11 },
    legendDot: (color) => ({ width: 10, height: 10, borderRadius: 999, background: color }),

    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1.2fr",
      gap: 24,
      marginBottom: 24,
    },

    leftCard: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 24,
      height: CARD_HEIGHT,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    rightCard: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 24,
      height: CARD_HEIGHT,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    cardHeader: {
      padding: "16px 20px 12px 20px",
      borderBottom: `1px solid ${theme.border}`,
      fontWeight: 700,
      fontSize: 16,
      background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
    },
    cardBody: {
      flex: 1,
      overflowY: "auto",
      padding: "16px 20px",
    },

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
      transition: "all 0.2s",
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
    label: { fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" },

    row: { display: "flex", gap: 10 },
    btnPrimary: {
      padding: "8px 20px",
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
    },
    btnSecondary: {
      padding: "8px 20px",
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.text,
    },

    calendarHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    monthTitle: { fontSize: 18, fontWeight: 700 },
    navBtn: {
      padding: "6px 14px",
      borderRadius: 100,
      background: theme.chip,
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      fontSize: 13,
    },

    weekDays: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 6,
      marginBottom: 8,
    },
    weekDay: { textAlign: "center", fontSize: 11, fontWeight: 600, color: theme.muted },

    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 6,
    },
    dayBtn: (inMonth, isSelected, isToday, bg) => ({
      aspectRatio: "1",
      borderRadius: 10,
      border: isSelected ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
      background: bg || theme.chip,
      color: inMonth ? theme.text : theme.muted,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: isToday ? 700 : 500,
      fontSize: 12,
      transition: "all 0.2s",
    }),

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
      transition: "all 0.2s",
    }),

    select: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: 10,
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "white",
      color: theme.text,
      fontSize: 12,
      marginBottom: 10,
      outline: "none",
    },

    list: {
      maxHeight: "140px",
      overflowY: "auto",
    },
    listItem: {
      padding: "8px 0",
      borderBottom: `1px solid ${theme.border}`,
      fontSize: 12,
    },

    phaseGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 12,
    },
    phaseCard: (bgColor) => ({
      padding: 12,
      borderRadius: 14,
      background: bgColor,
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    }),

    infoBox: {
      marginTop: 12,
      padding: 12,
      background: theme.chip,
      borderRadius: 12,
    },

    quizSection: {
      marginTop: 16,
      padding: 16,
      borderRadius: 16,
      background: theme.chip,
      border: `1px solid ${theme.border}`,
    },

    chatbotSection: {
      marginTop: 24,
      marginBottom: 24,
      padding: 32,
      borderRadius: 28,
      background: `linear-gradient(135deg, ${theme.gradientStart}10, ${theme.gradientEnd}10)`,
      border: `2px solid ${theme.accent}`,
      textAlign: "center",
      cursor: "pointer",
      transition: "transform 0.2s",
    },
    chatbotIcon: { fontSize: 48, marginBottom: 16 },
    chatbotTitle: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
    chatbotDesc: { fontSize: 14, color: theme.muted, marginBottom: 20, lineHeight: 1.5, maxWidth: 500, margin: "0 auto 20px auto" },
    chatbotBtn: {
      padding: "12px 32px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      transition: "transform 0.2s",
    },

    footer: {
      padding: "20px 0",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 20,
    },

    "@media (max-width: 1024px)": {
      grid2: { gridTemplateColumns: "1fr", gap: 20 },
      leftCard: { height: "auto", minHeight: "450px" },
      rightCard: { height: "auto", minHeight: "450px" },
      symptomGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
    },
    "@media (max-width: 640px)": {
      title: { fontSize: 24 },
      navLinks: { display: "none" },
      hero: { padding: 20 },
      leftCard: { padding: 16 },
      rightCard: { padding: 16 },
      symptomGrid: { gridTemplateColumns: "1fr" },
      phaseGrid: { gridTemplateColumns: "1fr" },
      chatbotTitle: { fontSize: 20 },
      chatbotSection: { padding: 24 },
    },
  };

  const month = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const today = useMemo(() => new Date(), []);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const getTodayLog = () => {
    const todayStr = toISO(new Date());
    return dailyLogs.find(log => log.date === todayStr);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case "period":
        return (
          <>
            <div style={styles.label}>📅 Period Start Date</div>
            <input type="date" style={styles.input} value={start} onChange={(e) => setStart(e.target.value)} />
            
            <div style={styles.label}>⏱️ Period Length (days)</div>
            <input type="number" min="1" max="10" style={styles.input} value={periodLen} onChange={(e) => setPeriodLen(e.target.value)} />
            
            {/* NEW: Flow Type Selector */}
            <div style={styles.label}>🩸 Flow Type</div>
            <select 
              style={styles.select} 
              value={flowType} 
              onChange={(e) => setFlowType(e.target.value)}
            >
              {flowOptions.map(opt => (
                <option key={opt} value={opt.toLowerCase()}>{opt}</option>
              ))}
            </select>
            
            <div style={styles.label}>📝 Notes</div>
            <textarea style={styles.textarea} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How are you feeling? Any symptoms?" />
            
            <div style={styles.row}>
              <button style={styles.btnPrimary} onClick={addEntry}>Save Cycle</button>
              <button style={styles.btnSecondary} onClick={clearAll}>Clear All</button>
            </div>
            <div style={styles.infoBox}>
              <div style={{ fontSize: 12 }}>📊 <strong>Your Stats:</strong> Avg {avgCycle}d cycle • Period {typicalPeriodLen}d</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>📅 Recent Cycles</div>
              <div style={styles.list}>
                {entries.slice(0, 4).map(cycle => (
                  <div key={cycle._id} style={styles.listItem}>
                    {new Date(cycle.startDate).toLocaleDateString()} • {cycle.periodLen} days • Flow: {cycle.flowType || "medium"}
                  </div>
                ))}
                {entries.length === 0 && <div style={{ padding: 6, fontSize: 11, color: theme.muted }}>No cycles logged yet</div>}
              </div>
            </div>

            {/* Product Quiz (unchanged) */}
            <div style={styles.quizSection}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>❓ Product Finder</div>
                <button style={{ fontSize: 11, background: "transparent", border: "none", cursor: "pointer", color: theme.accent }} onClick={() => setShowQuiz(!showQuiz)}>
                  {showQuiz ? "Hide" : "Show"}
                </button>
              </div>
              {showQuiz && (
                <>
                  <select style={styles.select} value={quiz.flow} onChange={(e) => setQuiz({ ...quiz, flow: e.target.value })}>
                    <option value="">How heavy is your flow?</option>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                  <select style={styles.select} value={quiz.activity} onChange={(e) => setQuiz({ ...quiz, activity: e.target.value })}>
                    <option value="">Do you swim or stay active?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <select style={styles.select} value={quiz.internalComfort} onChange={(e) => setQuiz({ ...quiz, internalComfort: e.target.value })}>
                    <option value="">Comfortable with internal products?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <div style={{ marginTop: 12, padding: 10, background: theme.chip, borderRadius: 10, fontSize: 12 }}>
                    {getRecommendation()}
                  </div>
                </>
              )}
            </div>
          </>
        );

      case "symptoms":
        return (
          <>
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
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>📋 Recent Logs</div>
              <div style={styles.list}>
                {dailyLogs.slice(0, 5).map(log => (
                  <div key={log._id} style={styles.listItem}>
                    <strong>{new Date(log.date).toLocaleDateString()}</strong>
                    <div>Symptoms: {log.symptoms?.slice(0, 3).join(", ")}{log.symptoms?.length > 3 && "..."}</div>
                    {log.note && <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>Note: {log.note.substring(0, 60)}</div>}
                  </div>
                ))}
                {dailyLogs.length === 0 && <div style={{ padding: 6, fontSize: 11, color: theme.muted }}>No logs yet</div>}
              </div>
            </div>
          </>
        );

      case "lifestyle":
        return (
          <>
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
            <input type="text" style={styles.input} placeholder="What did you eat today?" value={lifestyle.meals} onChange={(e) => setLifestyle({ ...lifestyle, meals: e.target.value })} />
            
            <button style={styles.btnPrimary} onClick={saveDailyLog}>Save Lifestyle Log</button>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>📋 Recent Lifestyle Logs</div>
              <div style={styles.list}>
                {dailyLogs.slice(0, 5).map(log => (
                  <div key={log._id} style={styles.listItem}>
                    <div style={{ fontWeight: 500 }}>{new Date(log.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: 10, color: theme.muted, marginTop: 2 }}>
                      {log.lifestyle?.exercise && `🏃 ${log.lifestyle.exercise} • `}
                      {log.lifestyle?.sleep && `😴 ${log.lifestyle.sleep} • `}
                      {log.lifestyle?.stress && `😰 ${log.lifestyle.stress}`}
                    </div>
                    {log.lifestyle?.meals && (
                      <div style={{ fontSize: 10, color: theme.muted, marginTop: 2 }}>
                        🍽️ {log.lifestyle.meals.substring(0, 50)}{log.lifestyle.meals.length > 50 ? '…' : ''}
                      </div>
                    )}
                  </div>
                ))}
                {dailyLogs.length === 0 && (
                  <div style={{ padding: 6, fontSize: 11, color: theme.muted }}>No lifestyle logs yet</div>
                )}
              </div>
            </div>
          </>
        );
    
      case "medications":
        return (
          <>
            <div style={styles.label}>💊 Medication Name</div>
            <input type="text" style={styles.input} placeholder="e.g., Ibuprofen" value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} />
            <div style={styles.label}>📏 Dosage</div>
            <input type="text" style={styles.input} placeholder="e.g., 200mg" value={newMed.dosage} onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })} />
            <div style={styles.label}>⏰ Time</div>
            <input type="text" style={styles.input} placeholder="e.g., Morning, with food" value={newMed.time} onChange={(e) => setNewMed({ ...newMed, time: e.target.value })} />
            <button style={styles.btnPrimary} onClick={addMedication}>Add Medication</button>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>📋 My Medications</div>
              <div style={styles.list}>
                {medications.length === 0 ? (
                  <div style={{ padding: 6, fontSize: 11, color: theme.muted }}>No medications added</div>
                ) : (
                  medications.map(med => (
                    <div key={med._id} style={styles.listItem}>
                      <strong>{med.name}</strong> - {med.dosage} • {med.time}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );

      case "doctor":
        return (
          <>
            <div style={styles.label}>📅 Visit Date</div>
            <input type="date" style={styles.input} value={newVisit.date} onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })} />
            
            <div style={styles.label}>👨‍⚕️ Doctor's Name</div>
            <input type="text" style={styles.input} placeholder="Dr. Name" value={newVisit.doctor} onChange={(e) => setNewVisit({ ...newVisit, doctor: e.target.value })} />
            
            <div style={styles.label}>📝 Notes</div>
            <textarea style={styles.textarea} placeholder="What did the doctor say?" value={newVisit.notes} onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })} />
            
            <div style={styles.label}>🔬 Tests Ordered / Results</div>
            <textarea style={styles.textarea} placeholder="Tests and results" value={newVisit.tests} onChange={(e) => setNewVisit({ ...newVisit, tests: e.target.value })} />
            
            <button style={styles.btnPrimary} onClick={addVisit}>Save Visit</button>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>📋 Visit History</div>
              <div style={styles.list}>
                {visits.length === 0 ? (
                  <div style={{ padding: 6, fontSize: 11, color: theme.muted }}>No visits recorded</div>
                ) : (
                  visits.map(visit => (
                    <div key={visit._id} style={styles.listItem}>
                      <div><strong>{new Date(visit.date).toLocaleDateString()}</strong> - {visit.doctor}</div>
                      {visit.notes && <div style={{ fontSize: 11, marginTop: 2 }}>📝 {visit.notes.substring(0, 60)}</div>}
                      {visit.tests && <div style={{ fontSize: 11, marginTop: 2, color: theme.accent }}>🔬 {visit.tests.substring(0, 60)}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );
      case "phases":
        return (
          <div style={styles.phaseGrid}>
            {Object.entries(phaseDescriptions).map(([phase, info]) => (
              <div key={phase} style={styles.phaseCard(info.color + "20")}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{info.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{phase}</div>
                <div style={{ fontSize: 11, marginTop: 6, color: theme.muted }}>{info.tip}</div>
              </div>
            ))}
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
        {/* Navigation */}
        <nav style={styles.nav}>
          <div style={styles.brand} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={styles.logo} />
            <div>
              <div style={styles.brandName}>CycleCare</div>
              <div style={styles.brandTagline}>Period Tracker</div>
            </div>
          </div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/about" style={styles.navLink}>About</Link>
            <Link to="/contact" style={styles.navLink}>Contact</Link>
            <Link to="/profile" style={styles.navLink}>Profile</Link>
            <Link to="/pcos-tracker" style={styles.navLink}>PCOS/PCOD</Link>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Tracker</span>
          </div>
          <div style={styles.themeToggle} onClick={() => setDark(v => !v)}>
            {dark ? "☀️" : "🌙"}
          </div>
        </nav>

        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.badge}>🌸 Track Your Cycle</span>
          <h1 style={styles.title}>Period Tracker</h1>
          <p style={styles.subtitle}>Track, understand, and manage your menstrual health with ease</p>
        </div>

        {/* Current Cycle Info */}
        <div style={styles.topInfo}>
          <div style={styles.cycleDay}>{selectedInfo?.phase || "—"} Phase - Day {selectedInfo?.phaseDay || "—"} of {selectedInfo?.phaseTotal || "—"}</div>
          <div style={styles.phaseText}>Cycle Day {selectedInfo?.dayInCycle ?? "—"}</div>
        </div>

        {/* Tabs */}
        <div style={styles.mainTabs}>
          <button style={styles.tabBtn(activeTab === "period")} onClick={() => setActiveTab("period")}>📅 Period</button>
          <button style={styles.tabBtn(activeTab === "symptoms")} onClick={() => setActiveTab("symptoms")}>💭 Symptoms</button>
          <button style={styles.tabBtn(activeTab === "lifestyle")} onClick={() => setActiveTab("lifestyle")}>🥗 Lifestyle</button>
          <button style={styles.tabBtn(activeTab === "medications")} onClick={() => setActiveTab("medications")}>💊 Meds</button>
          <button style={styles.tabBtn(activeTab === "doctor")} onClick={() => setActiveTab("doctor")}>🏥 Doctor</button>
          <button style={styles.tabBtn(activeTab === "phases")} onClick={() => setActiveTab("phases")}>🌙 Phases</button>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          <div style={styles.legendItem}><span style={styles.legendDot(phaseColors.Menstrual)} /> Menstrual (Pink)</div>
          <div style={styles.legendItem}><span style={styles.legendDot(phaseColors.Follicular)} /> Follicular (Purple)</div>
          <div style={styles.legendItem}><span style={styles.legendDot(phaseColors.Ovulatory)} /> Ovulatory (Yellow)</div>
          <div style={styles.legendItem}><span style={styles.legendDot(phaseColors.Luteal)} /> Luteal (Blue)</div>
        </div>

        {/* Main Grid */}
        <div style={styles.grid2}>
          {/* Left Column */}
          <div style={styles.leftCard}>
            <div style={styles.cardHeader}>
              {activeTab === "period" && "📅 Add Your Cycle"}
              {activeTab === "symptoms" && "💭 Log Symptoms"}
              {activeTab === "lifestyle" && "🥗 Lifestyle Log"}
              {activeTab === "medications" && "💊 Medications"}
              {activeTab === "doctor" && "🏥 Doctor Visits"}
              {activeTab === "phases" && "🌙 Cycle Phases"}
            </div>
            <div style={styles.cardBody}>
              {renderTabContent()}
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div style={styles.rightCard}>
            <div style={styles.cardHeader}>📅 Calendar</div>
            <div style={styles.cardBody}>
              <div style={styles.calendarHeader}>
                <button style={styles.navBtn} onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>←</button>
                <span style={styles.monthTitle}>{monthLabel(viewDate)}</span>
                <button style={styles.navBtn} onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>→</button>
              </div>

              <div style={styles.weekDays}>
                {weekDays.map(day => <div key={day} style={styles.weekDay}>{day}</div>)}
              </div>

              <div style={styles.calendarGrid}>
                {month.days.map((d) => {
                  const inMonth = d.getMonth() === month.month;
                  const info = phaseForDate(d);
                  const bg = info ? phaseColors[info.phase] : null;
                  const isSelected = sameDay(d, selectedDate);
                  const isToday = sameDay(d, today);
                  return (
                    <button
                      key={toISO(d)}
                      style={styles.dayBtn(inMonth, isSelected, isToday, bg)}
                      onClick={() => setSelectedDate(d)}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>

              <div style={styles.infoBox}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>📌 {pretty(selectedDate)}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  {selectedInfo ? `${selectedInfo.phase} • Day ${selectedInfo.dayInCycle}` : "Select a date to see phase details"}
                </div>
              </div>

              {getTodayLog() && (
                <div style={styles.infoBox}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>📝 Today's Log</div>
                  {getTodayLog().symptoms?.length > 0 && (
                    <div style={{ fontSize: 10, marginTop: 4 }}>✓ {getTodayLog().symptoms.slice(0, 4).join(", ")}</div>
                  )}
                  {getTodayLog().note && (
                    <div style={{ fontSize: 10, marginTop: 2, color: theme.muted }}>📝 {getTodayLog().note.substring(0, 60)}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

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
        <div 
          style={styles.chatbotSection} 
          onClick={goToChatbot}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={styles.chatbotIcon}>💬</div>
          <div style={styles.chatbotTitle}>Need help understanding your cycle?</div>
          <div style={styles.chatbotDesc}>
            Chat with our friendly AI assistant about period tracking, symptoms, cycle phases, or anything else you're curious about.
          </div>
          <button 
            style={styles.chatbotBtn} 
            onClick={goToChatbot}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
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
          <span style={{ fontSize: 11, color: theme.muted }}>© 2025 CycleCare • Period Tracker</span>
          <Link to="/category" style={{ ...styles.navLink, fontSize: 11 }}>← Back to Categories</Link>
        </footer>
      </div>
    </div>
  );
}