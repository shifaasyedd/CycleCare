import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";
import {
  Activity, Calendar, Clock, Droplets, Utensils, Pill, Stethoscope,
  MessageCircle, ShoppingBag, AlertCircle, Heart, FileText,
  Lightbulb, TrendingUp, Moon, Sun, FlaskConical, Leaf,
  RefreshCcw, Sparkles, CheckCircle, AlertTriangle, Info, Thermometer, Sparkle
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("cyclecare_token");

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  // ---------- Auth gate ----------
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

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
    if (type === "success") return <CheckCircle size={16} color={theme.green} />;
    if (type === "warning") return <AlertTriangle size={16} color={theme.yellow} />;
    if (type === "tip") return <Lightbulb size={16} color={theme.blue} />;
    return <Info size={16} color={theme.accent} />;
  };

  const cleanMessage = (msg) => {
    if (!msg) return "";
    if (typeof msg === "string") return msg.trim();
    if (typeof msg === "object") {
      return Object.values(msg)
        .filter(v => v && typeof v !== "object")
        .join(". ");
    }
    return String(msg);
  };

  const styles = {
    page: { minHeight: "100vh", background: theme.bg, color: theme.text },
    container: { maxWidth: 1200, margin: "0 auto", padding: "0 16px" },
    hero: { textAlign: "center", padding: "48px 16px 32px" },
    badge: { display: "inline-flex", alignItems: "center", padding: "6px 14px", borderRadius: 20, background: theme.chip, color: theme.accent, fontSize: 12, fontWeight: 600, marginBottom: 16 },
    title: { fontSize: 32, fontWeight: 800, marginBottom: 8, background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    subtitle: { fontSize: 16, color: theme.muted, marginBottom: 24 },
    errorBox: { background: "rgba(239, 68, 68, 0.15)", color: theme.red, padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14 },
    predictionCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "20px 24px", textAlign: "center" },
    predictionLabel: { display: "inline-flex", alignItems: "center", fontSize: 13, color: theme.muted, marginBottom: 8 },
    predictionValue: { fontSize: 28, fontWeight: 800, color: theme.accent, marginBottom: 4 },
    predictionSub: { fontSize: 14, color: theme.muted },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 32 },
    statCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "20px 16px", textAlign: "center" },
    statValue: { fontSize: 28, fontWeight: 800, color: theme.text },
    statLabel: { fontSize: 13, color: theme.muted, marginBottom: 2 },
    statSub: { fontSize: 11, color: theme.muted },
    insightsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 24 },
    insightCard: (color) => ({ background: theme.card, border: `1px solid ${color}40`, borderRadius: 16, padding: 20 }),
    insightTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 10 },
    insightMessage: { fontSize: 16, color: theme.muted, lineHeight: 1.6 },
    chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16, marginBottom: 32 },
    chartCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20 },
    chartTitle: { display: "flex", alignItems: "center", fontSize: 16, fontWeight: 700, marginBottom: 16 },
    emptyState: { textAlign: "center", color: theme.muted, padding: "40px 0", fontSize: 14 },
    lifestyleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 },
    lifestyleCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20 },
    lifestyleTitle: { display: "flex", alignItems: "center", fontSize: 14, fontWeight: 600, marginBottom: 12 },
    lifestyleRow: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0" },
    refreshBtn: { background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, color: "#FFF", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" },
    footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: `1px solid ${theme.border}`, marginTop: 32 },
    navLink: { color: theme.accent, textDecoration: "none" },
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Activity size={32} color={theme.accent} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, color: theme.muted }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const hasNoData = !data || data.stats.totalCycles === 0;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar active="Dashboard" />

        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.badge}><Activity size={14} style={{ marginRight: 6 }} /> Personal Insights</span>
          <h1 style={styles.title}>Your Health Dashboard</h1>
          <p style={styles.subtitle}>Cycle patterns, symptoms, and AI-powered insights</p>
          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {hasNoData ? (
          <div style={{ ...styles.hero, marginTop: 24 }}>
            <Heart size={48} color={theme.accent} style={{ marginBottom: 12 }} />
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
                <div style={styles.predictionLabel}><Sparkles size={14} style={{ marginRight: 6 }} /> Next Period Predicted</div>
                <div style={styles.predictionValue}>
                  {(() => {
                    const [y, m, d] = insights.prediction.split('-').map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "long", day: "numeric" });
                  })()}
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
                <RefreshCcw size={28} color={theme.accent} style={{ marginBottom: 8 }} />
                <div style={styles.statValue}>{data.stats.totalCycles}</div>
                <div style={styles.statLabel}>Total Cycles</div>
              </div>
              <div style={styles.statCard}>
                <Calendar size={28} color={theme.accent} style={{ marginBottom: 8 }} />
                <div style={styles.statValue}>{data.stats.avgCycleLength || "—"}</div>
                <div style={styles.statLabel}>Avg Cycle Length</div>
                <div style={styles.statSub}>days</div>
              </div>
              <div style={styles.statCard}>
                <Droplets size={28} color={theme.accent} style={{ marginBottom: 8 }} />
                <div style={styles.statValue}>{data.stats.avgPeriodLength || "—"}</div>
                <div style={styles.statLabel}>Avg Period Length</div>
                <div style={styles.statSub}>days</div>
              </div>
              <div style={styles.statCard}>
                <FileText size={28} color={theme.accent} style={{ marginBottom: 8 }} />
                <div style={styles.statValue}>{data.logsCount}</div>
                <div style={styles.statLabel}>Daily Logs</div>
              </div>
              <div style={styles.statCard}>
                <Pill size={28} color={theme.accent} style={{ marginBottom: 8 }} />
                <div style={styles.statValue}>{data.medications}</div>
                <div style={styles.statLabel}>Medications</div>
              </div>
              <div style={styles.statCard}>
                <Stethoscope size={28} color={theme.accent} style={{ marginBottom: 8 }} />
                <div style={styles.statValue}>{data.doctorVisits}</div>
                <div style={styles.statLabel}>Doctor Visits</div>
              </div>
            </div>

            {/* AI Insights */}
            {insights?.insights && insights.insights.length > 0 && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}><Lightbulb size={20} style={{ marginRight: 8 }} /> AI Insights</h2>
                <div style={styles.insightsGrid}>
                  {insights.insights.map((ins, idx) => {
                    const color = insightTypeColor(ins.type);
                    return (
                      <div key={idx} style={styles.insightCard(color)}>
                        <div style={styles.insightTitle}>
                          <span>{insightTypeIcon(ins.type)}</span>
                          <span>{ins.title}</span>
                        </div>
                        <div style={styles.insightMessage}>{cleanMessage(ins.message)}</div>
                      </div>
                    );
                  })}
                </div>
                {insights.recommendation && (
                  <div style={{ ...styles.insightCard(theme.accent), marginBottom: 32 }}>
                    <div style={styles.insightTitle}>
                      <Sparkle size={16} color={theme.accent} />
                      <span>Recommendation</span>
                    </div>
                    <div style={styles.insightMessage}>{cleanMessage(insights.recommendation)}</div>
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
                <div style={styles.chartTitle}><Thermometer size={18} style={{ marginRight: 8 }} /> Top Symptoms</div>
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
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}><Leaf size={20} style={{ marginRight: 8 }} /> Lifestyle Patterns</h2>
            <div style={styles.lifestyleGrid}>
              <div style={styles.lifestyleCard}>
                <div style={styles.lifestyleTitle}><Moon size={16} style={{ marginRight: 6 }} /> Sleep</div>
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
                <div style={styles.lifestyleTitle}><Activity size={16} style={{ marginRight: 6 }} /> Stress</div>
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
                <div style={styles.lifestyleTitle}><Activity size={16} style={{ marginRight: 6 }} /> ♨ Exercise</div>
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
