import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import logo from "../assets/cyclecare-logo.png";
import Navbar from "../components/Navbar";

export default function About() {
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
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
      margin: "0 0 20px 0",
    },
    highlight: { color: theme.accent },
    description: {
      fontSize: 18,
      lineHeight: 1.6,
      color: theme.muted,
      margin: "0 auto",
      maxWidth: 700,
    },

    missionSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      marginBottom: 80,
      alignItems: "center",
    },
    missionContent: { display: "flex", flexDirection: "column", gap: 20 },
    missionTitle: { fontSize: 32, fontWeight: 700, marginBottom: 8 },
    missionText: { fontSize: 16, color: theme.muted, lineHeight: 1.7 },
    missionImage: {
      borderRadius: 32,
      background: `linear-gradient(135deg, ${theme.gradientStart}20, ${theme.gradientEnd}20)`,
      padding: 20,
      textAlign: "center",
    },
    imagePlaceholder: {
      width: "100%",
      height: "auto",
      borderRadius: 24,
    },

    valuesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 32,
      marginBottom: 80,
    },
    valueCard: {
      padding: 28,
      borderRadius: 28,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      textAlign: "center",
      transition: "transform 0.2s",
    },
    valueIcon: {
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
    valueTitle: { fontSize: 20, fontWeight: 700, marginBottom: 12 },
    valueDesc: { fontSize: 14, color: theme.muted, lineHeight: 1.6 },

    storySection: {
      marginBottom: 80,
      padding: "48px 40px",
      borderRadius: 48,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      textAlign: "center",
    },
    storyTitle: { fontSize: 28, fontWeight: 700, marginBottom: 20 },
    storyText: { fontSize: 16, color: theme.muted, lineHeight: 1.7, maxWidth: 800, margin: "0 auto" },

    teamSection: {
      marginBottom: 80,
    },
    sectionHeader: { textAlign: "center", marginBottom: 48 },
    sectionTitle: { fontSize: 32, fontWeight: 700, marginBottom: 16 },
    sectionDesc: { fontSize: 16, color: theme.muted, maxWidth: 600, margin: "0 auto" },
    teamGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 32,
    },
    teamCard: {
      textAlign: "center",
    },
    teamAvatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      margin: "0 auto 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 48,
      fontWeight: 600,
      color: "white",
    },
    teamName: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
    teamRole: { fontSize: 13, color: theme.muted },

    cta: {
      marginBottom: 80,
      padding: "56px 48px",
      borderRadius: 48,
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      textAlign: "center",
    },
    ctaTitle: { fontSize: 32, fontWeight: 700, color: "white", marginBottom: 16 },
    ctaDesc: { fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" },
    ctaButton: {
      padding: "14px 40px",
      borderRadius: 100,
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      background: "white",
      border: "none",
      color: theme.accent,
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
      missionSection: { gridTemplateColumns: "1fr", gap: 32 },
      valuesGrid: { gridTemplateColumns: "1fr", gap: 24 },
      teamGrid: { gridTemplateColumns: "repeat(2, 1fr)", gap: 32 },
      title: { fontSize: 36 },
    },
    "@media (max-width: 640px)": {
      title: { fontSize: 32 },
      teamGrid: { gridTemplateColumns: "1fr", gap: 32 },
      navLinks: { display: "none" },
      footer: { flexDirection: "column", textAlign: "center" },
      footerLinks: { justifyContent: "center" },
      storySection: { padding: "32px 24px" },
    },
  };

  const ValueCard = ({ icon, title, desc }) => (
    <div style={styles.valueCard}>
      <div style={styles.valueIcon}>{icon}</div>
      <h3 style={styles.valueTitle}>{title}</h3>
      <p style={styles.valueDesc}>{desc}</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar />

        {/* Hero Section */}
        <div style={styles.hero}>
          <span style={styles.badge}><Heart size={14} style={{ marginRight: 6 }} /> Our story</span>
          <h1 style={styles.title}>
            Making period care
            <br />
            <span style={styles.highlight}>accessible for everyone</span>
          </h1>
          <p style={styles.description}>
            CycleCare was born from a simple belief: menstrual health education and tracking should be available to all, without stigma or barriers.
          </p>
        </div>

        {/* Mission Section */}
        <div style={styles.missionSection}>
          <div style={styles.missionContent}>
            <h2 style={styles.missionTitle}>Our Mission</h2>
            <p style={styles.missionText}>
              CycleCare is an inclusive menstrual health platform designed not only for individuals who experience menstrual cycles but also for those who wish to understand and support them.
            </p>
            <p style={styles.missionText}>
              We help users track their cycle, predict future periods, and learn about menstrual health in a stigma-free and educational environment.
            </p>
            <p style={styles.missionText}>
              Our goal is to educate children, raise awareness among men, and empower menstruators with knowledge and predictive insights through technology.
            </p>
            <p style={{ ...styles.missionText, fontWeight: 600, color: theme.accent }}>
              CycleCare — For Those Who Experience & Care.
            </p>
          </div>
          <div style={styles.missionImage}>
            <svg width="100%" height="320" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="160" r="100" fill={theme.accentLight} fillOpacity="0.2" />
              <circle cx="160" cy="140" r="12" fill={theme.accent} fillOpacity="0.7" />
              <circle cx="240" cy="140" r="12" fill={theme.accent} fillOpacity="0.7" />
              <path d="M180 190 L220 190" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" />
              <path d="M200 190 L200 250" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
              <path d="M120 220 L80 260" stroke={theme.accentLight} strokeWidth="2" strokeLinecap="round" />
              <path d="M280 220 L320 260" stroke={theme.accentLight} strokeWidth="2" strokeLinecap="round" />
              <path d="M170 280 L230 280" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" />
              <text x="200" y="310" textAnchor="middle" fill={theme.muted} fontSize="12">CycleCare</text>
            </svg>
          </div>
        </div>

        {/* Values Section */}
        <div style={styles.valuesGrid}>
          <ValueCard 
            icon="💗" 
            title="Inclusivity" 
            desc="A safe space for everyone — menstruators, learners, and supporters alike." 
          />
          <ValueCard 
            icon="📚" 
            title="Education First" 
            desc="Breaking stigma through accurate, age-appropriate menstrual health education." 
          />
          <ValueCard 
            icon="🔮" 
            title="Smart Technology" 
            desc="Using machine learning for accurate cycle predictions and personalized insights." 
          />
        </div>

        {/* Story Section */}
        <div style={styles.storySection}>
          <h2 style={styles.storyTitle}>Why we started</h2>
          <p style={styles.storyText}>
            We noticed that menstrual health conversations were often filled with silence, stigma, and misinformation. 
            Many people lacked access to reliable information, and those who wanted to support them didn't know where to start. 
            So we built CycleCare — a platform that bridges the gap between knowledge and care, making period education and tracking 
            accessible to everyone, regardless of gender or age.
          </p>
        </div>

        {/* CTA Section */}
        <div style={styles.cta}>
          <h2 style={styles.ctaTitle}>Join our journey</h2>
          <p style={styles.ctaDesc}>Be part of a movement making menstrual health accessible for all.</p>
          <button style={styles.ctaButton} onClick={() => navigate("/signup")}>
            Get started →
          </button>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerLeft}>
            <img src={logo} alt="CycleCare" style={styles.footerLogo} />
            <span style={styles.footerText}>© 2025 CycleCare</span>
          </div>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink} onClick={() => navigate("/")}>Home</span>
            <span style={styles.footerLink} onClick={() => navigate("/contact")}>Contact</span>
            <span style={styles.footerLink} onClick={() => navigate("/privacy")}>Privacy</span>
            <span style={styles.footerLink} onClick={() => navigate("/terms")}>Terms</span>
          </div>
        </footer>
      </div>
    </div>
  );
}