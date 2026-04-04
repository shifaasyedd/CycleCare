import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

export default function Terms() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [lastUpdated] = useState("March 24, 2025");

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
    container: { maxWidth: 1000, margin: "0 auto", padding: "0 24px", flex: 1 },

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
      boxShadow: `0 8px 32px ${theme.shadow}`,
    },
    brand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logo: { height: 40, width: "auto" },
    brandName: { fontSize: 18, fontWeight: 700 },
    brandTagline: { fontSize: 10, color: theme.muted },
    navLinks: { display: "flex", gap: 6 },
    navLink: {
      padding: "6px 14px",
      borderRadius: 100,
      fontSize: 13,
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
      fontSize: 12,
    },

    hero: {
      marginTop: 40,
      marginBottom: 32,
      padding: 40,
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
      fontSize: 12,
      color: theme.accent,
      marginBottom: 16,
    },
    title: { fontSize: 40, fontWeight: 800, margin: "0 0 12px", letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: theme.muted, marginBottom: 8 },
    date: { fontSize: 12, color: theme.muted, marginTop: 8 },

    contentCard: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 28,
      padding: 40,
      marginBottom: 40,
    },
    section: {
      marginBottom: 32,
      paddingBottom: 24,
      borderBottom: `1px solid ${theme.border}`,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 700,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    sectionIcon: { fontSize: 28 },
    sectionText: {
      fontSize: 14,
      lineHeight: 1.7,
      color: theme.muted,
      marginBottom: 16,
    },
    subSection: {
      marginTop: 20,
      marginLeft: 20,
    },
    subTitle: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 10,
    },
    list: {
      marginTop: 12,
      paddingLeft: 24,
    },
    listItem: {
      marginBottom: 10,
      fontSize: 14,
      color: theme.muted,
      lineHeight: 1.6,
    },
    highlight: {
      color: theme.accent,
      fontWeight: 600,
    },

    footer: {
      padding: "24px 0",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16,
      marginTop: 20,
    },
    footerLinks: { display: "flex", gap: 24 },
    footerLink: { fontSize: 12, color: theme.muted, cursor: "pointer", textDecoration: "none" },

    "@media (max-width: 768px)": {
      hero: { padding: 24 },
      title: { fontSize: 28 },
      contentCard: { padding: 24 },
      sectionTitle: { fontSize: 18 },
      navLinks: { display: "none" },
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Navigation */}
        <nav style={styles.nav}>
          <div style={styles.brand} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={styles.logo} />
            <div>
              <div style={styles.brandName}>CycleCare</div>
              <div style={styles.brandTagline}>For Those Who Experience & Care</div>
            </div>
          </div>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/about" style={styles.navLink}>About</Link>
            <Link to="/contact" style={styles.navLink}>Contact</Link>
            <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Terms</span>
          </div>
          <div style={styles.themeToggle} onClick={() => setDark(v => !v)}>
            {dark ? "☀️" : "🌙"}
          </div>
        </nav>

        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.badge}>📜 Legal Agreement</span>
          <h1 style={styles.title}>Terms & Conditions</h1>
          <p style={styles.subtitle}>Welcome to CycleCare. Please read these terms carefully.</p>
          <p style={styles.date}>Last Updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div style={styles.contentCard}>
          {/* Section 1: Acceptance */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>✅</span>
              <span>Acceptance of Terms</span>
            </div>
            <p style={styles.sectionText}>
              By accessing or using CycleCare ("the App", "we", "us", "our"), you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, please do not use our services.
            </p>
            <p style={styles.sectionText}>
              CycleCare is a menstrual health platform designed for educational and tracking purposes. It is not a medical device 
              and should not replace professional medical advice, diagnosis, or treatment.
            </p>
          </div>

          {/* Section 2: User Accounts */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>👤</span>
              <span>User Accounts</span>
            </div>
            <p style={styles.sectionText}>
              To access certain features of CycleCare, you must create an account. You are responsible for maintaining the 
              confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <div style={styles.subSection}>
              <div style={styles.subTitle}>2.1 Account Types</div>
              <ul style={styles.list}>
                <li style={styles.listItem}><span className={styles.highlight}>Menstruators:</span> Users who track their menstrual cycles</li>
                <li style={styles.listItem}><span className={styles.highlight}>Non-Menstruators:</span> Users learning about menstrual health</li>
                <li style={styles.listItem}><span className={styles.highlight}>Supporters:</span> Users seeking to understand and support others</li>
              </ul>
            </div>
            <div style={styles.subSection}>
              <div style={styles.subTitle}>2.2 Account Deletion</div>
              <p style={styles.sectionText}>
                You may delete your account at any time through your profile settings. Upon deletion, all your data will be 
                permanently removed from our systems. This action is irreversible.
              </p>
            </div>
          </div>

          {/* Section 3: User Data & Privacy */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🔒</span>
              <span>User Data & Privacy</span>
            </div>
            <p style={styles.sectionText}>
              Your privacy is important to us. All personal data, including cycle tracking information, symptoms, and health logs, 
              is stored securely and is never shared with third parties without your explicit consent.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>✓ All data is stored locally on your device or encrypted in our database</li>
              <li style={styles.listItem}>✓ You have full control over your data and can export or delete it anytime</li>
              <li style={styles.listItem}>✓ We do not sell your personal information to advertisers or third parties</li>
              <li style={styles.listItem}>✓ Your cycle data is private and visible only to you</li>
            </ul>
          </div>

          {/* Section 4: Medical Disclaimer */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>⚠️</span>
              <span>Medical Disclaimer</span>
            </div>
            <p style={styles.sectionText}>
              <strong style={{ color: theme.accent }}>IMPORTANT: CycleCare is not a medical device and does not provide medical advice.</strong>
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>The information provided is for educational and tracking purposes only</li>
              <li style={styles.listItem}>Predictions and insights are estimates and may not be accurate for everyone</li>
              <li style={styles.listItem}>Always consult a qualified healthcare professional for medical concerns</li>
              <li style={styles.listItem}>Do not disregard professional medical advice based on information from this app</li>
              <li style={styles.listItem}>If you experience severe pain, heavy bleeding, or any concerning symptoms, seek medical help immediately</li>
            </ul>
          </div>

          {/* Section 5: User Responsibilities */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📋</span>
              <span>User Responsibilities</span>
            </div>
            <p style={styles.sectionText}>As a user of CycleCare, you agree to:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>✓ Provide accurate and truthful information when creating your account</li>
              <li style={styles.listItem}>✓ Maintain the security of your account credentials</li>
              <li style={styles.listItem}>✓ Not share your account with others</li>
              <li style={styles.listItem}>✓ Use the app responsibly and respectfully</li>
              <li style={styles.listItem}>✓ Not misuse the app for any harmful or unlawful purposes</li>
              <li style={styles.listItem}>✓ Not attempt to access other users' data</li>
            </ul>
          </div>

          {/* Section 6: Category Selection */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🎯</span>
              <span>Category Selection</span>
            </div>
            <p style={styles.sectionText}>
              When you sign up, you must choose a category based on your needs: Menstruators (Tracker), Non-Menstruators (Awareness), 
              or Supporters (Guide). This selection is permanent for your account.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>⚠️ Your category choice cannot be changed after selection</li>
              <li style={styles.listItem}>To change categories, you must delete your account and create a new one</li>
              <li style={styles.listItem}>This ensures that your data and experience remain consistent</li>
              <li style={styles.listItem}>Choose carefully based on your primary use of the app</li>
            </ul>
          </div>

          {/* Section 10: Contact Us */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📧</span>
              <span>Contact Us</span>
            </div>
            <p style={styles.sectionText}>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>📧 Email: shifa.syed@somaiya.edu</li>
              <li style={styles.listItem}>✍🏻 Visit:  <Link to="/contact" style={{ color: theme.accent }}>Contact Us</Link></li>
              </ul>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <span style={{ fontSize: 11, color: theme.muted }}>© 2025 CycleCare • For Those Who Experience & Care</span>
          <div style={styles.footerLinks}>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/about" style={styles.footerLink}>About</Link>
            <Link to="/contact" style={styles.footerLink}>Contact</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}