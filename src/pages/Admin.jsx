import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import logo from "../assets/cyclecare-logo.png";

export default function Admin() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    men: 0,
    girls: 0,
    women: 0,
    activeToday: 0,
    activeThisWeek: 0,
  });
  const [activityData, setActivityData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("cyclecare_token");

  // ---------- Fetch real-time data ----------
  const fetchData = useCallback(async () => {
    console.log("fetchData called, isAdmin =", isAdmin);
    if (!isAdmin) return;
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
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
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load real-time data");
    }
  }, [isAdmin, token, API_URL]);

  // Poll every 30 seconds
  useEffect(() => {
    if (isAdmin) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, fetchData]);

  // Admin verification
  useEffect(() => {
    const checkAdminAuth = async () => {
  console.log("🔍 Checking admin auth...");
  const userStr = localStorage.getItem("cyclecare_user");
  console.log("User from localStorage:", userStr);
  
  if (!userStr) {
    alert("Please login first.");
    navigate("/login");
    return;
  }
  
  const user = JSON.parse(userStr);
  console.log("Parsed user email:", user.email);
  
  if (user.email === "shifashoebsyed@gmail.com") {
    console.log("✅ Email matched hardcoded admin, setting isAdmin=true");
    localStorage.setItem("cyclecare_is_admin", "true");
    setIsAdmin(true);
    setLoading(false);
    return;
  }
      try {
        const res = await fetch(`${API_URL}/api/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isAdmin) {
            localStorage.setItem("cyclecare_is_admin", "true");
            setIsAdmin(true);
          } else throw new Error("Not admin");
        } else throw new Error("Verification failed");
      } catch (err) {
        alert("Admin access only.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAdminAuth();
  }, [navigate, token, API_URL]);

  // Theme management
  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  // ---------- Colors & helpers ----------
  const theme = useMemo(() => dark ? {
    bg: "#0A0A0F",
    card: "rgba(25, 25, 35, 0.85)",
    border: "rgba(255, 105, 150, 0.3)",
    text: "#FDF2F8",
    muted: "rgba(253, 242, 248, 0.7)",
    accent: "#FF6B8B",
    gradientStart: "#FF6B8B",
    gradientEnd: "#FF8EAA",
    green: "#4ADE80",
    blue: "#3B82F6",
    chip: "rgba(255, 255, 255, 0.08)",      // ✅ added
  } : {
    bg: "#FFF9FB",
    card: "rgba(255, 245, 248, 0.95)",
    border: "rgba(229, 76, 111, 0.2)",
    text: "#2D1B23",
    muted: "rgba(45, 27, 35, 0.65)",
    accent: "#E54C6F",
    gradientStart: "#E54C6F",
    gradientEnd: "#FF8EAA",
    green: "#16A34A",
    blue: "#3B82F6",
    chip: "rgba(0, 0, 0, 0.04)",           // ✅ added
  }, [dark]);

  const roleColors = { men: "#3B82F6", girls: "#10B981", women: "#E54C6F" };
  const roleIcons = { men: "👨", girls: "👧", women: "👩" };

  const pieData = [
    { name: "Men", value: stats.men, color: roleColors.men },
    { name: "Non‑Menstruators", value: stats.girls, color: roleColors.girls },
    { name: "Menstruators", value: stats.women, color: roleColors.women },
  ];

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (dateRange === "all") return matchSearch;
    return matchSearch && user.role === dateRange;
  });

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Verifying admin access...</div>;
  if (!isAdmin) return null;

  // Helper to safely get role color with fallback
  const getRoleColor = (role) => roleColors[role] || "#6B7280";

  const styles = {
    page: { minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'Inter', sans-serif" },
    container: { maxWidth: 1280, margin: "0 auto", padding: "0 24px" },
    nav: { position: "sticky", top: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderRadius: 100, background: dark ? "rgba(20,20,28,0.9)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", border: `1px solid ${theme.border}`, marginTop: 20 },
    brand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logo: { height: 40 },
    brandName: { fontSize: 16, fontWeight: 700 },
    brandTagline: { fontSize: 9, color: theme.muted },
    navLinks: { display: "flex", gap: 4 },
    navLink: { padding: "6px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer", color: theme.muted, textDecoration: "none" },
    navLinkActive: { color: theme.accent, background: theme.chip },
    themeToggle: { padding: "6px 12px", borderRadius: 100, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)", border: `1px solid ${theme.border}`, cursor: "pointer" },
    hero: { marginTop: 32, padding: 32, borderRadius: 32, background: theme.card, border: `1px solid ${theme.border}`, textAlign: "center" },
    badge: { display: "inline-block", padding: "4px 12px", borderRadius: 100, background: theme.chip, fontSize: 11, color: theme.accent },
    title: { fontSize: 28, fontWeight: 800, margin: "8px 0" },
    subtitle: { fontSize: 12, color: theme.muted },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 },
    statCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: 20, textAlign: "center" },
    statValue: { fontSize: 32, fontWeight: 800, color: theme.accent },
    statLabel: { fontSize: 12, color: theme.muted, marginTop: 8 },
    statIcon: { fontSize: 28, marginBottom: 8 },
    chartsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 },
    chartCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, padding: 20 },
    chartTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16, textAlign: "center" },
    filters: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 },
    searchBox: { display: "flex", alignItems: "center", gap: 8, background: dark ? "rgba(255,255,255,0.05)" : "white", border: `1px solid ${theme.border}`, borderRadius: 100, padding: "6px 16px" },
    searchInput: { background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 13, padding: "8px 0", width: 200 },
    filterBtns: { display: "flex", gap: 8 },
    filterBtn: (active) => ({ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer", background: active ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` : "transparent", border: active ? "none" : `1px solid ${theme.border}`, color: active ? "white" : theme.text }),
    usersTable: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 24, overflow: "hidden", marginBottom: 32 },
    tableHeader: { display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 1.5fr 1fr", padding: "16px 20px", background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", borderBottom: `1px solid ${theme.border}`, fontWeight: 600, fontSize: 12 },
    tableRow: { display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 1.5fr 1fr", padding: "14px 20px", borderBottom: `1px solid ${theme.border}`, fontSize: 12, cursor: "pointer", transition: "background 0.2s", ":hover": { background: theme.chip } },
    roleBadge: (bgColor) => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 100, background: bgColor, fontSize: 11, fontWeight: 500, width: "fit-content" }),
    modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalContent: { background: theme.card, borderRadius: 28, padding: 32, maxWidth: 500, width: "90%", maxHeight: "80vh", overflow: "auto" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 700 },
    closeBtn: { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: theme.muted },
    footer: { padding: "24px 0", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", marginTop: 24 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.brand} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={styles.logo} />
            <div><div style={styles.brandName}>CycleCare</div><div style={styles.brandTagline}>Admin Dashboard</div></div>
          </div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/category" style={styles.navLink}>Categories</Link>
            <Link to="/profile" style={styles.navLink}>Profile</Link>
            <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Admin</span>
          </div>
          <div style={styles.themeToggle} onClick={() => setDark(v => !v)}>{dark ? "☀️" : "🌙"}</div>
        </nav>

        <div style={styles.hero}>
          <span style={styles.badge}>📊 Real-Time Dashboard</span>
          <h1 style={styles.title}>User Analytics</h1>
          <p style={styles.subtitle}>Live data – updates every 30 seconds</p>
          {error && <div style={{ color: theme.accent, fontSize: 11, marginTop: 8 }}>{error}</div>}
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}><div style={styles.statIcon}>👥</div><div style={styles.statValue}>{stats.totalUsers}</div><div style={styles.statLabel}>Total Users</div></div>
          <div style={styles.statCard}><div style={styles.statIcon}>🟢</div><div style={styles.statValue}>{stats.activeToday}</div><div style={styles.statLabel}>Active Today</div></div>
          <div style={styles.statCard}><div style={styles.statIcon}>📅</div><div style={styles.statValue}>{stats.activeThisWeek}</div><div style={styles.statLabel}>Active This Week</div></div>
          <div style={styles.statCard}><div style={styles.statIcon}>📊</div><div style={styles.statValue}>{Math.round((stats.activeToday / (stats.totalUsers || 1)) * 100)}%</div><div style={styles.statLabel}>Engagement</div></div>
        </div>

        {/* Charts */}
        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>👥 User Roles Distribution</div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}>
                  {pieData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>📈 Active Users (Last 7 Days)</div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <XAxis dataKey="date" stroke={theme.muted} />
                <YAxis stroke={theme.muted} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={theme.accent} strokeWidth={2} dot={{ fill: theme.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters & Table */}
        <div style={styles.filters}>
          <div style={styles.searchBox}><span>🔍</span><input type="text" style={styles.searchInput} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
          <div style={styles.filterBtns}>
            {["all","men","girls","women"].map(cat => (
              <button key={cat} style={styles.filterBtn(dateRange === cat)} onClick={() => setDateRange(cat)}>
                {cat === "all" ? "All" : cat === "men" ? "👨 Men" : cat === "girls" ? "👧 Girls" : "👩 Women"}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.usersTable}>
          <div style={styles.tableHeader}>
            <div>Name</div><div>Email</div><div>Category</div><div>Joined</div><div>Last Active</div><div>Activity</div>
          </div>
          {filteredUsers.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>No users found</div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} style={styles.tableRow} onClick={() => setSelectedUser(user)}>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
                <div style={{ color: theme.muted }}>{user.email}</div>
                <div>
                  <span style={styles.roleBadge((getRoleColor(user.role) + "20"))}>
                    {roleIcons[user.role] || "❓"} {user.role === "men" ? "Men" : user.role === "girls" ? "Girls" : user.role === "women" ? "Women" : "Not selected"}
                  </span>
                </div>
                <div style={{ color: theme.muted }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                <div style={{ color: theme.muted }}>{new Date(user.lastActive).toLocaleDateString()}</div>
                <div><span style={{ color: theme.green }}>📊 {user.cyclesTracked} cycles</span></div>
              </div>
            ))
          )}
        </div>

        {selectedUser && (
          <div style={styles.modal} onClick={() => setSelectedUser(null)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div style={styles.modalTitle}>User Details</div>
                <button style={styles.closeBtn} onClick={() => setSelectedUser(null)}>✕</button>
              </div>
              <div><div style={{ fontSize: 11, color: theme.muted }}>Name</div><div style={{ fontWeight: 500 }}>{selectedUser.name}</div></div>
              <div style={{ marginTop: 12 }}><div style={{ fontSize: 11, color: theme.muted }}>Email</div><div>{selectedUser.email}</div></div>
              <div style={{ marginTop: 12 }}><div style={{ fontSize: 11, color: theme.muted }}>Category</div><div>{selectedUser.role}</div></div>
              <div style={{ marginTop: 12 }}><div style={{ fontSize: 11, color: theme.muted }}>Joined</div><div>{new Date(selectedUser.createdAt).toLocaleString()}</div></div>
              <div style={{ marginTop: 12 }}><div style={{ fontSize: 11, color: theme.muted }}>Last Active</div><div>{new Date(selectedUser.lastActive).toLocaleString()}</div></div>
              <div style={{ marginTop: 12 }}><div style={{ fontSize: 11, color: theme.muted }}>Activity</div><div>📊 {selectedUser.cyclesTracked} cycles • 📝 {selectedUser.logsCount} logs</div></div>
            </div>
          </div>
        )}

        <footer style={styles.footer}>
          <span style={{ fontSize: 10 }}>© 2025 CycleCare • Real-Time Admin Dashboard</span>
          <Link to="/" style={{ ...styles.navLink, fontSize: 10 }}>← Back to Home</Link>
        </footer>
      </div>
    </div>
  );
}