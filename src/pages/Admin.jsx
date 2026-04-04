import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("cyclecare_token");

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
            glow: "rgba(255, 107, 139, 0.35)",
            chip: "rgba(255, 107, 139, 0.15)",
            shadow: "rgba(0, 0, 0, 0.4)",
            gradientStart: "#FF6B8B",
            gradientEnd: "#FF8EAA",
            green: "#4ADE80",
            blue: "#3B82F6",
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
            green: "#16A34A",
            blue: "#3B82F6",
          },
    [dark]
  );

  // ---------- Helper functions ----------
  const calculateStats = (usersList) => {
    const total = usersList.length;
    const men = usersList.filter((u) => u.role === "men").length;
    const girls = usersList.filter((u) => u.role === "girls").length;
    const women = usersList.filter((u) => u.role === "women").length;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const activeToday = usersList.filter((u) => {
      const lastActive = new Date(u.lastActive);
      return lastActive >= todayStart;
    }).length;

    const activeThisWeek = usersList.filter((u) => {
      const lastActive = new Date(u.lastActive);
      return lastActive >= weekAgo;
    }).length;

    setStats({
      totalUsers: total,
      men,
      girls,
      women,
      activeToday,
      activeThisWeek,
    });
  };

  // Fetch real users from API (no fallback to fake data)
  const fetchUsersFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
        calculateStats(data.users);
      } else {
        throw new Error(data.error || "Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(`Failed to load users: ${err.message}`);
      setUsers([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Effects ----------
  // Check admin authentication
  useEffect(() => {
    const checkAdminAuth = async () => {
      const userStr = localStorage.getItem("cyclecare_user");
      if (!userStr) {
        alert("🔒 Please login first.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const isAdminFlag = localStorage.getItem("cyclecare_is_admin");

      // If already flagged as admin, accept immediately
      if (isAdminFlag === "true") {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Demo shortcut: if email is admin@cyclecare.com, treat as admin
      if (user.email === "admin@cyclecare.com") {
        localStorage.setItem("cyclecare_is_admin", "true");
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Otherwise verify with backend
      try {
        const res = await fetch(`${API_URL}/api/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isAdmin) {
            localStorage.setItem("cyclecare_is_admin", "true");
            setIsAdmin(true);
          } else {
            throw new Error("User is not an admin");
          }
        } else {
          throw new Error("Verification failed");
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        alert("🔒 Admin access only. Please login with admin credentials.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate, token, API_URL]);

  // Load users once admin is confirmed
  useEffect(() => {
    if (isAdmin) {
      fetchUsersFromAPI();
    }
  }, [isAdmin]);

  // Theme management
  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  // ---------- Filtering ----------
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (dateRange === "all") return matchesSearch;
    return matchesSearch && user.role === dateRange;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "men":
        return { bg: "#3B82F6", light: "#3B82F620" };
      case "girls":
        return { bg: "#10B981", light: "#10B98120" };
      case "women":
        return { bg: "#E54C6F", light: "#E54C6F20" };
      default:
        return { bg: "#6B7280", light: "#6B728020" };
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "men":
        return "👨";
      case "girls":
        return "👧";
      case "women":
        return "👩";
      default:
        return "❓";
    }
  };

  // ---------- Loading & Auth Guard ----------
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: dark ? "#0A0A0F" : "#FFF9FB",
          color: dark ? "#FDF2F8" : "#2D1B23",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>🔒</div>
          <div>Verifying admin access...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // ---------- Styles ----------
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
    container: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", flex: 1 },
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
    logo: { height: 40, width: "auto" },
    brandName: { fontSize: 16, fontWeight: 700 },
    brandTagline: { fontSize: 9, color: theme.muted },
    navLinks: { display: "flex", gap: 4 },
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
      fontSize: 11,
    },
    hero: {
      marginTop: 32,
      marginBottom: 24,
      padding: 32,
      borderRadius: 32,
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
      marginBottom: 12,
    },
    title: { fontSize: 28, fontWeight: 800, margin: "0 0 8px" },
    subtitle: { fontSize: 12, color: theme.muted },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 20,
      marginBottom: 32,
    },
    statCard: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 24,
      padding: 20,
      textAlign: "center",
    },
    statValue: { fontSize: 32, fontWeight: 800, color: theme.accent },
    statLabel: { fontSize: 12, color: theme.muted, marginTop: 8 },
    statIcon: { fontSize: 28, marginBottom: 8 },
    categoryStats: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
      marginBottom: 32,
    },
    categoryCard: (bgColor) => ({
      background: bgColor,
      border: `1px solid ${theme.border}`,
      borderRadius: 24,
      padding: 20,
      textAlign: "center",
      cursor: "pointer",
      transition: "transform 0.2s",
    }),
    categoryValue: { fontSize: 28, fontWeight: 800 },
    categoryLabel: { fontSize: 12, marginTop: 8 },
    categoryIcon: { fontSize: 32, marginBottom: 8 },
    filters: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
      flexWrap: "wrap",
      gap: 16,
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: dark ? "rgba(255,255,255,0.05)" : "white",
      border: `1px solid ${theme.border}`,
      borderRadius: 100,
      padding: "6px 16px",
    },
    searchInput: {
      background: "transparent",
      border: "none",
      outline: "none",
      color: theme.text,
      fontSize: 13,
      padding: "8px 0",
      width: 200,
    },
    filterBtns: {
      display: "flex",
      gap: 8,
    },
    filterBtn: (active) => ({
      padding: "6px 14px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      background: active ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` : "transparent",
      border: active ? "none" : `1px solid ${theme.border}`,
      color: active ? "white" : theme.text,
    }),
    usersTable: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 24,
      overflow: "hidden",
      marginBottom: 32,
    },
    tableHeader: {
      display: "grid",
      gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 1.5fr 1fr",
      padding: "16px 20px",
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
      borderBottom: `1px solid ${theme.border}`,
      fontWeight: 600,
      fontSize: 12,
    },
    tableRow: {
      display: "grid",
      gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 1.5fr 1fr",
      padding: "14px 20px",
      borderBottom: `1px solid ${theme.border}`,
      fontSize: 12,
      cursor: "pointer",
      transition: "background 0.2s",
    },
    roleBadge: (color) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 8px",
      borderRadius: 100,
      background: color,
      fontSize: 11,
      fontWeight: 500,
      width: "fit-content",
    }),
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: theme.card,
      borderRadius: 28,
      padding: 32,
      maxWidth: 500,
      width: "90%",
      maxHeight: "80vh",
      overflow: "auto",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: 700 },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: 24,
      cursor: "pointer",
      color: theme.muted,
    },
    userDetail: {
      marginBottom: 16,
    },
    detailLabel: { fontSize: 11, color: theme.muted, marginBottom: 4 },
    detailValue: { fontSize: 14, fontWeight: 500 },
    footer: {
      padding: "24px 0",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 24,
    },
    "@media (max-width: 1024px)": {
      statsGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
      categoryStats: { gridTemplateColumns: "repeat(3, 1fr)" },
      tableHeader: { gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr 0.8fr", fontSize: 10 },
      tableRow: { gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr 0.8fr", fontSize: 10 },
    },
    "@media (max-width: 768px)": {
      statsGrid: { gridTemplateColumns: "1fr" },
      categoryStats: { gridTemplateColumns: "1fr" },
      tableHeader: { display: "none" },
      tableRow: { display: "flex", flexDirection: "column", gap: 6 },
      navLinks: { display: "none" },
    },
  };

  // ---------- Render ----------
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.brand} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={styles.logo} />
            <div>
              <div style={styles.brandName}>CycleCare</div>
              <div style={styles.brandTagline}>Admin Dashboard</div>
            </div>
          </div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/category" style={styles.navLink}>Categories</Link>
            <Link to="/profile" style={styles.navLink}>Profile</Link>
            <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Admin</span>
          </div>
          <div style={styles.themeToggle} onClick={() => setDark(v => !v)}>
            {dark ? "☀️" : "🌙"}
          </div>
        </nav>

        <div style={styles.hero}>
          <span style={styles.badge}>📊 Admin Dashboard</span>
          <h1 style={styles.title}>User Analytics</h1>
          <p style={styles.subtitle}>Real‑time user roles and activity from database</p>
          {error && <div style={{ color: theme.accent, fontSize: 11, marginTop: 8 }}>{error}</div>}
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statValue}>{stats.totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🟢</div>
            <div style={styles.statValue}>{stats.activeToday}</div>
            <div style={styles.statLabel}>Active Today</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statValue}>{stats.activeThisWeek}</div>
            <div style={styles.statLabel}>Active This Week</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statValue}>{Math.round((stats.activeToday / (stats.totalUsers || 1)) * 100)}%</div>
            <div style={styles.statLabel}>Engagement Rate</div>
          </div>
        </div>

        <div style={styles.categoryStats}>
          <div style={styles.categoryCard(getRoleColor("men").light)} onClick={() => setDateRange("men")}>
            <div style={styles.categoryIcon}>👨</div>
            <div style={styles.categoryValue}>{stats.men}</div>
            <div style={styles.categoryLabel}>Men (Support Guide)</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>{Math.round((stats.men / (stats.totalUsers || 1)) * 100)}% of users</div>
          </div>
          <div style={styles.categoryCard(getRoleColor("girls").light)} onClick={() => setDateRange("girls")}>
            <div style={styles.categoryIcon}>👧</div>
            <div style={styles.categoryValue}>{stats.girls}</div>
            <div style={styles.categoryLabel}>Non‑Menstruators</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>{Math.round((stats.girls / (stats.totalUsers || 1)) * 100)}% of users</div>
          </div>
          <div style={styles.categoryCard(getRoleColor("women").light)} onClick={() => setDateRange("women")}>
            <div style={styles.categoryIcon}>👩</div>
            <div style={styles.categoryValue}>{stats.women}</div>
            <div style={styles.categoryLabel}>Menstruators</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>{Math.round((stats.women / (stats.totalUsers || 1)) * 100)}% of users</div>
          </div>
        </div>

        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <span>🔍</span>
            <input type="text" style={styles.searchInput} placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div style={styles.filterBtns}>
            <button style={styles.filterBtn(dateRange === "all")} onClick={() => setDateRange("all")}>All</button>
            <button style={styles.filterBtn(dateRange === "men")} onClick={() => setDateRange("men")}>👨 Men</button>
            <button style={styles.filterBtn(dateRange === "girls")} onClick={() => setDateRange("girls")}>👧 Girls</button>
            <button style={styles.filterBtn(dateRange === "women")} onClick={() => setDateRange("women")}>👩 Women</button>
          </div>
        </div>

        <div style={styles.usersTable}>
          <div style={styles.tableHeader}>
            <div>Name</div>
            <div>Email</div>
            <div>Category</div>
            <div>Joined</div>
            <div>Last Active</div>
            <div>Activity</div>
          </div>
          {filteredUsers.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: theme.muted }}>
              {error ? "Unable to load users." : "No users found."}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const roleColor = getRoleColor(user.role);
              return (
                <div key={user.id} style={styles.tableRow} onClick={() => setSelectedUser(user)}>
                  <div style={{ fontWeight: 500 }}>{user.name}</div>
                  <div style={{ color: theme.muted }}>{user.email}</div>
                  <div>
                    <span style={styles.roleBadge(roleColor.light)}>
                      {getRoleIcon(user.role)} {user.role === "men" ? "Men" : user.role === "girls" ? "Girls" : user.role === "women" ? "Women" : "Not selected"}
                    </span>
                  </div>
                  <div style={{ color: theme.muted }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                  <div style={{ color: theme.muted }}>{new Date(user.lastActive).toLocaleDateString()}</div>
                  <div><span style={{ color: theme.green }}>📊 {user.cyclesTracked} cycles</span></div>
                </div>
              );
            })
          )}
        </div>

        {selectedUser && (
          <div style={styles.modal} onClick={() => setSelectedUser(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div style={styles.modalTitle}>User Details</div>
                <button style={styles.closeBtn} onClick={() => setSelectedUser(null)}>✕</button>
              </div>
              <div style={styles.userDetail}>
                <div style={styles.detailLabel}>Name</div>
                <div style={styles.detailValue}>{selectedUser.name}</div>
              </div>
              <div style={styles.userDetail}>
                <div style={styles.detailLabel}>Email</div>
                <div style={styles.detailValue}>{selectedUser.email}</div>
              </div>
              <div style={styles.userDetail}>
                <div style={styles.detailLabel}>Category</div>
                <div style={styles.detailValue}>
                  <span style={styles.roleBadge(getRoleColor(selectedUser.role).light)}>
                    {getRoleIcon(selectedUser.role)} {selectedUser.role === "men" ? "Men (Support Guide)" : selectedUser.role === "girls" ? "Non‑Menstruators" : selectedUser.role === "women" ? "Menstruators" : "Not selected"}
                  </span>
                </div>
              </div>
              <div style={styles.userDetail}>
                <div style={styles.detailLabel}>Joined</div>
                <div style={styles.detailValue}>{new Date(selectedUser.createdAt).toLocaleString()}</div>
              </div>
              <div style={styles.userDetail}>
                <div style={styles.detailLabel}>Last Active</div>
                <div style={styles.detailValue}>{new Date(selectedUser.lastActive).toLocaleString()}</div>
              </div>
              <div style={styles.userDetail}>
                <div style={styles.detailLabel}>Activity</div>
                <div style={styles.detailValue}>📊 {selectedUser.cyclesTracked} cycles tracked • 📝 {selectedUser.logsCount} logs</div>
              </div>
            </div>
          </div>
        )}

        <footer style={styles.footer}>
          <span style={{ fontSize: 10, color: theme.muted }}>© 2025 CycleCare • Admin Dashboard</span>
          <Link to="/" style={{ ...styles.navLink, fontSize: 10 }}>← Back to Home</Link>
        </footer>
      </div>
    </div>
  );
}