import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [adminMode, setAdminMode] = useState(false);
  const [adminError, setAdminError] = useState("");

  const ADMIN_EMAIL = "shifashoebsyed@gmail.com";
  const ADMIN_PASSWORD = "Shifa@123";

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("cyclecare_theme", dark ? "dark" : "light");
  }, [dark]);

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
          },
    [dark]
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdminError("");
    if (!validateForm()) return;

    if (adminMode) {
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        localStorage.setItem("cyclecare_logged_in", "true");
        localStorage.setItem(
          "cyclecare_user",
          JSON.stringify({
            email: formData.email,
            name: "Admin",
            isAdmin: true,
          })
        );
        localStorage.setItem("cyclecare_is_admin", "true");
        navigate("/admin");
      } else {
        setAdminError("Invalid admin email or password. Please try again.");
      }
      return;
    }

    // Regular user login via backend
    fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("cyclecare_token", data.token);
          localStorage.setItem("cyclecare_logged_in", "true");
          localStorage.setItem(
            "cyclecare_user",
            JSON.stringify({
              name: data.user.name,
              email: data.user.email,
              isAdmin: false,
            })
          );
          localStorage.setItem("cyclecare_is_admin", "false");
          navigate("/category");
        } else {
          setErrors({ general: data.error || "Invalid email or password" });
        }
      })
      .catch(() => {
        setErrors({ general: "Network error. Please check your connection." });
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (adminError) setAdminError("");
  };

  // ========== STYLES ==========
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      background: dark
        ? `radial-gradient(circle at 0% 0%, rgba(255, 107, 139, 0.1), transparent 40%),
           radial-gradient(circle at 100% 100%, rgba(255, 142, 170, 0.08), transparent 50%),
           ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229, 76, 111, 0.05), transparent 40%),
           radial-gradient(circle at 100% 100%, rgba(251, 113, 133, 0.08), transparent 50%),
           ${theme.bg}`,
      color: theme.text,
      padding: "20px",
    },
    container: {
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    card: {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      gap: "30px",
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      borderRadius: "28px",
      boxShadow: `0 20px 40px -12px ${theme.shadow}`,
      padding: "32px 40px",
      position: "relative",
    },
    topRightWrapper: {
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      gap: "12px",
      zIndex: 10,
    },
    adminToggle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 14px",
      borderRadius: "100px",
      background: adminMode
        ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`
        : "transparent",
      border: `1px solid ${adminMode ? "transparent" : theme.border}`,
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      color: adminMode ? "white" : theme.text,
      transition: "all 0.2s",
    },
    themeToggle: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "100px",
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      fontSize: "11px",
      fontWeight: "500",
      color: theme.text,
    },
    leftSection: {
      display: "flex",
      flexDirection: "column",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    logo: {
      height: "36px",
      width: "36px",
      objectFit: "contain",
    },
    brandName: { fontSize: "16px", fontWeight: "700" },
    brandTagline: { fontSize: "9px", color: theme.muted, marginTop: "1px" },
    title: { fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0", letterSpacing: "-0.5px" },
    subtitle: { fontSize: "11px", color: theme.muted, marginBottom: "20px", lineHeight: "1.4" },
    form: { display: "flex", flexDirection: "column", gap: "12px" },
    fieldGroup: { display: "flex", flexDirection: "column", gap: "4px" },
    label: { fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" },
    input: {
      padding: "8px 12px",
      borderRadius: "10px",
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "white",
      color: theme.text,
      fontSize: "12px",
      outline: "none",
      transition: "all 0.2s",
    },
    errorText: { fontSize: "9px", color: theme.accent, marginTop: "2px" },
    row: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "4px",
    },
    helperText: {
      fontSize: "10px",
      color: theme.muted,
      cursor: "pointer",
      textDecoration: "underline",
    },
    btnPrimary: {
      padding: "8px 16px",
      borderRadius: "100px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      boxShadow: `0 2px 8px ${theme.glow}`,
      transition: "transform 0.2s",
      marginTop: "6px",
    },
    footerLinks: {
      marginTop: "16px",
      textAlign: "center",
      fontSize: "11px",
      color: theme.muted,
    },
    link: {
      color: theme.accent,
      textDecoration: "none",
      fontWeight: "600",
      marginLeft: "4px",
    },
    divider: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    dividerLine: {
      width: "1px",
      height: "100%",
      background: theme.border,
    },
    dividerText: {
      background: theme.card,
      padding: "6px 4px",
      color: theme.muted,
      fontSize: "11px",
      fontWeight: "500",
    },
    rightSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    googleIcon: {
      width: "40px",
      height: "40px",
      marginBottom: "12px",
    },
    googleTitle: {
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "6px",
    },
    googleDesc: {
      fontSize: "10px",
      color: theme.muted,
      marginBottom: "16px",
      lineHeight: "1.4",
    },
    googleBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      width: "100%",
      padding: "8px 16px",
      borderRadius: "100px",
      background: dark ? "rgba(255,255,255,0.05)" : "white",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      color: theme.text,
      transition: "all 0.2s",
    },
    benefits: {
      marginTop: "20px",
      textAlign: "left",
      width: "100%",
    },
    benefitItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
      fontSize: "10px",
      color: theme.muted,
    },
    "@media (max-width: 900px)": {
      card: { gridTemplateColumns: "1fr", gap: "24px", padding: "28px" },
      divider: { flexDirection: "row", padding: "12px 0" },
      dividerLine: { width: "100%", height: "1px" },
      themeToggle: { position: "relative", top: "auto", right: "auto", marginBottom: "16px", display: "inline-flex", justifyContent: "center" },
      adminToggle: { position: "relative", top: "auto", right: "auto", marginBottom: "16px", display: "inline-flex", justifyContent: "center" },
      topRightWrapper: { position: "relative", top: "auto", right: "auto", marginBottom: "16px", justifyContent: "center" },
    },
  };
  // ========== END STYLES ==========

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.topRightWrapper}>
            <div style={styles.themeToggle} onClick={() => setDark((v) => !v)}>
              <span>{dark ? "🌙" : "☀️"}</span>
              <span>{dark ? "Dark" : "Light"}</span>
            </div>
            <div
              style={styles.adminToggle}
              onClick={() => {
                setAdminMode(!adminMode);
                setAdminError("");
                setErrors({});
              }}
            >
              <span>{adminMode ? "👑" : "🔒"}</span>
              <span>{adminMode ? "Admin Mode ON" : "Admin Login"}</span>
            </div>
          </div>

          <div style={styles.leftSection}>
            <div style={styles.brand}>
              <img src={logo} alt="CycleCare" style={styles.logo} />
              <div>
                <div style={styles.brandName}>CycleCare</div>
                <div style={styles.brandTagline}>For Those Who Experience & Care</div>
              </div>
            </div>

            <h1 style={styles.title}>Welcome back</h1>
            <p style={styles.subtitle}>
              {adminMode ? "🔐 Admin Login" : "Login to continue tracking and learning"}
            </p>

            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.fieldGroup}>
                <div style={styles.label}>✉️ Email</div>
                <input
                  type="email"
                  name="email"
                  style={styles.input}
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div style={styles.errorText}>{errors.email}</div>}
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>🔒 Password</div>
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  style={styles.input}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div style={styles.errorText}>{errors.password}</div>}
                <div style={styles.row}>
                  <span style={styles.helperText} onClick={() => setShow(!show)}>
                    {show ? "Hide password" : "Show password"}
                  </span>
                  {!adminMode && (
                    <span
                      style={styles.helperText}
                      onClick={() => alert("Password reset will be available soon! 💗")}
                    >
                      Forgot password?
                    </span>
                  )}
                </div>
              </div>

              {errors.general && <div style={styles.errorText}>{errors.general}</div>}
              {adminError && <div style={styles.errorText}>{adminError}</div>}

              <button type="submit" style={styles.btnPrimary}>
                {adminMode ? "Admin Login →" : "Login →"}
              </button>
            </form>

            {!adminMode && (
              <>
                <div style={styles.footerLinks}>
                  New here? <Link to="/signup" style={styles.link}>Create an account</Link>
                </div>
                <div style={styles.footerLinks}>
                  <Link to="/" style={styles.link}>← Back to Home</Link>
                </div>
              </>
            )}
          </div>

          {!adminMode && (
            <>
              <div style={styles.divider}>
                <div style={styles.dividerLine} />
                <div style={styles.dividerText}>OR</div>
                <div style={styles.dividerLine} />
              </div>

              <div style={styles.rightSection}>
                <svg style={styles.googleIcon} viewBox="0 0 24 24" width="40" height="40">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.28-3.28A11.96 11.96 0 0 0 12 0C7.344 0 3.308 2.828 1.228 6.778l4.038 2.987z"/>
                  <path fill="#34A853" d="M16.218 18.497A7.074 7.074 0 0 1 12 19.09c-2.706 0-5.055-1.47-6.286-3.646l-4.038 2.987C4.308 21.172 8.344 24 12 24c3.128 0 6.017-1.267 8.166-3.318l-3.948-2.185z"/>
                  <path fill="#4A90E2" d="M22.227 11.5c0-.773-.069-1.5-.2-2.227H12v4.636h5.91a5.895 5.895 0 0 1-2.535 3.87l3.948 2.185c2.34-2.162 3.727-5.336 3.727-8.464z"/>
                  <path fill="#FBBC05" d="M5.266 14.49A7.077 7.077 0 0 1 4.909 12c0-.85.136-1.68.357-2.46L1.228 6.554A11.96 11.96 0 0 0 0 12c0 1.92.456 3.736 1.228 5.446l4.038-2.987z"/>
                </svg>

                <div style={styles.googleTitle}>Continue with Google</div>
                <div style={styles.googleDesc}>
                  Login quickly using<br />
                  your Google account
                </div>

                <button style={styles.googleBtn} onClick={handleGoogleLogin}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.28-3.28A11.96 11.96 0 0 0 12 0C7.344 0 3.308 2.828 1.228 6.778l4.038 2.987z"/>
                    <path fill="#34A853" d="M16.218 18.497A7.074 7.074 0 0 1 12 19.09c-2.706 0-5.055-1.47-6.286-3.646l-4.038 2.987C4.308 21.172 8.344 24 12 24c3.128 0 6.017-1.267 8.166-3.318l-3.948-2.185z"/>
                    <path fill="#4A90E2" d="M22.227 11.5c0-.773-.069-1.5-.2-2.227H12v4.636h5.91a5.895 5.895 0 0 1-2.535 3.87l3.948 2.185c2.34-2.162 3.727-5.336 3.727-8.464z"/>
                    <path fill="#FBBC05" d="M5.266 14.49A7.077 7.077 0 0 1 4.909 12c0-.85.136-1.68.357-2.46L1.228 6.554A11.96 11.96 0 0 0 0 12c0 1.92.456 3.736 1.228 5.446l4.038-2.987z"/>
                  </svg>
                  Login with Google
                </button>

                <div style={styles.benefits}>
                  <div style={styles.benefitItem}>
                    <span>✓</span> One-click login
                  </div>
                  <div style={styles.benefitItem}>
                    <span>✓</span> Secure authentication
                  </div>
                  <div style={styles.benefitItem}>
                    <span>✓</span> No password to remember
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}