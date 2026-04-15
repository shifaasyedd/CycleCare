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
    "regular day sanitary pads": "https://d2xfs8lg0s24uu.cloudfront.net/cdn/scdn/images/uploads/6485b_care-_-protect_14-ultra-pads-regular-x12_render-(1).png",
    "overnight sanitary pads with wings": "https://i5.walmartimages.com/seo/Always-Maxi-Overnight-Pads-with-Wings-Size-5-Extra-Heavy-Overnight-Unscented-20-Count_15fbfbf6-aed2-4a31-88ba-7de35d00a730.42b2ee44c1e072bdc96b6678889f6efd.jpeg",
    "panty liners": "https://laz-img-sg.alicdn.com/p/fbde3827334c5e097554f1fa2232468f.png",
    "light absorbency tampons": "https://storage.googleapis.com/images-bks-prd-1385851.bks.prd.v8.commerce.mi9cloud.com/product-images/zoom/c5a1c5be-78ad-4c2e-9fa1-3fa3999ac691.jpeg",
    "super tampons heavy flow": "https://mexmax.com/cdn/shop/files/181053_grande.webp?v=1696099276",
    "menstrual cup reusable": "https://i5.walmartimages.com/seo/Multicolor-Soft-Menstrual-Cup-Silicone-Feminine-Hygiene-Period-Cup-Reusable-Cup_3164ae7e-a48c-4f05-8009-19f2e288e0df.3bd4cd57dcea5562cba58d31356fe2f2.jpeg",
    "menstrual disc reusable": "https://m.media-amazon.com/images/I/71keUMd5ZKL._AC_.jpg",
    "period underwear absorbent": "https://senziwash.com/wp-content/uploads/2023/06/Period-Panties-01-3.jpg",
    "interlabial cloth pads": "https://lilhelperusa.com/cdn/shop/files/InterlabialPadsNT9A0476_1280x1280.jpg?v=1739834433",
    "menstrual cup steamer sterilizer": "https://senzicare.com/wp-content/uploads/2024/08/cupsterilizercupwash-03-scaled.jpg",
    "biodegradable feminine wipes": "https://cdn4.volusion.store/fuzcd-wxecg/v/vspfiles/photos/FEM002-2.jpg?v-cache=1643865380",
    "portable bidet bottle": "https://i5.walmartimages.com/asr/e62021b6-89b1-4ed6-ba14-842296e3fdb0.6f8debc77ace1d9332878983d22e3a22.jpeg",
    "scented sanitary disposal bags": "https://m.media-amazon.com/images/I/51uSzuLKdFL._AC_.jpg",
    "pH balanced feminine wash": "https://www.online4pharmacy.com/media/catalog/product/v/a/vagisil_feminine_wash_-intimate_ph_balance_wash.jpg",
    "stain remover pen for clothes": "https://i5.walmartimages.com/seo/Tide-To-Go-Instant-Laundry-Stain-Remover-Pen-and-Spot-Cleaner-Travel-and-Pocket-Size-Stain-Stick-0-33-fl-oz_37e62412-ac3a-4446-9dca-4a4ef9737dfb.a13515571ab5d37d6598a20dc66b353c.jpeg",
    "electric heating pad for cramps": "https://m.media-amazon.com/images/I/81QEatB8CnL.jpg",
    "microwavable heating pad flaxseed": "https://sc04.alicdn.com/kf/H2a145484f8ab43faa14f4e6796178822S/225383505/H2a145484f8ab43faa14f4e6796178822S.jpg",
    "adhesive heat patches for period pain": "https://m.media-amazon.com/images/I/811jPjT9H8L.jpg",
    "hot water bottle": "https://5.imimg.com/data5/SELLER/Default/2025/12/571730857/BR/WD/ZQ/257449572/hot-water-rubber-bottles-1000x1000.jpg",
    "ibuprofen for period cramps": "https://www.webstaurantstore.com/images/products/extra_large/462645/1734720.jpg",
    "TENS unit for period cramps": "https://carex.com/cdn/shop/files/AccuReliefPeriodPainTENSUnitwithHeatLifestyleImage_4_Cropped_1200x1200.jpg?v=1753992223",
    "Epsom salt bath": "https://seasalt.com/media/cache/attachment/filter/product_gallery_main/11c00c6d0bd6b875afe655d3c9d4f942/8700/5ed127a672909603319424.jpg",
    "magnesium glycinate supplements": "https://m.media-amazon.com/images/I/81PKo5FGG4L.jpg",
    "vitamin B6 supplements": "https://m.media-amazon.com/images/I/61ySNX2QNiL._AC_.jpg",
    "iron supplements": "https://i5.walmartimages.com/asr/d786621c-b865-4707-a199-afe3dd79bbdf_1.314d0c028521322c5e09188733e2e709.jpeg",
    "clary sage essential oil roller": "https://m.media-amazon.com/images/I/71QqKIY-jVL._AC_.jpg",
    "peppermint essential oil": "https://m.media-amazon.com/images/I/61KqRNG4k5L._AC_SL1500_.jpg",
    "ginger chews candy": "https://m.media-amazon.com/images/I/71CwzDJMsEL._SL1500_.jpg",
    "electrolyte powder hydration": "https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/8/1/81cQwRUA3WL.jpg",
    "fish oil omega 3 supplements": "https://i5.walmartimages.com/seo/Nature-Made-Extra-Strength-Omega-3-Fish-Oil-Supplements-2800-mg-Per-Serving-Softgels-60-Count_ed80f642-dcbb-42b4-bc8c-3903ae9d7ca8.55756e31f2761b71d312a0acd778bcce.jpeg",
    "dark chocolate 70 percent cocoa": "https://i5.walmartimages.com/seo/Lindt-Dark-Chocolate-70-Cocoa-EXCELLENCE-Bar-3-5-oz-Exceptional-Flavor-1-Bar_3fef76e9-c969-4a45-b578-5ebce1043e9c.f3aab98c684c563c3cf8782ef6099256.jpeg",
    "raspberry leaf tea": "https://m.media-amazon.com/images/I/71J0mQZuKHL._AC_SL1500_.jpg",
    "chamomile tea": "https://cdnimg.webstaurantstore.com/images/products/large/848744/2949152.jpg",
    "peppermint tea": "https://i5.walmartimages.com/seo/Twinings-Pure-Peppermint-Herbal-Tea-Bags-Caffeine-Free-50-Count-Box_b4d9faaa-fc7a-40ca-9df9-1f43b2f33165.73143d7f41e24383f911de296ccf2cd2.jpeg",
    "ginger tea bags": "https://i5.walmartimages.com/asr/cf28269d-add9-41b4-b62f-0da603cd8c24.839b0b50b8033248d9b43843c8fec181.jpeg",
    "bananas": "https://c8.alamy.com/comp/PRFTN4/bunch-of-fresh-ripe-banana-fruits-isolated-on-white-background-PRFTN4.jpg",
    "pumpkin seeds": "https://i5.walmartimages.com/seo/Pumpkin-Seeds-With-Sea-Salt-Sprouted-Organic-22-Oz-Bag-Keto-Vegan-Gluten-Free-Snacks-Superfood_828ed63c-4073-4dbb-a93e-72758ed5142c.d8201bb447627449f4c44bcfa2b78500.jpeg",
    "dried apricots": "https://131818403.cdn6.editmysite.com/uploads/1/3/1/8/131818403/HGUI4AQYMLXDWP6TUAIIN5BO.jpeg",
    "almonds walnuts mix": "https://img.drz.lazcdn.com/static/lk/p/3f23dd07d18b6a19ada5f2e2da295083.jpg_720x720q80.jpg",
    "whole grain crackers": "https://m.media-amazon.com/images/I/81gmGABuxML.jpg",
    "nut butter packets": "https://i5.walmartimages.com/asr/1b7ecbd5-5229-445c-b9dc-749698db0ce1.b7d049e3a447ae8867ddbbd25ec6475a.jpeg",
    "fruit infuser water bottle": "https://ueeshop.ly200-cdn.com/u_file/UPAU/UPAU869/2207/products/27/eecb8cb726.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800",
    "healthy instant soup mix": "https://healthyheartmarket.com/cdn/shop/products/bobs-red-mill-vegi-soup-mix-non-gmo-sodium-free-28-oz-healthy-heart-market_1200x.jpg?v=1582770160",
    "raw honey": "https://static.vecteezy.com/system/resources/previews/022/590/879/non_2x/honey-label-design-and-honey-jar-label-natural-pure-honey-bee-new-honey-jar-bottle-label-product-sticker-design-creative-and-modern-packaging-gold-honey-black-label-organic-honey-food-tag-vector.jpg",
    "multivitamin gummies": "https://www.nutrigums.co.uk/cdn/shop/products/2-250ml-Womens-Multi_1000x.jpg?v=1678195920",
    "oversized hoodie women": "https://m.media-amazon.com/images/I/81H96aUSYJL._AC_SL1500_.jpg",
    "high waisted leggings": "https://i5.walmartimages.com/seo/FUNING-4-Pack-Leggings-with-Pockets-for-Women-High-Waist-Tummy-Control-Workout-Yoga-Pants_a5a2a4af-d913-423d-bec4-6e78d62261d8.3820ca15f41daa89f7c7837e5f2d1fa9.jpeg",
    "fuzzy warm socks": "https://m.media-amazon.com/images/I/81u+Zg+EJEL._AC_UL1500_.jpg",
    "seamless underwear women": "https://ageofbeautyph.store/cdn/shop/files/viber_image_2024-01-16_01-22-43-353.jpg?v=1710223250&width=1445",
    "weighted blanket": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/bbb17816-f2c7-4f85-a92d-4c8afc329eed.jpg;maxHeight=1920;maxWidth=900?format=webp",
    "body pillow for side sleeping": "https://m.media-amazon.com/images/I/61Q5zuwp10L._AC_SL1500_.jpg",
    "dark colored towel": "https://i5.walmartimages.com/asr/8e0c01a0-609b-41c5-8289-31085958e7d3_1.ac5d312c572ba94298e4ccbe10686bc5.jpeg",
    "silk pillowcase": "https://www.ubersilk.com/wp-content/uploads/2018/12/Moonbeam-Sleep-Pure-Mulberry-Silk-Pillowcase.jpg",
    "loose fit joggers women": "https://i5.walmartimages.com/seo/Dewadbow-Women-Ladies-Gym-Sport-Jogger-Harem-Pants-Sweatpants-Loose-Pants-Baggy-Trousers_fc35c67e-8fcd-480d-bee3-55d57e03daab.91a55415a3d859d9300a9caa774ba224.jpeg",
    "house slippers fuzzy": "https://m.media-amazon.com/images/I/71eTNUfoRBL._AC_UL1500_.jpg",
    "microwavable plush heating pad": "https://m.media-amazon.com/images/I/71ESgAoIBdL._AC_SL1500_.jpg",
    "funny period socks": "https://i5.walmartimages.com/seo/PUTUO-Mens-Warm-Floor-Socks-Thick-and-Cozy-Mid-Tube-Slipper-Socks-Soft-Fuzzy-Thermal-Socks-for-Spring-Autumn-and-Winter-Ideal-Gift-for-Men_20fd5897-2ee4-4175-a676-c8d065a10d8c.a1b91a0aa6613f9657857b326f4b1352.jpeg",
    "hydrocolloid pimple patches": "https://natuderma.com/wp-content/uploads/2023/06/Ultra-Thin-Acne-pimples-patches-natuderma-min.png",
    "hydrating sheet face mask": "https://m.media-amazon.com/images/I/81Qv7rYfT0L._SL1500_.jpg",
    "period tracker journal": "https://mrsneat.net/cdn/shop/files/PeriodSymptomTrackerPrintable_3.jpg?v=1725675697&width=1346",
    "aesthetic water bottle with time marker": "https://img.buzzfeed.com/store-an-image-prod-us-east-1/S_FpC3gR7.png?output-format=jpg&downsize=650:*&output-format=auto&output-quality=auto",
    "silk scrunchies": "https://m.media-amazon.com/images/I/81ElHDNQ3NL._AC_.jpg",
    "soy scented candle": "https://digitalcontent.api.tesco.com/v2/media/ghs/aa07a69b-6305-449b-b217-c840f264990b/0a5cef76-70db-409f-9fcf-d38756238e51_532107140.jpeg?h=960&w=960",
    "blind bag surprise toy": "https://www.instacart.com/image-server/1200x1200/www.instacart.com/assets/domains/product-image/file/large_5ed3172c-3605-4a76-8146-0e378ec7f798.jpeg",
    "fresh bouquet flowers": "https://art-flowerss.com/wp-content/uploads/2025/02/Maggie-Bouquet.jpg",
  };

  const getProductImage = (query) => productImages[query] || `https://picsum.photos/seed/${encodeURIComponent(query)}/400/300`;

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