import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Activity,
  Sparkles,
  Heart,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Droplet,
  LineChart,
  MessageCircle,
} from "lucide-react";
import logo from "../assets/cyclecare-logo.png";
import Navbar from "../components/Navbar";

export default function Home() {
  const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
      navigate("/category");
    }
  }, [navigate]);

  useEffect(() => {
    const handler = () => setDark(localStorage.getItem("cyclecare_theme") === "dark");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  // ---------- Theme: soft pink + rose palette to match the rest of the site ----------
  const theme = useMemo(
    () =>
      dark
        ? {
            bg: "#0A0A0F",
            bgSoft: "#15101A",
            card: "#19131C",
            cardElevated: "#22192A",
            border: "rgba(255, 105, 150, 0.25)",
            borderSoft: "rgba(255, 255, 255, 0.06)",
            text: "#FDF2F8",
            textMuted: "rgba(253, 242, 248, 0.65)",
            accent: "#FF6B8B",
            accentSoft: "#FF8EAA",
            accentChip: "rgba(255, 107, 139, 0.18)",
            accentBg: "rgba(255, 107, 139, 0.12)",
            shadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
            shadowSoft: "0 4px 16px rgba(0, 0, 0, 0.2)",
          }
        : {
            bg: "#FFF9FB",
            bgSoft: "#FFF0F5",
            card: "#FFFFFF",
            cardElevated: "#FFF5F8",
            border: "rgba(229, 76, 111, 0.2)",
            borderSoft: "rgba(45, 27, 35, 0.06)",
            text: "#2D1B23",
            textMuted: "rgba(45, 27, 35, 0.65)",
            accent: "#E54C6F",
            accentSoft: "#FB7185",
            accentChip: "rgba(229, 76, 111, 0.12)",
            accentBg: "#FFF0F5",
            shadow: "0 16px 48px rgba(229, 76, 111, 0.18)",
            shadowSoft: "0 4px 16px rgba(229, 76, 111, 0.10)",
          },
    [dark]
  );

  // ---------- Styles ----------
  const styles = {
    page: {
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily:
        "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: "antialiased",
    },
    container: { maxWidth: 1200, margin: "0 auto", padding: "0 32px" },

    // ---- Hero ----
    hero: {
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: 56,
      alignItems: "center",
      marginTop: 72,
      marginBottom: 96,
    },
    heroLeft: { display: "flex", flexDirection: "column" },
    heroBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 14px",
      borderRadius: 100,
      background: theme.accentChip,
      fontSize: 12,
      fontWeight: 600,
      color: theme.accent,
      width: "fit-content",
      marginBottom: 24,
    },
    heroTitle: {
      fontSize: 60,
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: -2,
      margin: "0 0 22px 0",
      color: theme.text,
    },
    heroAccent: { color: theme.accent, fontStyle: "italic", fontWeight: 600 },
    heroDesc: {
      fontSize: 16,
      lineHeight: 1.65,
      color: theme.textMuted,
      margin: "0 0 36px 0",
      maxWidth: 520,
      fontWeight: 400,
    },
    heroCtas: { display: "flex", gap: 14, alignItems: "center" },
    btnLargePrimary: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "16px 28px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: theme.accent,
      border: "none",
      color: "#FFFFFF",
      boxShadow: `0 12px 32px ${dark ? "rgba(229,76,111,0.4)" : "rgba(229,76,111,0.32)"}`,
      transition: "transform 0.2s",
    },
    btnLargeGhost: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "16px 28px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: "transparent",
      border: `1.5px solid ${theme.borderSoft}`,
      color: theme.text,
      transition: "all 0.2s",
    },

    // ---- Hero preview card (right side) ----
    heroPreview: {
      position: "relative",
      background: theme.card,
      borderRadius: 32,
      padding: 28,
      boxShadow: theme.shadow,
      border: `1px solid ${theme.borderSoft}`,
    },
    previewHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    previewDate: { fontSize: 11, color: theme.textMuted, fontWeight: 500 },
    previewTitle: { fontSize: 18, fontWeight: 700, color: theme.accent, marginTop: 2 },
    previewArrow: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: theme.accent,
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 },
    miniStat: {
      background: theme.cardElevated,
      borderRadius: 18,
      padding: "16px 12px",
      textAlign: "center",
      border: `1px solid ${theme.borderSoft}`,
    },
    miniStatHighlight: {
      background: theme.cardElevated,
      borderRadius: 18,
      padding: "16px 12px",
      textAlign: "center",
      border: `1.5px solid ${theme.accent}`,
    },
    miniStatIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: theme.accentChip,
      color: theme.accent,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    miniStatLabel: { fontSize: 10, color: theme.textMuted, fontWeight: 500, marginBottom: 2 },
    miniStatValue: { fontSize: 14, fontWeight: 700, color: theme.accent },
    chartCard: {
      background: theme.cardElevated,
      borderRadius: 20,
      padding: 18,
      border: `1px solid ${theme.borderSoft}`,
    },
    chartHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    chartTitle: { fontSize: 13, fontWeight: 700, color: theme.accent },
    chartTabs: { display: "flex", gap: 4 },
    chartTab: (active) => ({
      width: 22,
      height: 22,
      borderRadius: 100,
      fontSize: 10,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: active ? theme.accent : theme.accentChip,
      color: active ? "#FFFFFF" : theme.accent,
      cursor: "pointer",
    }),
    sparkline: {
      height: 70,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 4,
      padding: "0 4px",
    },
    sparkBar: (h) => ({
      flex: 1,
      height: `${h}%`,
      background: `linear-gradient(180deg, ${theme.accent}, ${theme.accentSoft})`,
      borderRadius: 4,
      minHeight: 4,
    }),
    chartFooter: { fontSize: 11, color: theme.textMuted, marginTop: 12 },
    chartFooterValue: { color: theme.accent, fontWeight: 700 },

    // ---- Section ----
    section: { marginBottom: 96 },
    sectionHeader: { textAlign: "center", marginBottom: 56 },
    sectionLabel: {
      display: "inline-block",
      padding: "5px 13px",
      borderRadius: 100,
      background: theme.accentChip,
      fontSize: 11,
      fontWeight: 600,
      color: theme.accent,
      marginBottom: 14,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    sectionTitle: {
      fontSize: 38,
      fontWeight: 700,
      letterSpacing: -1,
      margin: "0 0 14px 0",
      lineHeight: 1.15,
    },
    sectionDesc: { fontSize: 15, color: theme.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 },

    // ---- Features ----
    features: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
    featureCard: {
      background: theme.card,
      borderRadius: 28,
      padding: 32,
      border: `1px solid ${theme.borderSoft}`,
      boxShadow: theme.shadowSoft,
      transition: "transform 0.25s, box-shadow 0.25s",
      cursor: "default",
    },
    featureIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 18,
      background: theme.accentChip,
      color: theme.accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 22,
    },
    featureTitle: { fontSize: 20, fontWeight: 700, marginBottom: 10, color: theme.text },
    featureDesc: { fontSize: 14, color: theme.textMuted, lineHeight: 1.6 },

    // ---- Pillars row ----
    pillars: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 },
    pillar: {
      background: theme.card,
      borderRadius: 24,
      padding: 24,
      border: `1px solid ${theme.borderSoft}`,
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
    },
    pillarIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      background: theme.accentChip,
      color: theme.accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    pillarTitle: { fontSize: 14, fontWeight: 700, marginBottom: 4, color: theme.text },
    pillarDesc: { fontSize: 12, color: theme.textMuted, lineHeight: 1.5 },

    // ---- Quote ----
    quoteCard: {
      background: theme.card,
      borderRadius: 36,
      padding: "64px 56px",
      border: `1px solid ${theme.borderSoft}`,
      boxShadow: theme.shadowSoft,
      textAlign: "center",
    },
    quoteIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      background: theme.accentChip,
      color: theme.accent,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    quoteText: {
      fontSize: 22,
      fontWeight: 500,
      lineHeight: 1.5,
      maxWidth: 760,
      margin: "0 auto 20px",
      color: theme.text,
      letterSpacing: -0.3,
    },
    quoteAuthor: { fontSize: 12, color: theme.textMuted, fontWeight: 600, letterSpacing: 0.5 },

    // ---- CTA ----
    cta: {
      borderRadius: 36,
      padding: "60px 48px",
      background: `linear-gradient(135deg, ${theme.accent} 0%, #FB7185 100%)`,
      textAlign: "center",
      boxShadow: `0 24px 56px ${dark ? "rgba(229,76,111,0.3)" : "rgba(229,76,111,0.28)"}`,
      marginBottom: 80,
    },
    ctaTitle: {
      fontSize: 36,
      fontWeight: 700,
      color: "#FFFFFF",
      marginBottom: 14,
      letterSpacing: -1,
    },
    ctaDesc: {
      fontSize: 15,
      color: "rgba(255,255,255,0.92)",
      marginBottom: 32,
      maxWidth: 520,
      margin: "0 auto 32px",
      lineHeight: 1.6,
    },
    ctaButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "16px 32px",
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      background: "#FFFFFF",
      border: "none",
      color: theme.accent,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },

    // ---- Footer ----
    footer: {
      padding: "36px 0",
      borderTop: `1px solid ${theme.borderSoft}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 20,
    },
    footerLeft: { display: "flex", alignItems: "center", gap: 12 },
    footerLogo: { height: 28, width: "auto" },
    footerText: { fontSize: 12, color: theme.textMuted },
    footerLinks: { display: "flex", gap: 28 },
    footerLink: {
      fontSize: 12,
      color: theme.textMuted,
      cursor: "pointer",
      fontWeight: 500,
      background: "none",
      border: "none",
    },
  };

  // ---------- Sub-components ----------
  const FeatureCard = ({ Icon, title, desc }) => (
    <div
      style={styles.featureCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = theme.shadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = theme.shadowSoft;
      }}
    >
      <div style={styles.featureIconWrap}>
        <Icon size={26} strokeWidth={1.8} />
      </div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDesc}>{desc}</p>
    </div>
  );

  const Pillar = ({ Icon, title, desc }) => (
    <div style={styles.pillar}>
      <div style={styles.pillarIcon}>
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <div>
        <div style={styles.pillarTitle}>{title}</div>
        <div style={styles.pillarDesc}>{desc}</div>
      </div>
    </div>
  );

  // Sparkline data (decorative)
  const sparkData = [40, 55, 35, 70, 50, 85, 65, 90, 60, 75, 45, 80];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar active="Home" />

        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroBadge}>
              <Sparkles size={13} strokeWidth={2.2} />
              For Those Who Experience & Care
            </div>
            <h1 style={styles.heroTitle}>
              For those who experience
              <br />
              & <span style={styles.heroAccent}>care, understood.</span>
            </h1>
            <p style={styles.heroDesc}>
              A safe, respectful space for everyone — whether you're tracking,
              learning, or supporting someone. Personalized insights and education,
              tailored to you.
            </p>
            <div style={styles.heroCtas}>
              <button
                style={styles.btnLargePrimary}
                onClick={() => navigate("/signup")}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                Get Started
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>
              <button style={styles.btnLargeGhost} onClick={() => navigate("/about")}>
                Learn More
              </button>
            </div>
          </div>

          {/* Hero preview card */}
          <div style={styles.heroPreview}>
            <div style={styles.previewHeader}>
              <div>
                <div style={styles.previewDate}>Today, April 9</div>
                <div style={styles.previewTitle}>Cycle Overview</div>
              </div>
              <div style={styles.previewArrow}>
                <ArrowRight size={16} strokeWidth={2.2} />
              </div>
            </div>

            <div style={styles.statsRow}>
              <div style={styles.miniStat}>
                <div style={styles.miniStatIconWrap}>
                  <Droplet size={16} strokeWidth={2} />
                </div>
                <div style={styles.miniStatLabel}>Cycle Day</div>
                <div style={styles.miniStatValue}>14</div>
              </div>
              <div style={styles.miniStat}>
                <div style={styles.miniStatIconWrap}>
                  <Calendar size={16} strokeWidth={2} />
                </div>
                <div style={styles.miniStatLabel}>Next In</div>
                <div style={styles.miniStatValue}>13 d</div>
              </div>
              <div style={styles.miniStatHighlight}>
                <div style={styles.miniStatIconWrap}>
                  <Heart size={16} strokeWidth={2} />
                </div>
                <div style={styles.miniStatLabel}>Wellness</div>
                <div style={styles.miniStatValue}>92</div>
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <div style={styles.chartTitle}>Cycle Length</div>
                <div style={styles.chartTabs}>
                  <div style={styles.chartTab(true)}>D</div>
                  <div style={styles.chartTab(false)}>W</div>
                  <div style={styles.chartTab(false)}>M</div>
                  <div style={styles.chartTab(false)}>Y</div>
                </div>
              </div>
              <div style={styles.sparkline}>
                {sparkData.map((h, i) => (
                  <div key={i} style={styles.sparkBar(h)} />
                ))}
              </div>
              <div style={styles.chartFooter}>
                Average <span style={styles.chartFooterValue}>28 days</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>What we offer</span>
            <h2 style={styles.sectionTitle}>Built for understanding</h2>
            <p style={styles.sectionDesc}>
              Three thoughtful tools designed to make cycle care simple, respectful,
              and accessible to everyone.
            </p>
          </div>
          <div style={styles.features}>
            <FeatureCard
              Icon={BookOpen}
              title="Learn & Understand"
              desc="Age-appropriate education for every stage — from first period to cycle tracking."
            />
            <FeatureCard
              Icon={Activity}
              title="Track with Ease"
              desc="Simple logging tools to monitor your cycle, symptoms, and overall wellness."
            />
            <FeatureCard
              Icon={LineChart}
              title="Personalized Insights"
              desc="Get predictions and insights based on your unique cycle patterns."
            />
          </div>
        </section>

        {/* Pillars */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>Our principles</span>
            <h2 style={styles.sectionTitle}>Care that respects you</h2>
            <p style={styles.sectionDesc}>
              Every feature is built around four values that put people first.
            </p>
          </div>
          <div style={styles.pillars}>
            <Pillar
              Icon={ShieldCheck}
              title="Private by design"
              desc="Your data is yours. Always encrypted, never sold."
            />
            <Pillar
              Icon={Heart}
              title="Inclusive"
              desc="A safe space for menstruators, allies, and supporters."
            />
            <Pillar
              Icon={Calendar}
              title="Accurate"
              desc="Smart predictions that learn from your unique patterns."
            />
            <Pillar
              Icon={MessageCircle}
              title="Supportive"
              desc="AI guidance and resources whenever you need them."
            />
          </div>
        </section>

        {/* Quote */}
        <section style={styles.section}>
          <div style={styles.quoteCard}>
            <div style={styles.quoteIcon}>
              <Sparkles size={26} strokeWidth={1.8} />
            </div>
            <p style={styles.quoteText}>
              "Understanding our bodies shouldn't be complicated. CycleCare makes
              period education and tracking simple, respectful, and accessible
              for everyone — for those who experience and care."
            </p>
            <p style={styles.quoteAuthor}>— FOR THOSE WHO EXPERIENCE & CARE</p>
          </div>
        </section>

        {/* CTA */}
        <section style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to begin?</h2>
          <p style={styles.ctaDesc}>
            Sign up today and choose the path that's right for you.
          </p>
          <button style={styles.ctaButton} onClick={() => navigate("/signup")}>
            Create free account
            <ArrowRight size={16} strokeWidth={2.2} />
          </button>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerLeft}>
            <img src={logo} alt="CycleCare" style={styles.footerLogo} />
            <span style={styles.footerText}>© 2025 CycleCare • For Those Who Experience & Care</span>
          </div>
          <div style={styles.footerLinks}>
            <button style={styles.footerLink} onClick={() => navigate("/about")}>About</button>
            <button style={styles.footerLink} onClick={() => navigate("/contact")}>Contact</button>
            <button style={styles.footerLink} onClick={() => navigate("/terms")}>Terms</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
