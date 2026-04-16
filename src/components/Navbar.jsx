import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/cyclecare-logo.png";

export default function Navbar({ active }) {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("cyclecare_token"));

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", checkToken);
    window.addEventListener("authchange", checkToken);
    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("authchange", checkToken);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cyclecare_theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("cyclecare_theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
  };

  // Listen for theme changes from other components
  useEffect(() => {
    const handler = () => {
      const saved = localStorage.getItem("cyclecare_theme");
      setDark(saved === "dark");
    };
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const t = useMemo(
    () => dark ? {
    bg: "#0A0A0F",
    border: "rgba(255, 105, 150, 0.15)",
    text: "#F1EEF6",
    textSecondary: "rgba(241, 238, 246, 0.6)",
    accent: "#FF6B8B",
    accentSoft: "rgba(255, 107, 139, 0.12)",
    toggle: "rgba(255,255,255,0.06)",
  } : {
    bg: "#FFFFFF",
    border: "rgba(229, 76, 111, 0.12)",
    text: "#1A1225",
    textSecondary: "rgba(26, 18, 37, 0.6)",
    accent: "#E54C6F",
    accentSoft: "rgba(229, 76, 111, 0.08)",
    toggle: "rgba(0,0,0,0.04)",
  },
  [dark]);

  const isLoggedIn = token;

  const role = localStorage.getItem("cyclecare_role");
  const isMenOrGirls = role === "men" || role === "girls";
  const isMenstrutors = role === "menstrutors" || role === "women";

  const links = isLoggedIn
    ? isMenOrGirls
      ? [
          { to: "/", label: "Home" },
          { to: "/category", label: "Category" },
          { to: "/forum", label: "Forum" },
          { to: "/profile", label: "Profile" },
        ]
      : isMenstrutors
      ? [
          { to: "/", label: "Home" },
          { to: "/category", label: "Category" },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/tracker", label: "Tracker" },
          { to: "/pcos-tracker", label: "PCOS/PCOD" },
          { to: "/forum", label: "Forum" },
          { to: "/profile", label: "Profile" },
        ]
      : [
          { to: "/", label: "Home" },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/tracker", label: "Tracker" },
          { to: "/pcos-tracker", label: "PCOS/PCOD" },
          { to: "/forum", label: "Forum" },
          { to: "/profile", label: "Profile" },
        ]
    : [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact Us" },
        { to: "/terms", label: "Terms" },
      ];

  const authLinks = isLoggedIn
    ? [
        { to: "/profile", label: "Logout" },
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/signup", label: "Signup" },
      ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: t.bg,
      borderBottom: `1px solid ${t.border}`, padding: "0 32px",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src={logo} alt="CycleCare" style={{ height: 28 }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>CycleCare</span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {links.map(l => {
              const isActive = active === l.label;
              return (
                <Link key={l.to} to={l.to} style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: isActive ? 600 : 500,
                  color: isActive ? t.accent : t.textSecondary,
                  background: isActive ? t.accentSoft : "transparent",
                }}>{l.label}</Link>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {authLinks.map(l => (
              <span
                key={l.to}
                onClick={() => {
                  if (l.label === "Logout") {
                    localStorage.removeItem("token");
                    navigate("/login");
                  } else {
                    navigate(l.to);
                  }
                }}
                style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 500,
                  color: t.accent,
                  cursor: "pointer",
                }}
              >{l.label}</span>
            ))}
          </div>
          <div style={{
            padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13,
            background: t.toggle, border: `1px solid ${t.border}`, color: t.text,
          }} onClick={toggleTheme}>
            {dark ? "Light" : "Dark"}
          </div>
        </div>
      </div>
    </nav>
  );
}
