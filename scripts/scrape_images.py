"""
Period Kit Image Scraper
========================
Scrapes Google Images for embeddable product image URLs.

Usage:
  pip install requests beautifulsoup4 openpyxl
  python scrape_images.py

Output: period_kit_images.xlsx  AND  period_kit_images.json
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import time
import re
import json
import random

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

ITEMS = [
    (1, "Regular Day Pads", "The Essentials: Hygiene & Protection", "regular day menstrual pads product"),
    (2, "Overnight Pads", "The Essentials: Hygiene & Protection", "overnight menstrual pads product"),
    (3, "Panty Liners", "The Essentials: Hygiene & Protection", "panty liners product"),
    (4, "Light Tampons", "The Essentials: Hygiene & Protection", "light flow tampons product"),
    (5, "Super Tampons", "The Essentials: Hygiene & Protection", "super absorbency tampons product"),
    (6, "Menstrual Cup", "The Essentials: Hygiene & Protection", "menstrual cup silicone product"),
    (7, "Menstrual Disc", "The Essentials: Hygiene & Protection", "menstrual disc reusable product"),
    (8, "Period Underwear", "The Essentials: Hygiene & Protection", "period underwear product"),
    (9, "Interlabial Pads", "The Essentials: Hygiene & Protection", "interlabial pads product"),
    (10, "Menstrual Cup Sterilizer", "The Essentials: Hygiene & Protection", "menstrual cup sterilizer product"),
    (11, "Biodegradable Wipes", "The Essentials: Hygiene & Protection", "biodegradable feminine wipes product"),
    (12, "Portable Bidet", "The Essentials: Hygiene & Protection", "portable bidet spray bottle product"),
    (13, "Disposal Bags", "The Essentials: Hygiene & Protection", "sanitary napkin disposal bags product"),
    (14, "Intimate pH-Balanced Wash", "The Essentials: Hygiene & Protection", "intimate pH balanced feminine wash product"),
    (15, "Stain Remover Pen", "The Essentials: Hygiene & Protection", "tide stain remover pen product"),
    (16, "Electric Heating Pad", "Pain Relief & Physical Health", "electric heating pad for cramps product"),
    (17, "Microwavable Seed Sack", "Pain Relief & Physical Health", "microwavable heat pack seed sack product"),
    (18, "Adhesive Heat Patches", "Pain Relief & Physical Health", "adhesive menstrual heat patches product"),
    (19, "Hot Water Bottle", "Pain Relief & Physical Health", "rubber hot water bottle product"),
    (20, "Ibuprofen / Naproxen", "Pain Relief & Physical Health", "ibuprofen tablets product box"),
    (21, "TENS Machine", "Pain Relief & Physical Health", "TENS machine period pain relief product"),
    (22, "Epsom Salts", "Pain Relief & Physical Health", "epsom salt bath product bag"),
    (23, "Magnesium Supplements", "Pain Relief & Physical Health", "magnesium supplement capsules product"),
    (24, "Vitamin B6", "Pain Relief & Physical Health", "vitamin B6 supplement bottle product"),
    (25, "Iron Supplements", "Pain Relief & Physical Health", "iron supplement tablets product"),
    (26, "Essential Oil Roller", "Pain Relief & Physical Health", "essential oil roller blend product"),
    (27, "Peppermint Oil", "Pain Relief & Physical Health", "peppermint essential oil bottle product"),
    (28, "Ginger Chews", "Pain Relief & Physical Health", "ginger chews candy product bag"),
    (29, "Electrolyte Powder", "Pain Relief & Physical Health", "electrolyte powder sachets product"),
    (30, "Omega-3 Capsules", "Pain Relief & Physical Health", "omega 3 fish oil capsules product"),
    (31, "Dark Chocolate 70%+", "Nutrition & Cravings", "dark chocolate 70 percent bar product"),
    (32, "Raspberry Leaf Tea", "Nutrition & Cravings", "raspberry leaf tea bags product box"),
    (33, "Chamomile Tea", "Nutrition & Cravings", "chamomile tea bags product box"),
    (34, "Peppermint Tea", "Nutrition & Cravings", "peppermint tea bags product box"),
    (35, "Ginger Tea", "Nutrition & Cravings", "ginger tea bags product box"),
    (36, "Bananas", "Nutrition & Cravings", "fresh bananas bunch fruit"),
    (37, "Pumpkin Seeds", "Nutrition & Cravings", "pumpkin seeds snack product bag"),
    (38, "Dried Apricots", "Nutrition & Cravings", "dried apricots product bag"),
    (39, "Almonds / Walnuts", "Nutrition & Cravings", "mixed nuts almonds walnuts product"),
    (40, "Whole Grain Crackers", "Nutrition & Cravings", "whole grain crackers product box"),
    (41, "Nut Butter Packets", "Nutrition & Cravings", "nut butter single serve packets product"),
    (42, "Fruit Infuser Bottle", "Nutrition & Cravings", "fruit infuser water bottle product"),
    (43, "Healthy Soup Mix", "Nutrition & Cravings", "healthy soup mix product packet"),
    (44, "Honey", "Nutrition & Cravings", "honey jar product"),
    (45, "Gummy Vitamins", "Nutrition & Cravings", "gummy vitamins women product bottle"),
    (46, "Oversized Hoodie", "Comfort & Sleep", "oversized hoodie women cozy product"),
    (47, "High-Waisted Leggings", "Comfort & Sleep", "high waisted leggings women product"),
    (48, "Fuzzy Socks", "Comfort & Sleep", "fuzzy cozy socks women product"),
    (49, "Seamless Underwear", "Comfort & Sleep", "seamless underwear women product"),
    (50, "Weighted Blanket", "Comfort & Sleep", "weighted blanket product"),
    (51, "Body Pillow", "Comfort & Sleep", "body pillow product"),
    (52, "Dark Towel", "Comfort & Sleep", "dark colored bath towel product"),
    (53, "Silk Pillowcase", "Comfort & Sleep", "silk pillowcase product"),
    (54, "Loose Joggers", "Comfort & Sleep", "loose jogger pants women product"),
    (55, "House Slippers", "Comfort & Sleep", "house slippers women cozy product"),
    (56, "Plushie Heating Pad", "Cute Gifts & Mental Health", "plushie animal heating pad product"),
    (57, "Cramp Socks", "Cute Gifts & Mental Health", "warm cozy socks gift product"),
    (58, "Pimple Patches", "Cute Gifts & Mental Health", "pimple patches acne product"),
    (59, "Sheet Masks", "Cute Gifts & Mental Health", "sheet face mask skincare product"),
    (60, "Symptom Tracker / Journal", "Cute Gifts & Mental Health", "period symptom tracker journal product"),
    (61, "Aesthetic Water Bottle", "Cute Gifts & Mental Health", "aesthetic water bottle product"),
    (62, "Silk Scrunchies", "Cute Gifts & Mental Health", "silk scrunchies hair product"),
    (63, "Scented Candle", "Cute Gifts & Mental Health", "scented candle relaxing product"),
    (64, "Blind Bag / Surprise Toy", "Cute Gifts & Mental Health", "blind bag surprise toy product"),
    (65, "Flowers", "Cute Gifts & Mental Health", "flower bouquet fresh product"),
]


SESSION = requests.Session()
SESSION.headers.update(HEADERS)


def ddg_vqd(query):
    r = SESSION.get(f"https://duckduckgo.com/?q={quote_plus(query)}", timeout=15)
    m = re.search(r'vqd=["\']?([\d-]+)["\']?', r.text)
    return m.group(1) if m else None


def scrape_google_images(query, num_images=1):
    try:
        vqd = ddg_vqd(query)
        if not vqd:
            return []
        api = f"https://duckduckgo.com/i.js?l=us-en&o=json&q={quote_plus(query)}&vqd={vqd}&f=,,,,,&p=1"
        r = SESSION.get(api, headers={**HEADERS, "Referer": "https://duckduckgo.com/"}, timeout=15)
        data = r.json()
        urls = []
        for item in data.get("results", []):
            u = item.get("image") or ""
            if u.startswith("http") and any(ext in u.lower().split("?")[0] for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                urls.append(u)
                if len(urls) >= num_images:
                    break
        return urls
    except Exception as e:
        print(f"  ERROR: {e}")
        return []


def main():
    results = []
    total = len(ITEMS)
    print(f"Scraping Google Images for {total} items...\n")
    for num, name, cat, query in ITEMS:
        print(f"[{num}/{total}] {name}...", end=" ", flush=True)
        urls = scrape_google_images(query, num_images=1)
        img_url = urls[0] if urls else "NOT FOUND"
        print("OK" if urls else "MISS")
        results.append({"num": num, "name": name, "category": cat, "query": query, "url": img_url})
        time.sleep(random.uniform(1.5, 3.0))
    with open("scripts/period_kit_images.json", "w") as f:
        json.dump(results, f, indent=2)
    found = sum(1 for r in results if r["url"] != "NOT FOUND")
    print(f"\nResults: {found}/{total} images found")
    print("Saved scripts/period_kit_images.json")


if __name__ == "__main__":
    main()
