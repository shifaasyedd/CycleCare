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

const productImages = {
    // Sanitary Pads
    "Regular Day Pads": "https://images.unsplash.com/photo-1596755769461-05684b7ad4e2?w=400&h=300&fit=crop",
    "Overnight Pads": "https://images.unsplash.com/photo-1551232864-3e48980c7228?w=400&h=300&fit=crop",
    "Panty Liners": "https://images.unsplash.com/photo-1595436065986-6067ee587b6e?w=400&h=300&fit=crop",
    // Tampons
    "Light Tampons": "https://images.unsplash.com/photo-1519494026892-80bbd2fa6b44?w=400&h=300&fit=crop",
    "Super Tampons": "https://images.unsplash.com/photo-1606813907291-d1f30c5b07e7?w=400&h=300&fit=crop",
    // Menstrual Products
    "Menstrual Cup": "https://images.unsplash.com/photo-1544782896-8372d5c4f76d?w=400&h=300&fit=crop",
    "Menstrual Disc": "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=400&h=300&fit=crop",
    "Period Underwear": "https://images.unsplash.com/photo-1556906782-2643f9c1e10a?w=400&h=300&fit=crop",
    // Heating
    "Electric Heating Pad": "https://images.unsplash.com/photo-1538102902303582065-wJi2tNqJ4w4?w=400&h=300&fit=crop",
    "Microwavable Seed Sack": "https://images.unsplash.com/photo-1544161515-4ab46ce0cc62?w=400&h=300&fit=crop",
    "Hot Water Bottle": "https://images.unsplash.com/photo-1605656960541-95347a9cc6f6?w=400&h=300&fit=crop",
    "Adhesive Heat Patches": "https://images.unsplash.com/photo-1558618666-f447d1e7b3d7?w=400&h=300&fit=crop",
    // Pain Relief
    "Ibuprofen": "https://images.unsplash.com/photo-1554860514-4e054949ab29?w=400&h=300&fit=crop",
    "TENS Machine": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    "Ginger Chews": "https://images.unsplash.com/photo-1582169664915-4b5f7f94a5ae?w=400&h=300&fit=crop",
    // Supplements
    "Magnesium Supplements": "https://images.unsplash.com/photo-1550590392-cbf8a2f51fb1?w=400&h=300&fit=crop",
    "Vitamin B6": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    "Iron Supplements": "https://images.unsplash.com/photo-1553356084-58ede8e8a2d7?w=400&h=300&fit=crop",
    "Omega‑3 Capsules": "https://images.unsplash.com/photo-1550590396-01c6c2cdd1da?w=400&h=300&fit=crop",
    "Electrolyte Powder": "https://images.unsplash.com/photo-1584468664466-efd323d57e39?w=400&h=300&fit=crop",
    // Essential Oils
    "Essential Oil Roller": "https://images.unsplash.com/photo-1608579638275-d2e8c54e8f1c?w=400&h=300&fit=crop",
    "Peppermint Oil": "https://images.unsplash.com/photo-1606005832452-cf770b2d7ad6?w=400&h=300&fit=crop",
    // Foods
    "Dark Chocolate": "https://images.unsplash.com/photo-1606312604171-950c1d06a977?w=400&h=300&fit=crop",
    "Raspberry Leaf Tea": "https://images.unsplash.com/photo-1556679343-c1befa5a3fbb?w=400&h=300&fit=crop",
    "Chamomile Tea": "https://images.unsplash.com/photo-1571504388575-9e62a302fb21?w=400&h=300&fit=crop",
    "Peppermint Tea": "https://images.unsplash.com/photo-1597314461396-1d3c9ee3b403?w=400&h=300&fit=crop",
    "Ginger Tea": "https://images.unsplash.com/photo-1513477892291-60b39ddc6fd8?w=400&h=300&fit=crop",
    "Bananas": "https://images.unsplash.com/photo-1607623814075-fc4b3e8faf1e?w=400&h=300&fit=crop",
    "Pumpkin Seeds": "https://images.unsplash.com/photo-1588613319737-26fc41ec8d27?w=400&h=300&fit=crop",
    "Dried Apricots": "https://images.unsplash.com/photo-1563636619-e9143da1913f?w=400&h=300&fit=crop",
    "Almonds": "https://images.unsplash.com/photo-1589995288056-1cac7c8a64a9?w=400&h=300&fit=crop",
    "Honey": "https://images.unsplash.com/photo-1587049352846-4a222e784a38?w=400&h=300&fit=crop",
    // Clothing
    "Oversized Hoodie": "https://images.unsplash.com/photo-1556905055-eab7c57a5ee0?w=400&h=300&fit=crop",
    "High‑Waisted Leggings": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=300&fit=crop",
    "Fuzzy Socks": "https://images.unsplash.com/photo-1576568008026-8a4c65224979?w=400&h=300&fit=crop",
    "Seamless Underwear": "https://images.unsplash.com/photo-1552902875-7e4c5c5c5c5c?w=400&h=300&fit=crop",
    "Loose Joggers": "https://images.unsplash.com/photo-1556906782-2643f9c1e10a?w=400&h=300&fit=crop",
    "House Slippers": "https://images.unsplash.com/photo-1526862156108-8328ef35a03c?w=400&h=300&fit=crop",
    // Bedding
    "Weighted Blanket": "https://images.unsplash.com/photo-1544452535-0238c4de6f76?w=400&h=300&fit=crop",
    "Body Pillow": "https://images.unsplash.com/photo-1586350977773-b7b4b4d64e8f?w=400&h=300&fit=crop",
    "Silk Pillowcase": "https://images.unsplash.com/photo-1584545487008-48e8c7285457?w=400&h=300&fit=crop",
    "Dark Towel": "https://images.unsplash.com/photo-1584005527749-0e1a18ce817e?w=400&h=300&fit=crop",
    // Self Care
    "Plushie Heating Pad": "https://images.unsplash.com/photo-1518981340509-26516c8c727c?w=400&h=300&fit=crop",
    "Cramp Socks": "https://images.unsplash.com/photo-1576568008026-8a4c65224979?w=400&h=300&fit=crop",
    "Pimple Patches": "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=300&fit=crop",
    "Sheet Masks": "https://images.unsplash.com/photo-1576421453121-89cc1fc16bf0?w=400&h=300&fit=crop",
    "Aesthetic Water Bottle": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    "Scented Candle": "https://images.unsplash.com/photo-1603008201339-c9be2fb0e1f2?w=400&h=300&fit=crop",
    "Flowers": "https://images.unsplash.com/photo-1490750967868-85c8b12fc7d5?w=400&h=300&fit=crop",
    // Hygiene
    "Menstrual Cup Sterilizer": "https://images.unsplash.com/photo-1605656960541-95347a9cc6f6?w=400&h=300&fit=crop",
    "Biodegradable Wipes": "https://images.unsplash.com/photo-1556228720-1957be83d2ba?w=400&h=300&fit=crop",
    "Portable Bidet": "https://images.unsplash.com/photo-1585314062340-f1a5a7ea932?w=400&h=300&fit=crop",
    "Intimate pH‑Balanced Wash": "https://images.unsplash.com/photo-1556228578-8f2d8a5a44c7?w=400&h=300&fit=crop",
    "Stain Remover Pen": "https://images.unsplash.com/photo-1552873519-16da1a75d33f?w=400&h=300&fit=crop",
    "Disposal Bags": "https://images.unsplash.com/photo-1556228578-8f2d8a5a44c7?w=400&h=300&fit=crop",
    // Bath
    "Epsom Salts": "https://images.unsplash.com/photo-1620916566398-39f5333b8f51?w=400&h=300&fit=crop",
  };

  const getProductImage = (itemName) => {
    if (productImages[itemName]) return productImages[itemName];
    // Fallback based on keyword
    const s = itemName.toLowerCase();
    if (s.includes("pad") || s.includes("liner")) return productImages["Regular Day Pads"];
    if (s.includes("tampon")) return productImages["Light Tampons"];
    if (s.includes("cup") || s.includes("disc")) return productImages["Menstrual Cup"];
    if (s.includes("heating") || s.includes("hot water")) return productImages["Electric Heating Pad"];
    if (s.includes("chocolate")) return productImages["Dark Chocolate"];
    if (s.includes("tea")) return productImages["Chamomile Tea"];
    if (s.includes("banana")) return productImages["Bananas"];
    if (s.includes("almond") || s.includes("seed") || s.includes("nut")) return productImages["Almonds"];
    if (s.includes("hoodie") || s.includes("cloth")) return productImages["Oversized Hoodie"];
    if (s.includes("sock")) return productImages["Fuzzy Socks"];
    if (s.includes("blanket") || s.includes("pillow")) return productImages["Weighted Blanket"];
    if (s.includes("candle")) return productImages["Scented Candle"];
    if (s.includes("flower")) return productImages["Flowers"];
    if (s.includes("bottle") || s.includes("water")) return productImages["Aesthetic Water Bottle"];
    if (s.includes("mask")) return productImages["Sheet Masks"];
    if (s.includes("oil") || s.includes("essential")) return productImages["Essential Oil Roller"];
    if (s.includes("vitamin") || s.includes("supplement")) return productImages["Magnesium Supplements"];
    if (s.includes("ibuprofen") || s.includes("pain")) return productImages["Ibuprofen"];
    if (s.includes("ginger")) return productImages["Ginger Chews"];
    return "https://images.unsplash.com/photo-1556906782-2643f9c1e10a?w=400&h=300&fit=crop";
  };

  // Map of common product keywords to Unsplash photo IDs
  const unsplashIds = {
    "pads": "1596755769461-05684b7ad4e2",
    "tampon": "1626624369442-cd7af6081619",
    "heating pad": "1538102902303582065-wJi2tNqJ4w4",
    "hot water bottle": "1605656960541-95347a9cc6f6",
    "chocolate": "1606312604171-950c1d06a977",
    "tea": "1556679343-c1befa5a3fbb",
    "banana": "1607623814075-fc4b3e8faf1e",
    "almond": "1589995288056-1cac7c8a64a9",
    "hoodie": "1556905055-eab7c57a5ee0",
    "socks": "1576568008026-8a4c65224979",
    "blanket": "1544452535-0238c4de6f76",
    "pillowcase": "1584545487008-48e8c7285457",
    "candle": "1603008201339-c9be2fb0e1f2",
    "flowers": "1490750967868-85c8b12fc7d5",
    "water bottle": "1602143407151-7111542de6e8",
    "facemask": "1576421453121-89cc1fc16bf0",
    "essential oil": "1608579638275-d2e8c54e8f1c",
    "ibuprofen": "1554860514-4e054949ab29",
    "electrolyte": "1584468664466-efd323d57e39",
    "omega": "1550590396-01c6c2cdd1da",
    "menstrual cup": "1613771337727-1c1edc1106e3",
    "panty liner": "1584515931498-94d4de4f92fc",
  };

  const getUnsplashId = (query) => {
    const q = query.toLowerCase();
    for (const [key, id] of Object.entries(unsplashIds)) {
      if (q.includes(key)) return id;
    }
    return "1596755769461-05684b7ad4e2";
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
                    src={getProductImage(item.name)}
                    alt={item.name}
                    style={styles.productImage}
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