import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, Droplets, Activity, Calendar, Lightbulb, MessageCircle,
  ShoppingBag, AlertCircle, Sparkles, Users, ArrowRight,
  Handshake, Sparkle, User
} from "lucide-react";
import logo from "../assets/cyclecare-logo.png";
import Navbar from "../components/Navbar";

const GirlIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M12 12v2"/>
    <path d="M8 22c-2-2-2-5 0-7 1-1 2-2 4-2s3 1 4 2c2 2 2 5 0 7"/>
    <path d="M8 16c0 2-1 4-2 5"/>
    <path d="M16 16c0 2 1 4 2 5"/>
  </svg>
);

export default function Category() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("cyclecare_token");
      if (!token) return;
      
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.user?.role) {
          localStorage.setItem("cyclecare_role", data.user.role);
          setSelectedRole(data.user.role);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
    
    loadUserData();
    
    const userData = localStorage.getItem("cyclecare_user");
    if (userData) setUser(JSON.parse(userData));
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

  const getRoleName = (role) => {
    if (role === "men") return "Men (Support Guide)";
    if (role === "girls") return "Non-Menstruators (Awareness)";
    if (role === "women") return "Menstruators (Tracker)";
    return "Unknown";
  };

  // eslint-disable-next-line no-unused-vars
  const getRoleIcon = (role) => {
    if (role === "men") return "Male";
    if (role === "girls") return "Female";
    if (role === "women") return "Female";
    return "?";
  };

  const choose = async (role) => {
    const existingRole = localStorage.getItem("cyclecare_role");
    
    if (existingRole && existingRole !== role) {
      const confirmChange = window.confirm(
        `⚠️ IMPORTANT: You have already chosen "${getRoleName(existingRole)}" as your category.\n\n` +
        `Changing your category will require you to DELETE your account and sign up with a new email address.\n\n` +
        `Are you sure you want to proceed? This will log you out.`
      );
      
      if (confirmChange) {
        localStorage.removeItem("cyclecare_role");
        localStorage.removeItem("cyclecare_user");
        localStorage.removeItem("cyclecare_logged_in");
        localStorage.removeItem("cyclecare_cycles_v2");
        localStorage.removeItem("cyclecare_daily_logs");
        localStorage.removeItem("cyclecare_medications");
        localStorage.removeItem("cyclecare_visits");
        localStorage.removeItem("pcos_cycles");
        localStorage.removeItem("pcos_daily");
        localStorage.removeItem("pcos_medications");
        localStorage.removeItem("pcos_visits");
        
        alert(`Your account has been deleted. Please sign up again with a new email address to choose "${getRoleName(role)}".`);
        navigate("/signup");
      }
      return;
    }
    
    if (existingRole && existingRole === role) {
      if (role === "women") navigate("/tracker");
      else if (role === "girls") navigate("/girls-awareness");
      else if (role === "men") navigate("/men-support");
      return;
    }
    
    const confirmSelection = window.confirm(
      `You are about to choose "${getRoleName(role)}" as your category.\n\n` +
      `⚠️ IMPORTANT: This choice is PERMANENT for this account.\n\n` +
      `If you want to change this later, you will need to delete your account and sign up with a new email address.\n\n` +
      `Are you sure you want to proceed?`
    );
    
    if (confirmSelection) {
      localStorage.setItem("cyclecare_role", role);
      setSelectedRole(role);
      
      // Save role to database and wait
      const token = localStorage.getItem("cyclecare_token");
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      if (token) {
        try {
          const response = await fetch(`${apiUrl}/api/auth/role`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role })
          });
          const data = await response.json();
          console.log("Role save response:", data);
          if (data.success && data.user?.role) {
            console.log("✓ Role saved to database:", data.user.role);
            alert(`✅ Role saved as "${data.user.role}"!`);
          } else {
            console.log("Save failed or returned:", data);
          }
        } catch (err) {
          console.error("Error saving role:", err);
        }
      }
      
      alert(`✅ You have successfully chosen "${getRoleName(role)}"!`);
      
      if (role === "women") navigate("/tracker");
      else if (role === "girls") navigate("/girls-awareness");
      else if (role === "men") navigate("/men-support");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleReset = () => {
    const existingRole = localStorage.getItem("cyclecare_role");
    if (existingRole) {
      const confirmReset = window.confirm(
        `⚠️ WARNING: You have already chosen "${getRoleName(existingRole)}".\n\n` +
        `Resetting will delete ALL your data and require you to sign up again with a new email address.\n\n` +
        `Are you absolutely sure?`
      );
      
      if (confirmReset) {
        localStorage.removeItem("cyclecare_role");
        localStorage.removeItem("cyclecare_user");
        localStorage.removeItem("cyclecare_logged_in");
        localStorage.removeItem("cyclecare_cycles_v2");
        localStorage.removeItem("cyclecare_daily_logs");
        localStorage.removeItem("cyclecare_medications");
        localStorage.removeItem("cyclecare_visits");
        localStorage.removeItem("pcos_cycles");
        localStorage.removeItem("pcos_daily");
        localStorage.removeItem("pcos_medications");
        localStorage.removeItem("pcos_visits");
        
        alert(`Your account has been deleted. Please sign up again with a new email address to choose a different category.`);
        navigate("/signup");
      }
    } else {
      alert("No category selected yet. Please choose one above.");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("cyclecare_logged_in");
      navigate("/login");
    }
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

    hero: {
      marginTop: 60,
      marginBottom: 48,
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
      margin: "0 auto 32px",
      maxWidth: 650,
    },
    buttonRow: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      flexWrap: "wrap",
    },
    btnOutline: {
      padding: "10px 24px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.text,
      transition: "all 0.2s",
    },
    btnPrimary: {
      padding: "10px 28px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      boxShadow: `0 4px 14px ${theme.glow}`,
      transition: "transform 0.2s",
    },

    warningBanner: {
      marginBottom: 24,
      padding: "16px 20px",
      borderRadius: 16,
      background: selectedRole ? theme.accent + "20" : theme.chip,
      border: `1px solid ${selectedRole ? theme.accent : theme.border}`,
      textAlign: "center",
    },
    warningText: {
      fontSize: 14,
      fontWeight: 500,
      color: selectedRole ? theme.accent : theme.muted,
    },
    warningHighlight: {
      fontWeight: 700,
      color: theme.accent,
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 32,
      marginBottom: 80,
    },
    card: {
      borderRadius: 32,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      padding: 32,
      cursor: "pointer",
      transition: "all 0.3s ease",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      opacity: selectedRole ? 0.7 : 1,
      pointerEvents: selectedRole ? "none" : "auto",
    },
    cardGlow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: `linear-gradient(90deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      transform: "scaleX(0)",
      transition: "transform 0.3s ease",
    },
    iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
      boxShadow: `0 8px 20px ${theme.glow}`,
    },
    cardTitle: { fontSize: 28, fontWeight: 700, marginBottom: 12 },
    cardDesc: { fontSize: 14, color: theme.muted, lineHeight: 1.6, marginBottom: 20 },
    cardButton: {
      display: "inline-block",
      padding: "8px 20px",
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 600,
      background: theme.chip,
      border: `1px solid ${theme.border}`,
      color: theme.accent,
      transition: "all 0.2s",
    },
    selectedBadge: {
      position: "absolute",
      top: 16,
      right: 16,
      background: theme.accent,
      color: "white",
      padding: "4px 12px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
    },

    featuresSection: {
      marginBottom: 80,
      padding: "48px 40px",
      borderRadius: 48,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: "blur(8px)",
      textAlign: "center",
    },
    featuresTitle: { fontSize: 28, fontWeight: 700, marginBottom: 16 },
    featuresDesc: { fontSize: 14, color: theme.muted, marginBottom: 32 },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24,
    },
    featureItem: { textAlign: "center" },
    featureIcon: { fontSize: 32, marginBottom: 12 },
    featureName: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
    featureDetail: { fontSize: 12, color: theme.muted },

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
    footerLink: { fontSize: 13, color: theme.muted, cursor: "pointer", textDecoration: "none" },

    "@media (max-width: 1024px)": {
      grid: { gridTemplateColumns: "1fr", gap: 24 },
      featuresGrid: { gridTemplateColumns: "1fr", gap: 20 },
      title: { fontSize: 36 },
    },
    "@media (max-width: 640px)": {
      title: { fontSize: 32 },
      footer: { flexDirection: "column", textAlign: "center" },
      footerLinks: { justifyContent: "center" },
      featuresSection: { padding: "32px 24px" },
    },
  };

  const CategoryCard = ({ icon, title, desc, role }) => {
    const isHovered = hoveredCard === role;
    const isSelected = selectedRole === role;
    
    return (
      <div
        style={{
          ...styles.card,
          transform: isHovered && !selectedRole ? "translateY(-8px)" : "translateY(0)",
          boxShadow: isHovered && !selectedRole ? `0 20px 40px ${theme.shadow}` : "none",
          opacity: selectedRole && !isSelected ? 0.5 : 1,
          pointerEvents: selectedRole && !isSelected ? "none" : "auto",
        }}
        onClick={() => choose(role)}
        onMouseEnter={() => setHoveredCard(role)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div style={{ ...styles.cardGlow, transform: isHovered && !selectedRole ? "scaleX(1)" : "scaleX(0)" }} />
        {isSelected && (
          <div style={styles.selectedBadge}>
            ✓ Selected
          </div>
        )}
        <div style={styles.iconWrapper}>{React.isValidElement(icon) ? icon : <span style={{ color: "white", fontSize: 40 }}>{icon}</span>}</div>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDesc}>{desc}</p>
        <span style={styles.cardButton}>
          {isSelected ? "Your Path ✓" : "Choose this path →"}
        </span>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar active="Categories" />

        {/* Hero Section */}
        <div style={styles.hero}>
          <span style={styles.badge}><Sparkles size={14} style={{ marginRight: 6 }} /> Welcome to CycleCare</span>
          <h1 style={styles.title}>
            Who are you using
            <br />
            <span style={styles.highlight}>CycleCare for?</span>
          </h1>
          <p style={styles.description}>
            CycleCare is for everyone — whether you menstruate, are about to start, or want to understand and support.
          </p>
        </div>

        {/* Warning Banner */}
        {selectedRole && (
          <div style={styles.warningBanner}>
            <div style={styles.warningText}>
              <AlertCircle size={14} style={{ marginRight: 6 }} /> <span style={styles.warningHighlight}>Your category is set to "{getRoleName(selectedRole)}"</span>
              <br />
              This choice is permanent. To change, you must delete your account and sign up with a new email.
            </div>
          </div>
        )}

        {/* Category Cards */}
        <div style={styles.grid}>
          <CategoryCard
            icon={<Handshake size={36} color="white" />}
            title="Men"
            desc="Learn what the menstrual cycle is, why phases happen, and how to support menstruators with respect and understanding."
            role="men"
          />
          <CategoryCard
            icon={<GirlIcon size={36} color="white" />}
            title="Non-Menstruators"
            desc="Awareness-first learning for young girls who haven't started menstruating yet. Simple explanations, myths vs facts, and confidence-building information to prepare you for what's ahead."
            role="girls"
          />
          <CategoryCard
            icon={<Droplets size={36} color="white" />}
            title="Menstruators"
            desc="For girls and women who menstruate. Track your periods, see cycle phases on calendar, log symptoms, and get accurate predictions based on your unique cycle."
            role="women"
          />
        </div>

        {/* Features Section */}
        <div style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>What you'll get</h2>
          <p style={styles.featuresDesc}>Each path is tailored to your needs</p>
          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🕮</div>
              <div style={styles.featureName}>Age-appropriate content</div>
              <div style={styles.featureDetail}>Information tailored to your journey</div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><Activity size={20} color={theme.accent} /></div>
              <div style={styles.featureName}>Easy tracking tools</div>
              <div style={styles.featureDetail}>Simple logging and calendar views for menstruators</div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}><Sparkles size={20} color={theme.accent} /></div>
              <div style={styles.featureName}>Smart predictions</div>
              <div style={styles.featureDetail}>Accurate period and cycle estimates</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerLeft}>
            <img src={logo} alt="CycleCare" style={styles.footerLogo} />
            <span style={styles.footerText}>© 2025 CycleCare • For Those Who Experience & Care</span>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/about" style={styles.footerLink}>About</Link>
            <Link to="/contact" style={styles.footerLink}>Contact</Link>
            <Link to="/profile" style={styles.footerLink}>Profile</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}