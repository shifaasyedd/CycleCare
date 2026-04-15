import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Droplets, Activity, Leaf, Heart, ShoppingBag, Sparkles,
  FlaskConical, Moon, Sun, Coffee, Utensils, Smile, Frown,
  AlertCircle, CheckCircle, ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Shopping() {
    console.log("SHOPPING COMPONENT IS RENDERING");
    const [dark, setDark] = useState(localStorage.getItem("cyclecare_theme") === "dark");

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
            card: "rgba(25, 25, 35, 0.85)",
            border: "rgba(255, 105, 150, 0.3)",
            text: "#FDF2F8",
            muted: "rgba(253, 242, 248, 0.7)",
            accent: "#FF6B8B",
            gradientStart: "#FF6B8B",
            gradientEnd: "#FF8EAA",
            chip: "rgba(255, 255, 255, 0.08)",
          }
        : {
            bg: "#FFF9FB",
            card: "rgba(255, 245, 248, 0.95)",
            border: "rgba(229, 76, 111, 0.2)",
            text: "#2D1B23",
            muted: "rgba(45, 27, 35, 0.65)",
            accent: "#E54C6F",
            gradientStart: "#E54C6F",
            gradientEnd: "#FF8EAA",
            chip: "rgba(229, 76, 111, 0.08)",
          },
    [dark]
  );

  const openGoogleShopping = (query) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ---------- Product data (no numbering, just clean names) ----------
  const categories = [
    {
      icon: <Droplets size={20} />,
      name: "The Essentials: Hygiene & Protection",
      items: [
        { name: "Regular Day Pads", desc: "For medium flow – comfortable and secure.", query: "regular day sanitary pads" },
        { name: "Overnight Pads", desc: "Extra‑long with wings for leak‑free sleep.", query: "overnight sanitary pads with wings" },
        { name: "Panty Liners", desc: "For light days or backup protection.", query: "panty liners" },
        { name: "Light Tampons", desc: "Slim design for the beginning or end of your cycle.", query: "light absorbency tampons" },
        { name: "Super Tampons", desc: "For heavy flow days – reliable absorption.", query: "super tampons heavy flow" },
        { name: "Menstrual Cup", desc: "Reusable medical‑grade silicone, lasts up to 10 years.", query: "menstrual cup reusable" },
        { name: "Menstrual Disc", desc: "Flat‑fit protection; can be worn during intimacy.", query: "menstrual disc reusable" },
        { name: "Period Underwear", desc: "Absorbent, reusable briefs – no pad needed.", query: "period underwear absorbent" },
        { name: "Interlabial Pads", desc: "Small cloth pads for direct flow control.", query: "interlabial cloth pads" },
        { name: "Menstrual Cup Sterilizer", desc: "Steamer or dedicated pot for deep cleaning.", query: "menstrual cup steamer sterilizer" },
        { name: "Biodegradable Wipes", desc: "Stay fresh on the go – eco‑friendly.", query: "biodegradable feminine wipes" },
        { name: "Portable Bidet", desc: "Squeeze bottle for easy rinsing anywhere.", query: "portable bidet bottle" },
        { name: "Disposal Bags", desc: "Scented, opaque bags for discreet disposal.", query: "scented sanitary disposal bags" },
        { name: "Intimate pH‑Balanced Wash", desc: "Soap specifically for the vulva (external use).", query: "pH balanced feminine wash" },
        { name: "Stain Remover Pen", desc: "Emergency leak treatment for clothes.", query: "stain remover pen for clothes" },
      ]
    },
    {
      icon: <Activity size={20} />,
      name: "Pain Relief & Physical Health",
      items: [
        { name: "Electric Heating Pad", desc: "Deep abdominal heat for stubborn cramps.", query: "electric heating pad for cramps" },
        { name: "Microwavable Seed Sack", desc: "Natural, moist heat – often with lavender.", query: "microwavable heating pad flaxseed" },
        { name: "Adhesive Heat Patches", desc: "Discreet patches that stick to your clothes.", query: "adhesive heat patches for period pain" },
        { name: "Hot Water Bottle", desc: "The classic cozy remedy – cheap and effective.", query: "hot water bottle" },
        { name: "Ibuprofen/Naproxen", desc: "OTC pain relief (consult a doctor first).", query: "ibuprofen for period cramps" },
        { name: "TENS Machine", desc: "Small device that blocks pain signals.", query: "TENS unit for period cramps" },
        { name: "Epsom Salts", desc: "For a relaxing, muscle‑soothing bath.", query: "Epsom salt bath" },
        { name: "Magnesium Supplements", desc: "Helps reduce muscle tension and cramping.", query: "magnesium glycinate supplements" },
        { name: "Vitamin B6", desc: "Eases bloating and stabilises mood swings.", query: "vitamin B6 supplements" },
        { name: "Iron Supplements", desc: "Replaces iron lost during heavy flow.", query: "iron supplements" },
        { name: "Essential Oil Roller", desc: "Clary sage or lavender for aromatherapy relief.", query: "clary sage essential oil roller" },
        { name: "Peppermint Oil", desc: "Great for period‑related headaches.", query: "peppermint essential oil" },
        { name: "Ginger Chews", desc: "Settle a queasy stomach naturally.", query: "ginger chews candy" },
        { name: "Electrolyte Powder", desc: "Combat fatigue and dehydration.", query: "electrolyte powder hydration" },
        { name: "Omega‑3 Capsules", desc: "Reduces overall inflammation.", query: "fish oil omega 3 supplements" },
      ]
    },
    {
      icon: <Leaf size={20} />,
      name: "Nutrition & Cravings",
      items: [
        { name: "Dark Chocolate (70%+)", desc: "High in magnesium, mood‑boosting.", query: "dark chocolate 70 percent cocoa" },
        { name: "Raspberry Leaf Tea", desc: "Known as 'the uterine tonic'.", query: "raspberry leaf tea" },
        { name: "Chamomile Tea", desc: "For anxiety and better sleep.", query: "chamomile tea" },
        { name: "Peppermint Tea", desc: "Reduces bloating and gas.", query: "peppermint tea" },
        { name: "Ginger Tea", desc: "Anti‑inflammatory and nausea‑relieving.", query: "ginger tea bags" },
        { name: "Bananas", desc: "Potassium helps with water retention.", query: "bananas" },
        { name: "Pumpkin Seeds", desc: "Great source of zinc and iron.", query: "pumpkin seeds" },
        { name: "Dried Apricots", desc: "Quick, healthy iron boost.", query: "dried apricots" },
        { name: "Almonds/Walnuts", desc: "Healthy fats to balance hormones.", query: "almonds walnuts mix" },
        { name: "Whole Grain Crackers", desc: "Keeps digestion steady.", query: "whole grain crackers" },
        { name: "Nut Butter Packets", desc: "Easy, high‑protein energy.", query: "nut butter packets" },
        { name: "Fruit Infuser Bottle", desc: "Makes water more exciting.", query: "fruit infuser water bottle" },
        { name: "Healthy Soup Mix", desc: "Low‑effort meal for low‑energy days.", query: "healthy instant soup mix" },
        { name: "Honey", desc: "Natural sweetener for herbal teas.", query: "raw honey" },
        { name: "Gummy Vitamins", desc: "A fun way to stay on top of health.", query: "multivitamin gummies" },
      ]
    },
    {
      icon: <Moon size={20} />,
      name: "Comfort & Sleep",
      items: [
        { name: "Oversized Hoodie", desc: "Maximum comfort and hides bloating.", query: "oversized hoodie women" },
        { name: "High‑Waisted Leggings", desc: "Gentle compression for the belly.", query: "high waisted leggings" },
        { name: "Fuzzy Socks", desc: "Keeps feet warm and circulation moving.", query: "fuzzy warm socks" },
        { name: "Seamless Underwear", desc: "Prevents irritation and chafing.", query: "seamless underwear women" },
        { name: "Weighted Blanket", desc: "Helps with anxiety and sleep quality.", query: "weighted blanket" },
        { name: "Body Pillow", desc: "Find a comfortable side‑sleeping position.", query: "body pillow for side sleeping" },
        { name: "Dark Towel", desc: "Lay on the bed for 'leak‑anxiety' nights.", query: "dark colored towel" },
        { name: "Silk Pillowcase", desc: "Gentle on skin and hair during rest.", query: "silk pillowcase" },
        { name: "Loose Joggers", desc: "No‑pressure waistbands are a must.", query: "loose fit joggers women" },
        { name: "House Slippers", desc: "Cozy walking around the house.", query: "house slippers fuzzy" },
      ]
    },
    {
      icon: <ShoppingBag size={20} />,
      name: "Cute Gifts & Mental Health",
      items: [
        { name: "Plushie Heating Pad", desc: "Microwaveable stuffed animal for comfort.", query: "microwavable plush heating pad" },
        { name: "Cramp Socks", desc: "Funny socks like 'Bring Me Chocolate'.", query: "funny period socks" },
        { name: "Pimple Patches", desc: "For hormonal chin breakouts.", query: "hydrocolloid pimple patches" },
        { name: "Sheet Masks", desc: "Quick 'spa moment' at home.", query: "hydrating sheet face mask" },
        { name: "Symptom Tracker/Journal", desc: "Log your cycles – or use CycleCare!", query: "period tracker journal" },
        { name: "Aesthetic Water Bottle", desc: "With motivational time markers.", query: "aesthetic water bottle with time marker" },
        { name: "Silk Scrunchies", desc: "Keep hair up during self‑care.", query: "silk scrunchies" },
        { name: "Scented Candle", desc: "Create a relaxing atmosphere.", query: "soy scented candle" },
        { name: "Blind Bag/Surprise Toy", desc: "A small 'pick‑me‑up' gift.", query: "blind bag surprise toy" },
        { name: "Flowers", desc: "To create a good moment – treat yourself!", query: "fresh bouquet flowers" },
      ]
    }
  ];

  const hashString = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  };

  const getProductImage = (query) => {
    const keywords = query.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().split(/\s+/).join(",");
    const lock = hashString(query);
    return `https://loremflickr.com/400/300/${encodeURIComponent(keywords)}?lock=${lock}`;
  };

  const handleImgError = (e) => {
    e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(e.currentTarget.alt)}/400/300`;
    e.currentTarget.onerror = null;
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', sans-serif",
    },
    container: {
      maxWidth: 1400,
      margin: "0 auto",
      padding: "0 24px",
    },
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
    brand: { 
    display: "flex", 
    alignItems: "center", 
    gap: 12, 
    cursor: "pointer" 
    },
    logo: {
    height: 48,
    width: "auto",
    filter: dark ? "drop-shadow(0 4px 12px rgba(255,107,139,0.4))" : "none",
    },
    brandText: { 
    display: "flex", 
    flexDirection: "column" 
    },
    brandName: { 
    fontSize: 20, 
    fontWeight: 800, 
    letterSpacing: -0.3 
    },
    brandTagline: { 
    fontSize: 11, 
    color: theme.muted, 
    fontWeight: 500 
    },
    navLinks: { 
    display: "flex", 
    gap: 8, 
    alignItems: "center" 
    },
    navLink: {
    padding: "8px 16px",
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: theme.muted,
    transition: "all 0.2s ease",
    textDecoration: "none",
    ":hover": {
        color: theme.accent,
        background: theme.chip,
    }
    },
    navLinkActive: {
    color: theme.accent,
    background: theme.chip,
    },
    navActions: { 
    display: "flex", 
    alignItems: "center", 
    gap: 12 
    },
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
    transition: "all 0.2s",
    },
    hero: {
      textAlign: "center",
      marginBottom: 48,
    },
    title: { fontSize: 36, fontWeight: 800, marginBottom: 12 },
    subtitle: { fontSize: 16, color: theme.muted, maxWidth: 600, margin: "0 auto" },
    categorySection: {
      marginBottom: 56,
    },
    categoryTitle: {
      fontSize: 26,
      fontWeight: 700,
      marginBottom: 24,
      paddingBottom: 8,
      borderBottom: `2px solid ${theme.accent}`,
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 28,
    },
    productCard: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 24,
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      display: "flex",
      flexDirection: "column",
      boxShadow: dark ? "0 8px 20px rgba(0,0,0,0.2)" : "0 8px 20px rgba(0,0,0,0.05)",
    },
    productImage: {
      width: "100%",
      height: 180,
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    cardContent: {
      padding: "18px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    productName: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 8,
      letterSpacing: "-0.2px",
    },
    productDesc: {
      fontSize: 12,
      color: theme.muted,
      marginBottom: 16,
      lineHeight: 1.4,
    },
    shopBtn: {
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      border: "none",
      color: "white",
      padding: "10px 16px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "auto",
      width: "100%",
      transition: "opacity 0.2s, transform 0.1s",
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
    backLink: {
      color: theme.muted,
      textDecoration: "none",
      fontSize: 13,
    },
    "@media (max-width: 1024px)": {
      grid: { gridTemplateColumns: "repeat(2, 1fr)" },
      title: { fontSize: 30 },
    },
    "@media (max-width: 640px)": {
      grid: { gridTemplateColumns: "1fr" },
      title: { fontSize: 24 },
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Navbar />

        <div style={styles.hero}>
          <h1 style={styles.title}><ShoppingBag size={28} style={{ marginRight: 10 }} /> The Complete Period Care Shop</h1>
          <p style={styles.subtitle}>
            Click any product to find it on Google Shopping – safe, private, and convenient.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category.name} style={styles.categorySection}>
            <h2 style={styles.categoryTitle}>
              <span>{category.icon}</span> {category.name}
            </h2>
            <div style={styles.grid}>
              {category.items.map((item) => (
                <div
                  key={item.name}
                  style={styles.productCard}
                  onClick={() => openGoogleShopping(item.query)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = dark
                      ? "0 12px 28px rgba(0,0,0,0.3)"
                      : "0 12px 28px rgba(0,0,0,0.1)";
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = dark
                      ? "0 8px 20px rgba(0,0,0,0.2)"
                      : "0 8px 20px rgba(0,0,0,0.05)";
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={getProductImage(item.query)}
                    alt={item.name}
                    style={styles.productImage}
                    onError={handleImgError}
                  />
                  <div style={styles.cardContent}>
                    <div style={styles.productName}>{item.name}</div>
                    <div style={styles.productDesc}>{item.desc}</div>
                    <button style={styles.shopBtn}>Shop on Google →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <footer style={styles.footer}>
          <span style={{ fontSize: 10, color: theme.muted }}>© 2025 CycleCare • Shopping Guide</span>
          <Link to="/category" style={styles.backLink}>← Back to Categories</Link>
        </footer>
      </div>
    </div>
  );
}