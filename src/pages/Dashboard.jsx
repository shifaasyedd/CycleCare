<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("cyclecare_theme");
    if (savedTheme === "dark") setDark(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("cyclecare_token");
=======
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";
import logo from "../assets/cyclecare-logo.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("cyclecare_token");

  // ---------- Auth gate ----------
  useEffect(() => {
>>>>>>> 168d7c5cba798b3548c411062c06277c019d53dc
    if (!token) {
      navigate("/login");
      return;
    }
<<<<<<< HEAD

    const fetchData = async () => {
      try {
        const [dashRes, insightsRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/data`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/api/dashboard/insights`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const dashData = await dashRes.json();
        const insightsData = await insightsRes.json();

        if (dashData.success) setData(dashData.data);
        if (insightsData.success) setInsights(insightsData.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const theme = dark
    ? { bg: "#0A0A0F", card: "#151520", border: "#2a2a3a", text: "#E8E8EC", muted: "#8888A0", accent: "#A78BFA", accentLight: "#C4B5FD", success: "#34D399", warning: "#FBBF24", danger: "#F87171" }
    : { bg: "#F8F9FC", card: "#FFFFFF", border: "#E5E7EB", text: "#1F2937", muted: "#6B7280", accent: "#7C3AED", accentLight: "#A78BFA", success: "#10B981", warning: "#F59E0B", danger: "#EF4444" };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "24px",
      background: theme.bg,
      color: theme.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    nav: {
      display: "flex",
      gap: "16px",
      alignItems: "center",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
      marginBottom: "24px",
    },
    card: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    statCard: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    statIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    },
    statValue: {
      fontSize: "28px",
      fontWeight: "700",
    },
    statLabel: {
      fontSize: "13px",
      color: theme.muted,
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    chartContainer: {
      height: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.muted,
    },
    barChart: {
      display: "flex",
      alignItems: "flex-end",
      gap: "8px",
      height: "160px",
      padding: "0 8px",
    },
    bar: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    },
    barFill: {
      width: "100%",
      borderRadius: "6px 6px 0 0",
      transition: "height 0.3s ease",
    },
    barLabel: {
      fontSize: "11px",
      color: theme.muted,
    },
    insightCard: {
      padding: "16px",
      borderRadius: "12px",
      marginBottom: "12px",
      border: `1px solid ${theme.border}`,
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    },
    predictionBox: {
      background: `linear-gradient(135deg, ${theme.accent}15, ${theme.accentLight}10)`,
      border: `1px solid ${theme.accent}30`,
      borderRadius: "16px",
      padding: "24px",
      textAlign: "center",
      marginBottom: "24px",
    },
    predictionDate: {
      fontSize: "32px",
      fontWeight: "800",
      color: theme.accent,
    },
    backBtn: {
      textDecoration: "none",
      color: theme.text,
      padding: "8px 16px",
      borderRadius: "8px",
      background: theme.card,
      border: `1px solid ${theme.border}`,
      fontSize: "14px",
    },
=======
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
  }, [token, navigate]);

  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  // ---------- Fetch dashboard data ----------
  const fetchAll = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const [dataRes, insightsRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/data`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/dashboard/insights`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (dataRes.ok) {
        const dataJson = await dataRes.json();
        if (dataJson.success) setData(dataJson.data);
      } else if (dataRes.status === 401) {
        navigate("/login");
        return;
      }

      if (insightsRes.ok) {
        const insightsJson = await insightsRes.json();
        if (insightsJson.success) setInsights(insightsJson.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, navigate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ---------- Theme ----------
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
            chip: "rgba(255, 107, 139, 0.15)",
            gradientStart: "#FF6B8B",
            gradientEnd: "#FF8EAA",
            green: "#4ADE80",
            blue: "#60A5FA",
            yellow: "#FBBF24",
            red: "#FB7185",
          }
        : {
            bg: "#FFF9FB",
            card: "rgba(255, 245, 248, 0.95)",
            border: "rgba(229, 76, 111, 0.2)",
            text: "#2D1B23",
            muted: "rgba(45, 27, 35, 0.65)",
            accent: "#E54C6F",
            accentLight: "#FB7185",
            chip: "rgba(229, 76, 111, 0.08)",
            gradientStart: "#E54C6F",
            gradientEnd: "#FF8EAA",
            green: "#16A34A",
            blue: "#3B82F6",
            yellow: "#D97706",
            red: "#DC2626",
          },
    [dark]
  );

  // ---------- Derived chart data ----------
  const flowChartData = useMemo(() => {
    if (!data?.flowDistribution) return [];
    const colors = { light: "#FBBF24", medium: "#FB7185", heavy: "#DC2626", spotting: "#A78BFA" };
    return Object.entries(data.flowDistribution)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: v, color: colors[k] }));
  }, [data]);

  const symptomChartData = useMemo(() => {
    if (!data?.symptomCounts) return [];
    return data.symptomCounts.map(([name, count]) => ({ name, count }));
  }, [data]);

  const cyclesTimelineData = useMemo(() => {
    if (!data?.cycles) return [];
    return [...data.cycles]
      .reverse()
      .map((c, idx) => ({
        cycle: `#${idx + 1}`,
        length: c.periodLen || 0,
        date: new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }));
  }, [data]);

  const lifestyleData = useMemo(() => {
    if (!data?.lifestyle) return { sleep: [], stress: [], exercise: [] };
    const toArr = (obj) =>
      Object.entries(obj)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({ name: k, value: v }));
    return {
      sleep: toArr(data.lifestyle.sleep),
      stress: toArr(data.lifestyle.stress),
      exercise: toArr(data.lifestyle.exercise),
    };
  }, [data]);

  const daysUntilNext = useMemo(() => {
    if (!insights?.prediction) return null;
    const days = Math.round((new Date(insights.prediction) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  }, [insights]);

  const insightTypeColor = (type) => {
    if (type === "success") return theme.green;
    if (type === "warning") return theme.yellow;
    if (type === "tip") return theme.blue;
    return theme.accent;
  };

  const insightTypeIcon = (type) => {
    if (type === "success") return "✅";
    if (type === "warning") return "⚠️";
    if (type === "tip") return "💡";
    return "ℹ️";
  };

  // ---------- Styles ----------
  const styles = {
    page: {
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      background: dark
        ? `radial-gradient(circle at 0% 0%, rgba(255, 107, 139, 0.1), transparent 40%),
           radial-gradient(circle at 100% 100%, rgba(255, 142, 170, 0.08), transparent 50%),
           ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229, 76, 111, 0.05), transparent 40%),
           radial-gradient(circle at 100% 100%, rgba(251, 113, 133, 0.08), transparent 50%),
           ${theme.bg}`,
      color: theme.text,
    },
    container: { maxWidth: 1280, margin: "0 auto", padding: "0 24px" },
    nav: {
      position: "sticky", top: 20, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
      padding: "10px 20px", marginTop: 20, borderRadius: 100,
      background: dark ? "rgba(20, 20, 28, 0.9)" : "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)", border: `1px solid ${theme.border}`,
    },
    brand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logo: { height: 40 },
    brandName: { fontSize: 16, fontWeight: 700 },
    brandTagline: { fontSize: 9, color: theme.muted },
    navLinks: { display: "flex", gap: 4 },
    navLink: { padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer", color: theme.muted, textDecoration: "none" },
    navLinkActive: { color: theme.accent, background: theme.chip },
    themeToggle: { padding: "6px 12px", borderRadius: 100, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)", border: `1px solid ${theme.border}`, cursor: "pointer", fontSize: 11 },
    hero: { marginTop: 32, padding: 32, borderRadius: 32, background: theme.card, border: `1px solid ${theme.border}`, textAlign: "center" },
    badge: { display: "inline-block", padding: "4px 12px", borderRadius: 100, background: theme.chip, fontSize: 11, color: theme.accent, marginBottom: 12 },
    title: { fontSize: 28, fontWeight: 800, margin: "0 0 8px" },
    subtitle: { fontSize: 12, color: theme.muted },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 32, marginBottom: 32 },
    statCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: 24, textAlign: "center" },
    statIcon: { fontSize: 28, marginBottom: 8 },
    statValue: { fontSize: 32, fontWeight: 800, color: theme.accent },
    statLabel: { fontSize: 12, color: theme.muted, marginTop: 8 },
    statSub: { fontSize: 10, color: theme.muted, marginTop: 4 },
    predictionCard: {
      marginBottom: 32,
      padding: 28,
      borderRadius: 28,
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      color: "white",
      textAlign: "center",
      border: `1px solid ${theme.border}`,
    },
    predictionLabel: { fontSize: 12, opacity: 0.9, marginBottom: 8 },
    predictionValue: { fontSize: 36, fontWeight: 800, marginBottom: 4 },
    predictionSub: { fontSize: 12, opacity: 0.85 },
    chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24, marginBottom: 32 },
    chartCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: 24 },
    chartTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
    insightsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 },
    insightCard: (color) => ({
      background: theme.card,
      border: `1px solid ${color}40`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 16,
      padding: 20,
    }),
    insightTitle: { fontSize: 14, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 },
    insightMessage: { fontSize: 12, color: theme.muted, lineHeight: 1.5 },
    lifestyleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 32 },
    lifestyleCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 20 },
    lifestyleTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12 },
    lifestyleRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, borderBottom: `1px solid ${theme.border}` },
    emptyState: { textAlign: "center", padding: "40px 20px", color: theme.muted, fontSize: 13 },
    errorBox: { padding: 16, borderRadius: 16, background: theme.red + "15", border: `1px solid ${theme.red}`, color: theme.red, fontSize: 13, textAlign: "center", marginTop: 24 },
    footer: { padding: "24px 0", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", marginTop: 24 },
    refreshBtn: { padding: "8px 18px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, border: "none", color: "white", marginTop: 16 },
>>>>>>> 168d7c5cba798b3548c411062c06277c019d53dc
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
<<<<<<< HEAD
        <div style={{ fontSize: "18px", color: theme.muted }}>Loading dashboard...</div>
=======
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 14, color: theme.muted }}>Loading your dashboard...</div>
        </div>
