import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";
import Navbar from "../components/Navbar";

export default function Contact() {
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const theme = useMemo(
    () =>
      dark
        ? {
            bg: "#0A0A0F",
            card: "rgba(25, 25, 35, 0.75)",
            border: "rgba(255, 105, 150, 0.25)",
            text: "#FDF2F8",
            muted: "rgba(253, 242, 248, 0.7)",
            accent: "#FF6B8B",
            accentLight: "#FF8EAA",
            accentDark: "#E54C6F",
            glow: "rgba(255, 107, 139, 0.35)",
            chip: "rgba(255, 107, 139, 0.2)",
            shadow: "rgba(0, 0, 0, 0.4)",
            gradientStart: "#FF6B8B",
            gradientEnd: "#FF8EAA",
          }
        : {
            bg: "#FFF9FB",
            card: "rgba(255, 245, 248, 0.85)",
            border: "rgba(229, 76, 111, 0.2)",
            text: "#2D1B23",
            muted: "rgba(45, 27, 35, 0.65)",
            accent: "#E54C6F",
            accentLight: "#FF6B8B",
            accentDark: "#C73E5E",
            glow: "rgba(229, 76, 111, 0.2)",
            chip: "rgba(229, 76, 111, 0.12)",
            shadow: "rgba(0, 0, 0, 0.08)",
            gradientStart: "#E54C6F",
            gradientEnd: "#FF8EAA",
          },
    [dark]
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      background: dark
        ? `radial-gradient(circle at 10% 20%, rgba(255, 107, 139, 0.15), transparent 50%),
           radial-gradient(circle at 90% 80%, rgba(255, 142, 170, 0.12), transparent 55%),
           ${theme.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(229, 76, 111, 0.08), transparent 45%),
           radial-gradient(circle at 100% 100%, rgba(255, 107, 139, 0.1), transparent 50%),
           ${theme.bg}`,
      color: theme.text,
    },
    content: { flex: 1 },
    container: { maxWidth: 1280, margin: "0 auto", padding: "0 24px" },

    nav: {
      position: "sticky",
      top: 20,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      padding: "12px 24px",
      marginTop: 20,
      borderRadius: 100,
      background: dark ? "rgba(20, 20, 28, 0.85)" : "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${theme.border}`,
      boxShadow: `0 8px 32px ${theme.shadow}`,
    },
    brand: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },
    logo: {
      height: 48,
      width: "auto",
      filter: dark ? "drop-shadow(0 4px 12px rgba(255,107,139,0.4))" : "none",
    },
    brandText: { display: "flex", flexDirection: "column" },
    brandName: { fontSize: 20, fontWeight: 800, letterSpacing: -0.3 },
    brandTagline: { fontSize: 11, color: theme.muted, fontWeight: 500, letterSpacing: 0.3 },
    navLinks: { display: "flex", gap: 8, alignItems: "center" },
    navLink: {
      padding: "8px 16px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      color: theme.muted,
      transition: "all 0.2s ease",
    },
    navLinkActive: {
      color: theme.accent,
      background: theme.chip,
    },
    navActions: { display: "flex", alignItems: "center", gap: 12 },
    themeToggle: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      borderRadius: 100,
      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
      border: `1px solid ${theme.border}`,
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 500,
    },

    hero: {
      marginTop: 60,
      marginBottom: 60,
      textAlign: "center",
    },
    badge: {
      display: "inline-flex",
      padding: "6px 14px",
      borderRadius: 100,
      background: theme.chip,
      border: `1px solid ${theme.border}`,
      fontSize: 13,
      fontWeight: 600,
      color: theme.accent,
      marginBottom: 24,
    },
    title: {
      fontSize: 48,
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: -1,
      margin: "0 0 16px 0",
    },
    highlight: { color: theme.accent },
    description: {
      fontSize: 18,
      lineHeight: 1.6,
      color: theme.muted,
      margin: "0 auto",
      maxWidth: 600,
    },

    layout: {
      display: "grid",
      gridTemplateColumns: "1fr 0.9fr",
      gap: 40,
      marginBottom: 80,
    },

    card: {
      borderRadius: 32,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      padding: 36,
      transition: "transform 0.2s",
    },
    formTitle: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
    formSub: { fontSize: 14, color: theme.muted, marginBottom: 28, lineHeight: 1.5 },

    form: { display: "flex", flexDirection: "column", gap: 20 },
    fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
    label: {
      fontSize: 13,
      fontWeight: 600,
      color: theme.text,
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    input: {
      padding: "14px 16px",
      borderRadius: 20,
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
      color: theme.text,
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      transition: "all 0.2s",
    },
    textarea: {
      padding: "14px 16px",
      borderRadius: 20,
      border: `1px solid ${theme.border}`,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
      color: theme.text,
      fontSize: 14,
      fontFamily: "inherit",
      resize: "vertical",
      minHeight: 120,
      outline: "none",
    },
    btnPrimary: {
      padding: "14px 28px",
      borderRadius: 100,
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      marginTop: 8,
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    successMessage: {
      padding: "12px 20px",
      borderRadius: 16,
      background: dark ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)",
      border: `1px solid ${dark ? "#4CAF50" : "#4CAF50"}`,
      color: "#4CAF50",
      fontSize: 14,
      fontWeight: 500,
      textAlign: "center",
      marginTop: 16,
    },

    infoCard: { display: "flex", flexDirection: "column", gap: 24 },
    infoTitle: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
    infoText: { fontSize: 14, color: theme.muted, lineHeight: 1.6, marginBottom: 16 },

    contactMethod: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "16px 20px",
      borderRadius: 24,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)",
      border: `1px solid ${theme.border}`,
      transition: "transform 0.2s",
    },
    iconBox: {
      width: 52,
      height: 52,
      borderRadius: 26,
      background: theme.chip,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      flexShrink: 0,
    },
    methodContent: { flex: 1 },
    methodTitle: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
    methodDetail: { fontSize: 13, color: theme.muted, fontWeight: 500 },
    methodLink: {
      fontSize: 13,
      color: theme.accent,
      textDecoration: "none",
      cursor: "pointer",
    },

    responseTime: {
      marginTop: 24,
      padding: "16px 20px",
      borderRadius: 24,
      background: theme.chip,
      border: `1px solid ${theme.border}`,
      textAlign: "center",
    },
    responseText: {
      fontSize: 13,
      color: theme.muted,
      fontWeight: 500,
    },
    responseHighlight: {
      color: theme.accent,
      fontWeight: 600,
    },

    footer: {
      padding: "40px 0 32px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 20,
    },
    footerLeft: { display: "flex", alignItems: "center", gap: 12 },
    footerLogo: { height: 32, width: "auto" },
    footerText: { fontSize: 12, color: theme.muted },
    footerLinks: { display: "flex", gap: 24 },
    footerLink: { fontSize: 13, color: theme.muted, cursor: "pointer" },

    "@media (max-width: 1024px)": {
      layout: { gridTemplateColumns: "1fr", gap: 32 },
      title: { fontSize: 36 },
    },
    "@media (max-width: 640px)": {
      title: { fontSize: 32 },
      card: { padding: 24 },
      navLinks: { display: "none" },
      footer: { flexDirection: "column", textAlign: "center" },
      footerLinks: { justifyContent: "center" },
    },
  };

  const ContactMethod = ({ icon, title, detail, link, linkText }) => (
    <div style={styles.contactMethod}>
      <div style={styles.iconBox}>{icon}</div>
      <div style={styles.methodContent}>
        <div style={styles.methodTitle}>{title}</div>
        <div style={styles.methodDetail}>{detail}</div>
        {link && (
          <span style={styles.methodLink} onClick={() => window.location.href = link}>
            {linkText} →
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar />

        {/* Hero Section */}
        <div style={styles.hero}>
          <span style={styles.badge}>💬 Get in touch</span>
          <h1 style={styles.title}>
            We'd love to hear
            <br />
            <span style={styles.highlight}>from you</span>
          </h1>
          <p style={styles.description}>
            Have questions, feedback, or just want to say hello? Reach out anytime.
          </p>
        </div>

        {/* Contact Layout */}
        <div style={styles.layout}>
          {/* Contact Form */}
          <div style={styles.card}>
            <h2 style={styles.formTitle}>Send a message</h2>
            <p style={styles.formSub}>
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.fieldGroup}>
                <div style={styles.label}>
                  <span>👤</span> Your name
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>
                  <span>✉️</span> Email address
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>
                  <span>📌</span> Subject
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <div style={styles.label}>
                  <span>💬</span> Message
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  style={styles.textarea}
                  required
                />
              </div>

              <button type="submit" style={styles.btnPrimary}>
                Send message →
              </button>

              {submitted && (
                <div style={styles.successMessage}>
                  ✨ Message sent! We'll get back to you within 24 hours.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div style={styles.card}>
            <div style={styles.infoCard}>
              <div>
                <h2 style={styles.infoTitle}>Connect with us</h2>
                <p style={styles.infoText}>
                  Whether you need support, have a question about cycle tracking, or want to share your experience — we're here for you.
                </p>
              </div>

              <ContactMethod
                icon="📧"
                title="Email us"
                detail="For general inquiries and support"
                link="mailto:shifa.syed@somaiya.edu"
                linkText="shifa.syed@somaiya.edu"
              />

              <div style={styles.responseTime}>
                <div style={styles.responseText}>
                  ⏰ <span style={styles.responseHighlight}>We'll get back to you within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerLeft}>
            <img src={logo} alt="CycleCare" style={styles.footerLogo} />
            <span style={styles.footerText}>© 2025 CycleCare</span>
          </div>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink} onClick={() => navigate("/about")}>About</span>
            <span style={styles.footerLink} onClick={() => navigate("/privacy")}>Privacy</span>
            <span style={styles.footerLink} onClick={() => navigate("/terms")}>Terms</span>
          </div>
        </footer>
      </div>
    </div>
  );
}