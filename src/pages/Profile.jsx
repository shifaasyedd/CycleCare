import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

export default function Profile() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDanger, setShowDanger] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
    const userData = localStorage.getItem("cyclecare_user");
    if (userData) setUser(JSON.parse(userData));
    else navigate("/login");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

  const t = useMemo(
    () => dark ? {
    bg: "#06060B",
    surface: "rgba(18, 18, 28, 0.95)",
    surfaceAlt: "rgba(25, 25, 38, 0.8)",
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
    red: "#FB7185",
    redSoft: "rgba(251, 113, 133, 0.12)",
    input: "rgba(255,255,255,0.06)",
    shadow: "0 1px 3px rgba(0,0,0,0.4)",
  } : {
    bg: "#F8F6FA",
    surface: "rgba(255, 255, 255, 0.95)",
    surfaceAlt: "rgba(0, 0, 0, 0.02)",
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
    red: "#DC2626",
    redSoft: "rgba(220, 38, 38, 0.06)",
    input: "rgba(0,0,0,0.03)",
    shadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  [dark]);

  const selectedRole = localStorage.getItem("cyclecare_role");
  const isAdmin = localStorage.getItem("cyclecare_is_admin") === "true";

  const getRoleName = (role) => {
    if (isAdmin) return "Admin";
    if (role === "men") return "Men (Support Guide)";
    if (role === "girls") return "Non-Menstruators (Awareness)";
    if (role === "women") return "Menstruators (Tracker)";
    return "Not selected";
  };

  const getRoleIcon = (role) => {
    if (isAdmin) return "crown";
    if (role === "men") return "man";
    if (role === "girls") return "girl";
    if (role === "women") return "woman";
    return "unknown";
  };

  const roleColorMap = {
    crown: { bg: t.accentSoft, color: t.accent },
    man: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6" },
    girl: { bg: t.greenSoft, color: t.green },
    woman: { bg: t.accentSoft, color: t.accent },
    unknown: { bg: t.surfaceAlt, color: t.textTertiary },
  };

  const roleKey = getRoleIcon(selectedRole);
  const roleStyle = roleColorMap[roleKey];

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("cyclecare_logged_in");
    localStorage.removeItem("cyclecare_token");
    localStorage.removeItem("cyclecare_user");
    localStorage.removeItem("cyclecare_is_admin");
    localStorage.removeItem("cyclecare_role");
    navigate("/login");
  };

  const handleChangePassword = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = "Required";
    if (!passwordForm.newPassword) newErrors.newPassword = "Required";
    else if (passwordForm.newPassword.length < 6) newErrors.newPassword = "Min 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setPasswordMessage("Password updated successfully");
    setTimeout(() => setPasswordMessage(""), 3000);
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== "DELETE") { alert('Type "DELETE" to confirm'); return; }
    if (!window.confirm("This is irreversible. All data will be permanently deleted.")) return;
    const token = localStorage.getItem("cyclecare_token");
    fetch(`${API_URL}/api/auth/delete-account`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) { localStorage.clear(); navigate("/signup"); }
        else alert("Error: " + data.error);
      })
      .catch(() => alert("Network error. Please try again."));
  };

  const accountCreated = localStorage.getItem("cyclecare_created_at") ||
    (user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A");

  const InfoItem = ({ label, value, accent }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${t.border}` }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: t.textSecondary }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: accent ? t.green : t.text }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: dark ? "rgba(6,6,11,0.85)" : "rgba(248,246,250,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
              <img src={logo} alt="CycleCare" style={{ height: 28 }} />
              <span style={{ fontSize: 15, fontWeight: 700 }}>CycleCare</span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {[{ to: "/", label: "Home" }, { to: "/category", label: "Categories" }, { to: "/dashboard", label: "Dashboard" }, { to: "/forum", label: "Forum" }].map(l => (
                <Link key={l.to} to={l.to} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, color: t.textSecondary, textDecoration: "none", fontWeight: 500 }}>{l.label}</Link>
              ))}
              <span style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, color: t.accent, fontWeight: 600, background: t.accentSoft }}>Profile</span>
            </div>
          </div>
          <div style={{ padding: "6px 12px", borderRadius: 8, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 13 }} onClick={() => setDark(v => !v)}>
            {dark ? "Light" : "Dark"}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 32px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Profile</h1>
          <p style={{ fontSize: 13, color: t.textSecondary, margin: "4px 0 0" }}>Manage your account settings</p>
        </div>

        {passwordMessage && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: t.greenSoft, border: `1px solid ${t.green}30`, color: t.green, fontSize: 13, fontWeight: 600, marginBottom: 20, textAlign: "center" }}>
            {passwordMessage}
          </div>
        )}

        {/* Profile Card */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: t.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "white", fontWeight: 700, flexShrink: 0 }}>
              {(user?.name || "?")[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{user?.name || "User"}</div>
              <div style={{ fontSize: 13, color: t.textSecondary, marginTop: 2 }}>{user?.email || "No email"}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: roleStyle.bg, fontSize: 12, fontWeight: 600, color: roleStyle.color, marginTop: 8 }}>
                {getRoleName(selectedRole)}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => setShowChangePassword(!showChangePassword)} style={{
              padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: showChangePassword ? t.accentSoft : "transparent",
              border: `1px solid ${showChangePassword ? t.accent : t.border}`,
              color: showChangePassword ? t.accent : t.textSecondary,
            }}>Change Password</button>
            <button onClick={handleLogout} style={{
              padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary,
            }}>Logout</button>
          </div>
        </div>

        {/* Change Password Section */}
        {showChangePassword && (
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Change Password</div>
            {[
              { name: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
              { name: "newPassword", label: "New Password", placeholder: "Min 6 characters" },
              { name: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter new password" },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSecondary, marginBottom: 6 }}>{field.label}</label>
                <input type="password" name={field.name} value={passwordForm[field.name]}
                  onChange={e => {
                    setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }));
                    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: "" }));
                  }}
                  placeholder={field.placeholder}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${errors[field.name] ? t.red : t.border}`, background: t.input, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                {errors[field.name] && <div style={{ fontSize: 11, color: t.red, marginTop: 4 }}>{errors[field.name]}</div>}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleChangePassword} style={{
                padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
                background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})`, color: "white",
              }}>Update Password</button>
              <button onClick={() => { setShowChangePassword(false); setErrors({}); }} style={{
                padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary,
              }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Account Information */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: t.shadow }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Account Information</div>
          <div style={{ fontSize: 12, color: t.textTertiary, marginBottom: 16 }}>Your account details</div>
          <InfoItem label="Full Name" value={user?.name || "N/A"} />
          <InfoItem label="Email Address" value={user?.email || "N/A"} />
          <InfoItem label="Category" value={getRoleName(selectedRole)} />
          <InfoItem label="Account Created" value={accountCreated} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: t.textSecondary }}>Status</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: t.greenSoft, color: t.green }}>Active</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", boxShadow: t.shadow }}>
          <button onClick={() => setShowDanger(!showDanger)} style={{
            width: "100%", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "transparent", border: "none", cursor: "pointer", color: t.red, fontSize: 15, fontWeight: 700, fontFamily: "inherit",
          }}>
            <span>Danger Zone</span>
            <span style={{ fontSize: 12, color: t.textTertiary }}>{showDanger ? "Hide" : "Show"}</span>
          </button>
          {showDanger && (
            <div style={{ padding: "0 28px 28px" }}>
              <p style={{ fontSize: 13, color: t.textSecondary, margin: "0 0 16px", lineHeight: 1.6 }}>
                Once you delete your account, all your data will be permanently removed. This cannot be undone.
              </p>
              <div style={{ padding: 18, borderRadius: 12, background: t.redSoft, border: `1px solid ${t.red}25` }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.red, marginBottom: 8 }}>Type "DELETE" to confirm</label>
                <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
                <button onClick={handleDeleteAccount} disabled={deleteConfirm !== "DELETE"} style={{
                  padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  background: deleteConfirm === "DELETE" ? t.red : "transparent",
                  border: `1px solid ${t.red}`,
                  color: deleteConfirm === "DELETE" ? "white" : t.red,
                  opacity: deleteConfirm === "DELETE" ? 1 : 0.5,
                }}>Permanently Delete Account</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: 48, padding: "20px 0", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: t.textTertiary }}>CycleCare Profile</span>
          <Link to="/category" style={{ fontSize: 11, color: t.textTertiary, textDecoration: "none" }}>Back to Categories</Link>
        </footer>
      </div>
    </div>
  );
}