>>>>>>> 168d7c5cba798b3548c411062c06277c019d53dc
      </div>
    );
  }

<<<<<<< HEAD
  const cycleHistory = data?.cycles || [];
  const flowData = data?.flowDistribution || { light: 0, medium: 0, heavy: 0, spotting: 0 };
  
  const getBarHeight = (val, max) => max > 0 ? (val / max) * 120 : 0;
  const flowMax = Math.max(...Object.values(flowData), 1);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={{ fontSize: "24px" }}>&#128202;</span> Dashboard
        </h1>
        <div style={styles.nav}>
          <button
            onClick={() => { setDark(!dark); localStorage.setItem("cyclecare_theme", dark ? "light" : "dark"); }}
            style={{ ...styles.backBtn, cursor: "pointer" }}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <Link to="/tracker" style={styles.backBtn}>← Back to Tracker</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${theme.accent}20` }}>📅</div>
            <div>
              <div style={styles.statValue}>{data?.stats?.avgCycleLength || "--"}</div>
              <div style={styles.statLabel}>Avg Cycle Length (days)</div>
            </div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${theme.success}20` }}>🩸</div>
            <div>
              <div style={styles.statValue}>{data?.stats?.avgPeriodLength || "--"}</div>
              <div style={styles.statLabel}>Avg Period Length (days)</div>
            </div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${theme.warning}20` }}>📊</div>
            <div>
              <div style={styles.statValue}>{data?.stats?.totalCycles || 0}</div>
              <div style={styles.statLabel}>Cycles Logged</div>
            </div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#3B82F620" }}>💊</div>
            <div>
              <div style={styles.statValue}>{data?.medications || 0}</div>
              <div style={styles.statLabel}>Medications</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Prediction */}
      {insights?.prediction && (
        <div style={styles.predictionBox}>
          <div style={{ fontSize: "14px", color: theme.muted, marginBottom: "8px" }}>Next Period Expected</div>
          <div style={styles.predictionDate}>
            {new Date(insights.prediction).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          {insights.avgCycleLength && (
            <div style={{ color: theme.muted, marginTop: "8px", fontSize: "13px" }}>
              Based on {insights.avgCycleLength} day average cycle
            </div>
          )}
        </div>
      )}

      <div style={styles.grid}>
        {/* Flow Distribution */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📊 Flow Distribution</h3>
          <div style={styles.barChart}>
            {Object.entries(flowData).map(([key, val]) => (
              <div key={key} style={styles.bar}>
                <div
                  style={{
                    ...styles.barFill,
                    height: `${getBarHeight(val, flowMax)}px`,
                    background: key === "heavy" ? theme.danger : key === "medium" ? theme.warning : theme.accent,
                  }}
                />
                <span style={styles.barLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span style={{ fontSize: "12px", color: theme.muted }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cycle History */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📈 Recent Cycles</h3>
          <div style={styles.chartContainer}>
            {cycleHistory.length > 0 ? (
              <div style={{ width: "100%" }}>
                {cycleHistory.slice(0, 6).reverse().map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: "13px" }}>Cycle {cycleHistory.length - i}</span>
                    <span style={{ fontSize: "13px", color: theme.muted }}>
                      {new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span style={{ ...styles.pill, background: c.flowType === "heavy" ? `${theme.danger}20` : c.flowType === "medium" ? `${theme.warning}20` : `${theme.accent}20`, color: c.flowType === "heavy" ? theme.danger : c.flowType === "medium" ? theme.warning : theme.accent }}>
                      {c.flowType}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              "No cycles logged yet"
            )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>🤖 AI Insights</h3>
        {insights?.insights?.length > 0 ? (
          insights.insights.map((insight, i) => (
            <div
              key={i}
              style={{
                ...styles.insightCard,
                background: insight.type === "success" ? `${theme.success}10` : insight.type === "warning" ? `${theme.warning}10` : insight.type === "tip" ? `${theme.accent}10` : theme.card,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>
                  {insight.type === "success" ? "✓" : insight.type === "warning" ? "⚠️" : "💡"}
                </span>
                <strong>{insight.title}</strong>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: theme.muted }}>{insight.message}</p>
            </div>
          ))
        ) : (
          <p style={{ color: theme.muted }}>Log more cycles to get AI-powered insights.</p>
        )}
      </div>

      {/* Top Symptoms */}
      {data?.symptomCounts?.length > 0 && (
        <div style={{ ...styles.card, marginTop: "24px" }}>
          <h3 style={styles.sectionTitle}>🩺 Top Symptoms</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.symptomCounts.map(([symptom, count], i) => (
              <span
                key={i}
                style={{
                  ...styles.pill,
                  background: `${theme.warning}15`,
                  color: theme.text,
                }}
              >
                {symptom} ({count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
=======
  const hasNoData = !data || data.stats.totalCycles === 0;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Nav */}
        <nav style={styles.nav}>
          <div style={styles.brand} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={styles.logo} />
            <div>
              <div style={styles.brandName}>CycleCare</div>
              <div style={styles.brandTagline}>Your Dashboard</div>
            </div>
          </div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/tracker" style={styles.navLink}>Tracker</Link>
            <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Dashboard</span>
            <Link to="/profile" style={styles.navLink}>Profile</Link>
          </div>
          <div style={styles.themeToggle} onClick={() => setDark((v) => !v)}>{dark ? "☀️" : "🌙"}</div>
        </nav>

        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.badge}>📊 Personal Insights</span>
          <h1 style={styles.title}>Your Health Dashboard</h1>
          <p style={styles.subtitle}>Cycle patterns, symptoms, and AI-powered insights</p>
          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {hasNoData ? (
          <div style={{ ...styles.hero, marginTop: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No data yet</h2>
            <p style={styles.subtitle}>Start tracking your cycles to see personalized insights here.</p>
            <button style={styles.refreshBtn} onClick={() => navigate("/tracker")}>
              Go to Tracker →
            </button>
          </div>
        ) : (
          <>
            {/* Prediction */}
            {insights?.prediction && (
              <div style={{ ...styles.predictionCard, marginTop: 32 }}>
                <div style={styles.predictionLabel}>🔮 Next Period Predicted</div>
                <div style={styles.predictionValue}>
                  {new Date(insights.prediction).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </div>
                <div style={styles.predictionSub}>
                  {daysUntilNext > 0
                    ? `In ${daysUntilNext} day${daysUntilNext !== 1 ? "s" : ""}`
                    : daysUntilNext === 0
                    ? "Today"
                    : `${Math.abs(daysUntilNext)} day${Math.abs(daysUntilNext) !== 1 ? "s" : ""} ago`}
                  {insights.avgCycleLength && ` • ${insights.avgCycleLength}-day avg cycle`}
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🔄</div>
                <div style={styles.statValue}>{data.stats.totalCycles}</div>
                <div style={styles.statLabel}>Total Cycles</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📅</div>
                <div style={styles.statValue}>{data.stats.avgCycleLength || "—"}</div>
                <div style={styles.statLabel}>Avg Cycle Length</div>
                <div style={styles.statSub}>days</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>💧</div>
                <div style={styles.statValue}>{data.stats.avgPeriodLength || "—"}</div>
                <div style={styles.statLabel}>Avg Period Length</div>
                <div style={styles.statSub}>days</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📝</div>
                <div style={styles.statValue}>{data.logsCount}</div>
                <div style={styles.statLabel}>Daily Logs</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>💊</div>
                <div style={styles.statValue}>{data.medications}</div>
                <div style={styles.statLabel}>Medications</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🩺</div>
                <div style={styles.statValue}>{data.doctorVisits}</div>
                <div style={styles.statLabel}>Doctor Visits</div>
              </div>
            </div>

            {/* AI Insights */}
            {insights?.insights && insights.insights.length > 0 && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>💡 AI Insights</h2>
                <div style={styles.insightsGrid}>
                  {insights.insights.map((ins, idx) => {
                    const color = insightTypeColor(ins.type);
                    return (
                      <div key={idx} style={styles.insightCard(color)}>
                        <div style={styles.insightTitle}>
                          <span>{insightTypeIcon(ins.type)}</span>
                          <span>{ins.title}</span>
                        </div>
                        <div style={styles.insightMessage}>{ins.message}</div>
                      </div>
                    );
                  })}
                </div>
                {insights.recommendation && (
                  <div style={{ ...styles.insightCard(theme.accent), marginBottom: 32 }}>
                    <div style={styles.insightTitle}>
                      <span>🌟</span>
                      <span>Recommendation</span>
                    </div>
                    <div style={styles.insightMessage}>{insights.recommendation}</div>
                  </div>
                )}
              </>
            )}

            {/* Charts row 1: Flow + Symptoms */}
            <div style={styles.chartsGrid}>
              <div style={styles.chartCard}>
                <div style={styles.chartTitle}>💧 Flow Distribution</div>
                {flowChartData.length === 0 ? (
                  <div style={styles.emptyState}>No flow data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={flowChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {flowChartData.map((entry, idx) => (
                          <Cell key={`flow-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div style={styles.chartCard}>
                <div style={styles.chartTitle}>🌡️ Top Symptoms</div>
                {symptomChartData.length === 0 ? (
                  <div style={styles.emptyState}>No symptoms logged yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={symptomChartData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                      <XAxis type="number" stroke={theme.muted} fontSize={11} />
                      <YAxis type="category" dataKey="name" stroke={theme.muted} fontSize={11} width={90} />
                      <Tooltip />
                      <Bar dataKey="count" fill={theme.accent} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Charts row 2: Cycle timeline */}
            {cyclesTimelineData.length > 0 && (
              <div style={{ ...styles.chartCard, marginBottom: 32 }}>
                <div style={styles.chartTitle}>📈 Period Length Over Time</div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={cyclesTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                    <XAxis dataKey="date" stroke={theme.muted} fontSize={11} />
                    <YAxis stroke={theme.muted} fontSize={11} label={{ value: "days", angle: -90, position: "insideLeft", fill: theme.muted, fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="length" stroke={theme.accent} strokeWidth={3} dot={{ fill: theme.accent, r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Lifestyle */}
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🌿 Lifestyle Patterns</h2>
            <div style={styles.lifestyleGrid}>
              <div style={styles.lifestyleCard}>
                <div style={styles.lifestyleTitle}>😴 Sleep</div>
                {lifestyleData.sleep.length === 0 ? (
                  <div style={styles.emptyState}>No data</div>
                ) : (
                  lifestyleData.sleep.map((item) => (
                    <div key={item.name} style={styles.lifestyleRow}>
                      <span style={{ color: theme.muted }}>{item.name}</span>
                      <span style={{ fontWeight: 600 }}>{item.value} day{item.value !== 1 ? "s" : ""}</span>
                    </div>
                  ))
                )}
              </div>
              <div style={styles.lifestyleCard}>
                <div style={styles.lifestyleTitle}>🧘 Stress</div>
                {lifestyleData.stress.length === 0 ? (
                  <div style={styles.emptyState}>No data</div>
                ) : (
                  lifestyleData.stress.map((item) => (
                    <div key={item.name} style={styles.lifestyleRow}>
                      <span style={{ color: theme.muted }}>{item.name}</span>
                      <span style={{ fontWeight: 600 }}>{item.value} day{item.value !== 1 ? "s" : ""}</span>
                    </div>
                  ))
                )}
              </div>
              <div style={styles.lifestyleCard}>
                <div style={styles.lifestyleTitle}>🏃 Exercise</div>
                {lifestyleData.exercise.length === 0 ? (
                  <div style={styles.emptyState}>No data</div>
                ) : (
                  lifestyleData.exercise.map((item) => (
                    <div key={item.name} style={styles.lifestyleRow}>
                      <span style={{ color: theme.muted }}>{item.name}</span>
                      <span style={{ fontWeight: 600 }}>{item.value} day{item.value !== 1 ? "s" : ""}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <button style={styles.refreshBtn} onClick={fetchAll}>🔄 Refresh Data</button>
            </div>
          </>
        )}

        <footer style={styles.footer}>
          <span style={{ fontSize: 10, color: theme.muted }}>© 2025 CycleCare • Personal Dashboard</span>
          <Link to="/category" style={{ ...styles.navLink, fontSize: 10 }}>← Back to Categories</Link>
        </footer>
      </div>
    </div>
  );
}
>>>>>>> 168d7c5cba798b3548c411062c06277c019d53dc
