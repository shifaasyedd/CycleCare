import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart,
  BarChart, Bar, Legend,
} from "recharts";
import logo from "../assets/cyclecare-logo.png";

export default function Admin() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0, men: 0, girls: 0, women: 0,
    activeToday: 0, activeThisWeek: 0, activeThisMonth: 0,
    totalCycles: 0, totalLogs: 0, totalMessages: 0,
    totalVisits: 0, totalMedications: 0, avgCycleLength: 0,
  });
  const [activityData, setActivityData] = useState([]);
  const [signupGrowth, setSignupGrowth] = useState([]);
  const [chatUsage, setChatUsage] = useState([]);
  const [flowBreakdown, setFlowBreakdown] = useState([]);
  const [topSymptoms, setTopSymptoms] = useState([]);
  const [stressLevels, setStressLevels] = useState([]);
  const [sleepPatterns, setSleepPatterns] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const getToken = () => localStorage.getItem("cyclecare_token");

  const fetchData = useCallback(async () => {
    const token = getToken();
    setLoading(true);
    setError(null);
    if (!isAdmin) { setLoading(false); return; }
    if (!token) { setError("Please login first"); setLoading(false); return; }
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success) setUsers(usersData.users);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
          setActivityData(statsData.activity);
          setSignupGrowth(statsData.signupGrowth || []);
          setChatUsage(statsData.chatUsage || []);
          setFlowBreakdown(statsData.flowBreakdown || []);
          setTopSymptoms(statsData.topSymptoms || []);
          setStressLevels(statsData.stressLevels || []);
          setSleepPatterns(statsData.sleepPatterns || []);
        }
      }
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, API_URL]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, fetchData]);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const userStr = localStorage.getItem("cyclecare_user");
      if (!userStr) { navigate("/login"); return; }
      const user = JSON.parse(userStr);
      if (user.email === "shifashoebsyed@gmail.com") {
        localStorage.setItem("cyclecare_is_admin", "true");
        setIsAdmin(true);
        setLoading(false);
        return;
      }
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/admin/verify`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.isAdmin) { setIsAdmin(true); }
          else throw new Error();
        } else throw new Error();
      } catch {
        alert("Admin access only.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAdminAuth();
  }, [navigate, API_URL]);

  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  const t = useMemo(
    () => dark ? {
    bg: "#06060B",
    surface: "rgba(18, 18, 28, 0.95)",
    surfaceHover: "rgba(25, 25, 38, 0.95)",
    border: "rgba(255, 105, 150, 0.15)",
    borderStrong: "rgba(255, 105, 150, 0.3)",
    text: "#F1EEF6",
    textSecondary: "rgba(241, 238, 246, 0.6)",
    textTertiary: "rgba(241, 238, 246, 0.4)",
    accent: "#FF6B8B",
    accentSoft: "rgba(255, 107, 139, 0.12)",
    gradientStart: "#FF6B8B",
    gradientEnd: "#FF8EAA",
    green: "#4ADE80",
    greenSoft: "rgba(74, 222, 128, 0.12)",
    blue: "#60A5FA",
    blueSoft: "rgba(96, 165, 250, 0.12)",
    purple: "#C084FC",
    purpleSoft: "rgba(192, 132, 252, 0.12)",
    amber: "#FBBF24",
    amberSoft: "rgba(251, 191, 36, 0.12)",
    cyan: "#22D3EE",
    cyanSoft: "rgba(34, 211, 238, 0.12)",
    shadow: "0 1px 3px rgba(0,0,0,0.4)",
    shadowLg: "0 8px 32px rgba(0,0,0,0.4)",
  } : {
    bg: "#F8F6FA",
    surface: "rgba(255, 255, 255, 0.95)",
    surfaceHover: "rgba(255, 255, 255, 1)",
    border: "rgba(229, 76, 111, 0.1)",
    borderStrong: "rgba(229, 76, 111, 0.2)",
    text: "#1A1225",
    textSecondary: "rgba(26, 18, 37, 0.6)",
    textTertiary: "rgba(26, 18, 37, 0.4)",
    accent: "#E54C6F",
    accentSoft: "rgba(229, 76, 111, 0.08)",
    gradientStart: "#E54C6F",
    gradientEnd: "#FF8EAA",
    green: "#16A34A",
    greenSoft: "rgba(22, 163, 74, 0.08)",
    blue: "#2563EB",
    blueSoft: "rgba(37, 99, 235, 0.08)",
    purple: "#9333EA",
    purpleSoft: "rgba(147, 51, 234, 0.08)",
    amber: "#D97706",
    amberSoft: "rgba(217, 119, 6, 0.08)",
    cyan: "#0891B2",
    cyanSoft: "rgba(8, 145, 178, 0.08)",
    shadow: "0 1px 3px rgba(0,0,0,0.06)",
    shadowLg: "0 8px 32px rgba(0,0,0,0.08)",
  },
  [dark]);

  const roleColors = { men: t.blue, girls: t.green, women: t.accent };
  const flowColors = { light: t.green, medium: t.blue, heavy: t.accent, spotting: t.amber, none: t.textTertiary };

  const pieData = [
    { name: "Men", value: stats.men, color: t.blue },
    { name: "Non-Menstruators", value: stats.girls, color: t.green },
    { name: "Menstruators", value: stats.women, color: t.accent },
  ];

  const filteredUsers = users.filter(u => {
    const match = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (dateRange === "all") return match;
    return match && u.role === dateRange;
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#06060B" : "#F8F6FA", color: dark ? "#F1EEF6" : "#1A1225", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>Loading...</div>
        <div style={{ fontSize: 13, opacity: 0.5 }}>Verifying admin access</div>
      </div>
    </div>
  );
  if (!isAdmin) return null;

  const StatCard = ({ icon, value, label, color, bgColor, subtext }) => (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 10, boxShadow: t.shadow, transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
        {subtext && <span style={{ fontSize: 10, color: t.green, fontWeight: 600, background: t.greenSoft, padding: "3px 8px", borderRadius: 100 }}>{subtext}</span>}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: color || t.text, letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: t.textSecondary, marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      </div>
    </div>
  );

  const ChartCard = ({ title, subtitle, children, span }) => (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow, gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "health", label: "Health Insights" },
    { id: "users", label: "Users" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: 10, padding: "10px 14px", boxShadow: t.shadowLg }}>
        <div style={{ fontSize: 11, color: t.textSecondary, marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>{p.value} {p.name || ""}</div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: dark ? "rgba(6,6,11,0.85)" : "rgba(248,246,250,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
              <img src={logo} alt="CycleCare" style={{ height: 30 }} />
              <span style={{ fontSize: 15, fontWeight: 700 }}>CycleCare</span>
              <span style={{ fontSize: 10, color: t.textTertiary, background: t.accentSoft, padding: "2px 8px", borderRadius: 100, fontWeight: 600, color: t.accent }}>Admin</span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {[{ to: "/", label: "Home" }, { to: "/category", label: "Categories" }].map(l => (
                <Link key={l.to} to={l.to} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, color: t.textSecondary, textDecoration: "none", fontWeight: 500 }}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={fetchData} disabled={loading} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: t.accentSoft, border: `1px solid ${t.border}`, color: t.accent }}>
              {loading ? "..." : "Refresh"}
            </button>
            <div style={{ padding: "6px 12px", borderRadius: 8, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 13 }} onClick={() => setDark(v => !v)}>
              {dark ? "Light" : "Dark"}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Dashboard</h1>
              <p style={{ fontSize: 13, color: t.textSecondary, margin: "4px 0 0" }}>Real-time analytics and insights</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: t.green, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: t.textTertiary }}>Live - updates every 30s</span>
            </div>
          </div>
          {error && <div style={{ marginTop: 8, padding: "8px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, fontSize: 12, color: "#EF4444" }}>{error}</div>}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: t.surface, borderRadius: 10, padding: 4, border: `1px solid ${t.border}`, width: "fit-content" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s",
              background: activeTab === tab.id ? `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})` : "transparent",
              color: activeTab === tab.id ? "white" : t.textSecondary,
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ============ OVERVIEW TAB ============ */}
        {activeTab === "overview" && (
          <>
            {/* Primary Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              <StatCard icon="👥" value={stats.totalUsers} label="Total Users" color={t.text} bgColor={t.accentSoft} />
              <StatCard icon="🟢" value={stats.activeToday} label="Active Today" color={t.green} bgColor={t.greenSoft} subtext={`${Math.round((stats.activeToday / (stats.totalUsers || 1)) * 100)}%`} />
              <StatCard icon="📅" value={stats.activeThisWeek} label="Active This Week" color={t.blue} bgColor={t.blueSoft} />
              <StatCard icon="📊" value={stats.activeThisMonth} label="Active This Month" color={t.purple} bgColor={t.purpleSoft} />
            </div>

            {/* Secondary Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 28 }}>
              <StatCard icon="🔄" value={stats.totalCycles} label="Cycles Tracked" color={t.accent} bgColor={t.accentSoft} />
              <StatCard icon="📝" value={stats.totalLogs} label="Daily Logs" color={t.blue} bgColor={t.blueSoft} />
              <StatCard icon="💬" value={stats.totalMessages} label="Chat Messages" color={t.purple} bgColor={t.purpleSoft} />
              <StatCard icon="🏥" value={stats.totalVisits} label="Doctor Visits" color={t.cyan} bgColor={t.cyanSoft} />
              <StatCard icon="💊" value={stats.totalMedications} label="Medications" color={t.amber} bgColor={t.amberSoft} />
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="User Activity" subtitle="Daily active users - last 7 days">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.accent} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={t.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke={t.accent} strokeWidth={2.5} fill="url(#actGrad)" name="Users" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="User Roles" subtitle="Distribution by category">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
                  {pieData.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.textSecondary }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: d.color }} />
                      {d.name}: {d.value}
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="User Growth" subtitle="New signups - last 30 days">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={signupGrowth}>
                    <defs>
                      <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.green} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={t.green} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke={t.textTertiary} fontSize={10} tickLine={false} axisLine={false} interval={4} />
                    <YAxis stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke={t.green} strokeWidth={2} fill="url(#signupGrad)" name="Signups" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Chatbot Usage" subtitle="Messages - last 14 days">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chatUsage}>
                    <defs>
                      <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.purple} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={t.purple} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke={t.textTertiary} fontSize={10} tickLine={false} axisLine={false} interval={2} />
                    <YAxis stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke={t.purple} strokeWidth={2} fill="url(#chatGrad)" name="Messages" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}

        {/* ============ HEALTH TAB ============ */}
        {activeTab === "health" && (
          <>
            {/* Health summary stat */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              <StatCard icon="🔄" value={stats.avgCycleLength ? `${stats.avgCycleLength} days` : "N/A"} label="Avg Cycle Length" color={t.accent} bgColor={t.accentSoft} />
              <StatCard icon="📝" value={stats.totalLogs} label="Total Symptom Logs" color={t.blue} bgColor={t.blueSoft} />
              <StatCard icon="🏥" value={stats.totalVisits} label="Doctor Visits Logged" color={t.cyan} bgColor={t.cyanSoft} />
            </div>

            {/* Top Symptoms */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Top Reported Symptoms" subtitle="Most common across all users">
                {topSymptoms.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topSymptoms} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid stroke={t.border} strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={t.accent} radius={[0, 6, 6, 0]} name="Reports" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: t.textTertiary, fontSize: 13 }}>No symptom data yet</div>
                )}
              </ChartCard>

              <ChartCard title="Flow Type Distribution" subtitle="Cycle flow intensity breakdown">
                {flowBreakdown.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={flowBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="count" strokeWidth={0}>
                          {flowBreakdown.map((entry, idx) => <Cell key={idx} fill={flowColors[entry.name] || t.textTertiary} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 8 }}>
                      {flowBreakdown.map(d => (
                        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.textSecondary }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: flowColors[d.name] || t.textTertiary }} />
                          {d.name}: {d.count}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: t.textTertiary, fontSize: 13 }}>No flow data yet</div>
                )}
              </ChartCard>
            </div>

            {/* Stress & Sleep */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Stress Levels" subtitle="Self-reported stress distribution">
                {stressLevels.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stressLevels}>
                      <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={t.amber} radius={[6, 6, 0, 0]} name="Logs" barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", color: t.textTertiary, fontSize: 13 }}>No stress data yet</div>
                )}
              </ChartCard>

              <ChartCard title="Sleep Patterns" subtitle="Self-reported sleep duration">
                {sleepPatterns.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={sleepPatterns}>
                      <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={t.textTertiary} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={t.blue} radius={[6, 6, 0, 0]} name="Logs" barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", color: t.textTertiary, fontSize: 13 }}>No sleep data yet</div>
                )}
              </ChartCard>
            </div>
          </>
        )}

        {/* ============ USERS TAB ============ */}
        {activeTab === "users" && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "0 14px", boxShadow: t.shadow }}>
                <span style={{ fontSize: 14, color: t.textTertiary }}>&#128269;</span>
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ background: "transparent", border: "none", outline: "none", color: t.text, fontSize: 13, padding: "10px 0", width: 240, fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ key: "all", label: "All" }, { key: "men", label: "Men" }, { key: "girls", label: "Non-Menstruators" }, { key: "women", label: "Menstruators" }].map(f => (
                  <button key={f.key} onClick={() => setDateRange(f.key)} style={{
                    padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                    background: dateRange === f.key ? `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})` : "transparent",
                    border: dateRange === f.key ? "none" : `1px solid ${t.border}`,
                    color: dateRange === f.key ? "white" : t.textSecondary,
                  }}>{f.label}</button>
                ))}
              </div>
            </div>

            {/* User count */}
            <div style={{ fontSize: 12, color: t.textTertiary, marginBottom: 12 }}>{filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}</div>

            {/* Table */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", boxShadow: t.shadow }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2.5fr 1.5fr 1.2fr 1.2fr 1fr", padding: "12px 20px", borderBottom: `1px solid ${t.border}`, fontSize: 11, fontWeight: 600, color: t.textTertiary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <div>Name</div><div>Email</div><div>Category</div><div>Joined</div><div>Last Active</div><div>Activity</div>
              </div>
              {filteredUsers.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center", color: t.textTertiary, fontSize: 13 }}>No users found</div>
              ) : (
                filteredUsers.map((user, idx) => (
                  <div key={user.id} onClick={() => setSelectedUser(user)} style={{
                    display: "grid", gridTemplateColumns: "2fr 2.5fr 1.5fr 1.2fr 1.2fr 1fr", padding: "14px 20px",
                    borderBottom: idx < filteredUsers.length - 1 ? `1px solid ${t.border}` : "none",
                    fontSize: 13, cursor: "pointer", transition: "background 0.15s",
                    background: "transparent",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 14, background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: 700, flexShrink: 0 }}>
                        {(user.name || "?")[0].toUpperCase()}
                      </div>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
                    </div>
                    <div style={{ color: t.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>{user.email}</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                        background: roleColors[user.role] ? `${roleColors[user.role]}18` : t.accentSoft,
                        color: roleColors[user.role] || t.textTertiary,
                      }}>
                        {user.role === "men" ? "Men" : user.role === "girls" ? "Non-Menstruator" : user.role === "women" ? "Menstruator" : "Not selected"}
                      </span>
                    </div>
                    <div style={{ color: t.textTertiary, display: "flex", alignItems: "center", fontSize: 12 }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                    <div style={{ color: t.textTertiary, display: "flex", alignItems: "center", fontSize: 12 }}>{new Date(user.lastActive).toLocaleDateString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <span style={{ color: t.accent, fontWeight: 600 }}>{user.cyclesTracked}</span>
                      <span style={{ color: t.textTertiary }}>cycles</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setSelectedUser(null)}>
            <div style={{ background: t.surface, borderRadius: 20, padding: 32, maxWidth: 480, width: "90%", border: `1px solid ${t.borderStrong}`, boxShadow: t.shadowLg }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "white", fontWeight: 700 }}>
                    {(selectedUser.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedUser.name}</div>
                    <div style={{ fontSize: 12, color: t.textSecondary }}>{selectedUser.email}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: t.textTertiary, padding: 4 }}>&#10005;</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Category", value: selectedUser.role === "men" ? "Men" : selectedUser.role === "girls" ? "Non-Menstruator" : selectedUser.role === "women" ? "Menstruator" : "Not selected" },
                  { label: "Admin", value: selectedUser.isAdmin ? "Yes" : "No" },
                  { label: "Joined", value: new Date(selectedUser.createdAt).toLocaleDateString() },
                  { label: "Last Active", value: new Date(selectedUser.lastActive).toLocaleDateString() },
                  { label: "Cycles Tracked", value: selectedUser.cyclesTracked },
                  { label: "Daily Logs", value: selectedUser.logsCount },
                ].map(item => (
                  <div key={item.label} style={{ padding: 14, borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.border}` }}>
                    <div style={{ fontSize: 10, color: t.textTertiary, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 48, padding: "20px 0", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: t.textTertiary }}>CycleCare Admin Dashboard</span>
          <Link to="/" style={{ fontSize: 11, color: t.textTertiary, textDecoration: "none" }}>Back to Home</Link>
        </footer>
      </div>
    </div>
  );
}
