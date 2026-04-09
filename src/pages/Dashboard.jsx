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
    if (!token) {
      navigate("/login");
      return;
    }

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
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "18px", color: theme.muted }}>Loading dashboard...</div>
      </div>
    );
  }

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