import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

export default function Profile() {
  console.log("PROFILE COMPONENT IS RENDERING");
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ---------- Theme & User Load ----------
  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);

    const userData = localStorage.getItem("cyclecare_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  // ---------- Logout (clears session, keeps data) ----------
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("cyclecare_logged_in");
      localStorage.removeItem("cyclecare_token");
      localStorage.removeItem("cyclecare_user");
      localStorage.removeItem("cyclecare_is_admin");
      localStorage.removeItem("cyclecare_role");
      localStorage.removeItem("cyclecare_created_at");
      // Keep theme preference (optional)
      navigate("/login");
    }
  };

  // ---------- Theme styles ----------
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
            glow: "rgba(229, 76, 111, 0.2)",
            chip: "rgba(229, 76, 111, 0.08)",
            shadow: "rgba(0, 0, 0, 0.06)",
            gradientStart: "#E54C6F",
            gradientEnd: "#FF8EAA",
            green: "#16A34A",
            red: "#DC2626",
          },
    [dark]
  );

  const getRoleName = (role) => {
    const isAdmin = localStorage.getItem("cyclecare_is_admin") === "true";
    if (isAdmin) return "Admin";
    if (role === "men") return "Men (Support Guide)";
    if (role === "girls") return "Non-Menstruators (Awareness)";
    if (role === "women") return "Menstruators (Tracker)";
    return "Not selected";
  };

  const getRoleIcon = (role) => {
    const isAdmin = localStorage.getItem("cyclecare_is_admin") === "true";
    if (isAdmin) return "👑";
    if (role === "men") return "👨";
    if (role === "girls") return "👧";
    if (role === "women") return "👩";
    return "❓";
  };

  const selectedRole = localStorage.getItem("cyclecare_role");
  const accountCreated =
    localStorage.getItem("cyclecare_created_at") ||
    (user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available");

  // ---------- Change Password Logic (placeholder) ----------
  const handleChangePassword = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) newErrors.newPassword = "New password is required";
    else if (passwordForm.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPasswordMessage("✅ Password change request sent! (Backend integration needed)");
    setTimeout(() => setPasswordMessage(""), 3000);
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------- Delete Account (permanent) ----------
  const handleDeleteAccount = () => {
    if (deleteConfirm !== "DELETE") {
      alert('Please type "DELETE" to confirm account deletion');
      return;
    }

    const confirmDelete = window.confirm(
      "⚠️ WARNING: This action is irreversible!\n\nAll your data will be permanently deleted."
    );

    if (confirmDelete) {
      const token = localStorage.getItem("cyclecare_token");

      fetch(`${API_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.clear();
            alert("Your account has been permanently deleted. Goodbye! 👋");
            navigate("/signup");
          } else {
            alert("Error deleting account: " + data.error);
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Network error. Please try again.");
        });
    }
  };

  // ========== STYLES OBJECT ==========
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
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

      

    container: { maxWidth: 900, margin: "0 auto", padding: "0 24px", flex: 1 },
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
      marginBottom: 32,
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
    profileCard: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 28,
      padding: 32,
      marginBottom: 24,
    },
    profileHeader: {
      display: "flex",
      alignItems: "center",
      gap: 20,
      marginBottom: 28,
      flexWrap: "wrap",
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
    },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
    profileEmail: { fontSize: 13, color: theme.muted, marginBottom: 8 },
    profileRole: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 100,
      background: theme.chip,
      fontSize: 12,
      fontWeight: 500,
    },
    buttonRow: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 },
    btnSecondary: {
      padding: "10px 20px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.text,
    },
    btnLogout: {
      padding: "10px 20px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.muted}`,
      color: theme.text,
    },
    section: {
      marginBottom: 28,
      padding: 24,
      borderRadius: 24,
      background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      border: `1px solid ${theme.border}`,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: `1px solid ${theme.border}`,
    },
    infoLabel: { fontSize: 13, fontWeight: 600, color: theme.muted },
    infoValue: { fontSize: 13, fontWeight: 500 },
    input: {
      width: "95%",
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
    errorText: { fontSize: 10, color: theme.red, marginTop: -8, marginBottom: 8 },
    btnPrimary: {
      padding: "10px 20px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
    },
    btnDanger: {
      padding: "10px 20px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.red}`,
      color: theme.red,
    },
    deleteConfirm: {
      marginTop: 16,
      padding: 16,
      borderRadius: 10,
      background: theme.red + "15",
      border: `1px solid ${theme.red}`,
    },
    successMessage: {
      padding: "12px 16px",
      borderRadius: 12,
      background: theme.green + "20",
      border: `1px solid ${theme.green}`,
      color: theme.green,
      fontSize: 12,
      textAlign: "center",
      marginBottom: 16,
    },
    footer: {
      padding: "24px 0",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 24,
    },
    "@media (max-width: 640px)": {
      profileHeader: { flexDirection: "column", textAlign: "center" },
      navLinks: { display: "none" },
      profileCard: { padding: 20 },
      section: { padding: 16 },
    },
  };
  // ========== END STYLES ==========

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.brand} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={styles.logo} />
            <div>
              <div style={styles.brandName}>CycleCare</div>
              <div style={styles.brandTagline}>Your Profile</div>
            </div>
          </div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/category" style={styles.navLink}>Categories</Link>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/contact" style={styles.navLink}>Contact</Link>
            <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Profile</span>
          </div>
          <div style={styles.themeToggle} onClick={() => setDark((v) => !v)}>
            {dark ? "☀️" : "🌙"}
          </div>
        </nav>

        <div style={styles.hero}>
          <span style={styles.badge}>👤 My Account</span>
          <h1 style={styles.title}>Profile Settings</h1>
          <p style={styles.subtitle}>View your account details and manage your password</p>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>{getRoleIcon(selectedRole) || "👤"}</div>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>{user?.name || "User"}</div>
              <div style={styles.profileEmail}>{user?.email || "No email"}</div>
              <div style={styles.profileRole}>
                <span>{getRoleIcon(selectedRole)}</span>
                <span>{getRoleName(selectedRole)}</span>
              </div>
            </div>
          </div>

          {/* Original button row */}
          <div style={styles.buttonRow}>
            <button style={styles.btnSecondary} onClick={() => setShowChangePassword(true)}>
              🔒 Change Password
            </button>
            <button style={styles.btnLogout} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>

          <button
              onClick={handleLogout}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "12px",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                background: "transparent",
                border: `1.5px solid ${theme.accentLight}`,
                color: theme.accent,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.accentLight;
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = theme.accent;
              }}
            >
              🚪 Logout (Click to sign out)
            </button>
          </div>

        {showChangePassword && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>🔒</span> Change Password
            </div>
            {passwordMessage && <div style={styles.successMessage}>{passwordMessage}</div>}
            <div>
              <div style={styles.label}>Current Password</div>
              <input
                type="password"
                name="currentPassword"
                style={styles.input}
                value={passwordForm.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
              {errors.currentPassword && <div style={styles.errorText}>{errors.currentPassword}</div>}
            </div>
            <div>
              <div style={styles.label}>New Password</div>
              <input
                type="password"
                name="newPassword"
                style={styles.input}
                value={passwordForm.newPassword}
                onChange={handleChange}
                placeholder="Enter new password (min. 6 characters)"
              />
              {errors.newPassword && <div style={styles.errorText}>{errors.newPassword}</div>}
            </div>
            <div>
              <div style={styles.label}>Confirm New Password</div>
              <input
                type="password"
                name="confirmPassword"
                style={styles.input}
                value={passwordForm.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}
            </div>
            <div style={styles.buttonRow}>
              <button style={styles.btnPrimary} onClick={handleChangePassword}>
                Update Password
              </button>
              <button style={styles.btnSecondary} onClick={() => setShowChangePassword(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>📋</span> Account Information
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Full Name</span>
            <span style={styles.infoValue}>{user?.name || "—"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email Address</span>
            <span style={styles.infoValue}>{user?.email || "—"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Selected Category</span>
            <span style={styles.infoValue}>{getRoleName(selectedRole)}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Account Created</span>
            <span style={styles.infoValue}>{accountCreated}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Account Status</span>
            <span style={styles.infoValue}>✅ Active</span>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>⚠️</span> Danger Zone
          </div>
          <p style={{ fontSize: 12, color: theme.muted, marginBottom: 16 }}>
            Once you delete your account, all your data will be permanently removed. This action
            cannot be undone.
          </p>
          <div style={styles.deleteConfirm}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: theme.red }}>
              To confirm deletion, type "DELETE" below:
            </div>
            <input
              type="text"
              style={styles.input}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder='Type "DELETE" to confirm'
            />
            <button style={styles.btnDanger} onClick={handleDeleteAccount}>
              🗑️ Permanently Delete Account
            </button>
          </div>
        </div>

        <footer style={styles.footer}>
          <span style={{ fontSize: 10, color: theme.muted }}>© 2025 CycleCare • Your Profile</span>
          <Link to="/category" style={{ ...styles.navLink, fontSize: 10 }}>
            ← Back to Categories
          </Link>
        </footer>
      </div>
    </div>
  );
}