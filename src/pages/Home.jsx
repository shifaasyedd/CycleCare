import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

export default function Home() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  // Handle Google OAuth callback token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token);
      // Remove token from URL to avoid re-processing on refresh
      window.history.replaceState({}, document.title, "/");
      // Redirect to category page
      navigate("/category");
    }
  }, [navigate]);

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
      "&:hover": { color: theme.accent, background: theme.chip },
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
    btnOutline: {
      padding: "8px 20px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.text,
      transition: "all 0.2s",
      "&:hover": {
        background: theme.chip,
        borderColor: theme.accent,
      },
    },
    btnPrimary: {
      padding: "8px 24px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      boxShadow: `0 4px 14px ${theme.glow}`,
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 8px 20px ${theme.glow}`,
      },
    },

    hero: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      marginTop: 80,
      marginBottom: 100,
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
      fontSize: 64,
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: -2,
      margin: "0 0 20px 0",
      maxWidth: 900,
    },
    highlight: {
      color: theme.accent,
      position: "relative",
      display: "inline-block",
    },
    description: {
      fontSize: 18,
      lineHeight: 1.6,
      color: theme.muted,
      margin: "0 auto 40px",
      maxWidth: 650,
    },
    heroButtons: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      marginBottom: 60,
    },
    btnLarge: {
      padding: "14px 36px",
      borderRadius: 100,
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    btnPrimaryLarge: {
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      boxShadow: `0 8px 24px ${theme.glow}`,
    },
    btnOutlineLarge: {
      background: "transparent",
      border: `1.5px solid ${theme.border}`,
      color: theme.text,
    },

    features: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 32,
      marginBottom: 100,
    },
    featureCard: {
      padding: 28,
      borderRadius: 28,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      textAlign: "center",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    },
    featureIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      background: theme.chip,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      margin: "0 auto 20px",
    },
    featureTitle: { fontSize: 20, fontWeight: 700, marginBottom: 12 },
    featureDesc: { fontSize: 14, color: theme.muted, lineHeight: 1.6 },

    quoteSection: {
      marginBottom: 100,
      padding: "60px 48px",
      borderRadius: 48,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      textAlign: "center",
    },
    quoteText: {
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.4,
      maxWidth: 800,
      margin: "0 auto 24px",
      fontStyle: "italic",
    },
    quoteAuthor: { fontSize: 14, color: theme.muted },

    cta: {
      marginBottom: 80,
      padding: "56px 48px",
      borderRadius: 48,
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      textAlign: "center",
    },
    ctaTitle: { fontSize: 36, fontWeight: 700, color: "white", marginBottom: 16 },
    ctaDesc: {
      fontSize: 16,
      color: "rgba(255,255,255,0.9)",
      marginBottom: 32,
      maxWidth: 500,
      margin: "0 auto 32px",
    },
    ctaButton: {
      padding: "14px 40px",
      borderRadius: 100,
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      background: "white",
      border: "none",
      color: theme.accent,
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.02)",
      },
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
    footerLink: {
      fontSize: 13,
      color: theme.muted,
      cursor: "pointer",
      "&:hover": { color: theme.accent },
    },

    "@media (max-width: 1024px)": {
      features: { gridTemplateColumns: "1fr", gap: 24 },
      title: { fontSize: 48 },
      quoteText: { fontSize: 20 },
      ctaTitle: { fontSize: 28 },
    },
    "@media (max-width: 640px)": {
      title: { fontSize: 36 },
      heroButtons: { flexDirection: "column", alignItems: "center" },
      navLinks: { display: "none" },
      footer: { flexDirection: "column", textAlign: "center" },
      footerLinks: { justifyContent: "center" },
    },
  };

  const FeatureCard = ({ icon, title, desc }) => (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>{icon}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDesc}>{desc}</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Navigation */}
        <nav style={styles.nav}>
          <div style={styles.brand} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={styles.logo} />
            <div style={styles.brandText}>
              <span style={styles.brandName}>CycleCare</span>
              <span style={styles.brandTagline}>For those who experience and care</span>
            </div>
          </div>

          <div style={styles.navLinks}>
            <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Home</span>
            <span style={styles.navLink} onClick={() => navigate("/about")}>About</span>
            <span style={styles.navLink} onClick={() => navigate("/contact")}>Contact</span>
          </div>

          <div style={styles.navActions}>
            <div style={styles.themeToggle} onClick={() => setDark((v) => !v)}>
              <span>{dark ? "🌙" : "☀️"}</span>
              <span style={{ fontSize: 13 }}>{dark ? "Dark" : "Light"}</span>
            </div>
            <button style={styles.btnOutline} onClick={() => navigate("/login")}>
              Log in
            </button>
            <button style={styles.btnPrimary} onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div style={styles.hero}>
          <span style={styles.badge}>✨ Welcome to CycleCare</span>
          <h1 style={styles.title}>
            Your journey with
            <br />
            <span style={styles.highlight}>periods, understood.</span>
          </h1>
          <p style={styles.description}>
            A safe, respectful space for everyone — whether you're tracking,
            learning, or supporting. Get personalized insights and education
            tailored to your needs.
          </p>
          <div style={styles.heroButtons}>
            <button
              style={{ ...styles.btnLarge, ...styles.btnPrimaryLarge }}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
            <button
              style={{ ...styles.btnLarge, ...styles.btnOutlineLarge }}
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Features */}
        <div style={styles.features}>
          <FeatureCard
            icon="📚"
            title="Learn & Understand"
            desc="Age-appropriate education for every stage — from first period to cycle tracking."
          />
          <FeatureCard
            icon="📱"
            title="Track with Ease"
            desc="Simple logging tools to monitor your cycle, symptoms, and overall wellness."
          />
          <FeatureCard
            icon="💡"
            title="Personalized Insights"
            desc="Get predictions and insights based on your unique cycle patterns."
          />
        </div>

        {/* Quote */}
        <div style={styles.quoteSection}>
          <p style={styles.quoteText}>
            "Understanding our bodies shouldn't be complicated. CycleCare makes
            period education and tracking simple, respectful, and accessible for
            everyone."
          </p>
          <p style={styles.quoteAuthor}>— CycleCare Team</p>
        </div>

        {/* CTA */}
        <div style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to begin?</h2>
          <p style={styles.ctaDesc}>
            Sign up today and choose the path that's right for you.
          </p>
          <button style={styles.ctaButton} onClick={() => navigate("/signup")}>
            Create free account →
          </button>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerLeft}>
            <img src={logo} alt="CycleCare" style={styles.footerLogo} />
            <span style={styles.footerText}>© 2025 CycleCare</span>
          </div>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink} onClick={() => navigate("/about")}>
              About
            </span>
            <span style={styles.footerLink} onClick={() => navigate("/contact")}>
              Contact
            </span>
            <span style={styles.footerLink} onClick={() => navigate("/terms")}>
              Terms
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}