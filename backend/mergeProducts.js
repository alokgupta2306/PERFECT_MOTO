const fs = require("fs");
const path = require("path");

const BATCH_DIR = path.join(__dirname, "data", "batches");
const OUT_FILE = path.join(__dirname, "data", "products.json");
const bikesData = require("./data/bikes.json");

const VALID_CATS = ["helmets", "gloves", "jackets", "boots", "visors", "luggage", "bike-parts", "accessories"];

// Build bike lookup: "brand|model" -> years[]
const bikeMap = {};
for (const b of bikesData.brands) {
  for (const m of b.models) bikeMap[`${b.brand}|${m.model}`] = m.years;
}

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const files = fs.readdirSync(BATCH_DIR).filter((f) => f.endsWith(".json"));
const seenSlugs = new Set();
const seenNames = new Set();
const out = [];
const log = { dupName: 0, slugFixed: 0, badCat: 0, bikeDropped: 0, yearFixed: 0, priceFixed: 0, missing: 0 };

for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), "utf8"));
  for (const p of arr) {
    // required fields
    if (!p.name || !p.category || typeof p.price !== "number") { log.missing++; continue; }
    // category
    if (!VALID_CATS.includes(p.category)) { log.badCat++; continue; }
    // duplicate names
    const nameKey = p.name.toLowerCase().trim();
    if (seenNames.has(nameKey)) { log.dupName++; continue; }
    seenNames.add(nameKey);
    // unique slug
    let slug = p.slug ? slugify(p.slug) : slugify(p.name);
    if (seenSlugs.has(slug)) {
      let i = 2;
      while (seenSlugs.has(`${slug}-${i}`)) i++;
      slug = `${slug}-${i}`;
      log.slugFixed++;
    }
    seenSlugs.add(slug);
    p.slug = slug;

    // validate bikes
    const goodBikes = [];
    for (const cb of p.compatibleBikes || []) {
      const years = bikeMap[`${cb.brand}|${cb.model}`];
      if (!years) { log.bikeDropped++; continue; }
      const min = Math.min(...years), max = Math.max(...years);
      let from = Math.max(cb.yearFrom || min, min);
      let to = Math.min(cb.yearTo || max, max);
      if (from > to) { from = min; to = max; }
      if (from !== cb.yearFrom || to !== cb.yearTo) log.yearFixed++;
      goodBikes.push({ brand: cb.brand, model: cb.model, yearFrom: from, yearTo: to });
    }
    p.compatibleBikes = goodBikes;

    // price sanity
    p.price = Math.round(p.price);
    if (typeof p.salePrice !== "number" || p.salePrice >= p.price || p.salePrice <= 0) {
      p.salePrice = Math.round(p.price * 0.85);
      log.priceFixed++;
    } else p.salePrice = Math.round(p.salePrice);

    // defaults
    p.gstPercent = p.gstPercent || 18;
    p.lowStockAlert = p.lowStockAlert || 5;
    p.stock = Number.isInteger(p.stock) && p.stock >= 0 ? p.stock : 20;
    p.status = "draft";

    out.push(p);
  }
}

fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));

const counts = {};
out.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1));
console.log("\nFILES READ:", files.length);
console.log("TOTAL PRODUCTS SAVED:", out.length);
console.log("PER CATEGORY:", counts);
console.log("CLEANUP LOG:", log);
console.log("\nSaved to:", OUT_FILE);