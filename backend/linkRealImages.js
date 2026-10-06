require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.log("Add PEXELS_API_KEY to .env first"); process.exit(1); }

// keyword in product text -> Pexels search query (first match wins)
const RULES = [
  ["full face", "motorcycle helmet"], ["helmet", "motorcycle helmet"],
  ["glove", "motorcycle gloves"], ["jacket", "motorcycle jacket rider"],
  ["boot", "motorcycle boots"], ["shoe", "motorcycle boots"],
  ["visor", "motorcycle helmet visor"],
  ["tail bag", "motorcycle luggage bag"], ["saddle", "motorcycle saddlebag"],
  ["tank bag", "motorcycle tank bag"], ["backpack", "motorcycle backpack"],
  ["luggage", "motorcycle luggage"],
  ["chain", "motorcycle chain sprocket"], ["sprocket", "motorcycle chain sprocket"],
  ["brake", "motorcycle brake disc"], ["mirror", "motorcycle mirror"],
  ["crash guard", "motorcycle engine guard"], ["engine guard", "motorcycle engine guard"],
  ["handlebar", "motorcycle handlebar"], ["headlight", "motorcycle headlight"],
  ["led", "motorcycle led light"], ["lock", "motorcycle lock security"],
  ["cover", "motorcycle cover"], ["phone", "motorcycle phone mount"],
  ["seat", "motorcycle seat"], ["tyre", "motorcycle tyre"],
  ["exhaust", "motorcycle exhaust"], ["spark plug", "motorcycle engine"],
];
const CAT_FALLBACK = {
  helmets: "motorcycle helmet", gloves: "motorcycle gloves", jackets: "motorcycle jacket rider",
  boots: "motorcycle boots", visors: "motorcycle helmet visor", luggage: "motorcycle luggage",
  "bike-parts": "motorcycle engine parts", accessories: "motorcycle accessories",
};

const cache = {};
async function pool(query) {
  if (cache[query]) return cache[query];
  const r = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=80&orientation=portrait`,
    { headers: { Authorization: KEY } }
  );
  if (!r.ok) throw new Error(`Pexels ${r.status} for "${query}"`);
  const j = await r.json();
  cache[query] = (j.photos || []).map((p) => p.src.large); // ~940px wide
  console.log(`  pool "${query}": ${cache[query].length} photos`);
  return cache[query];
}

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const isPlaceholder = (u = "") => u.includes("placehold.co") || u.includes("via.placeholder.com");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const cats = await Category.find({});
  const slugById = Object.fromEntries(cats.map((c) => [c._id.toString(), c.slug]));
  const products = await Product.find({}).select("name subcategory category images");

  const ops = [];
  for (const p of products) {
    const imgs = p.images || [];
    if (imgs.length && !imgs.every((i) => isPlaceholder(i.url))) continue; // keep real photos

    const text = `${p.name} ${p.subcategory || ""}`.toLowerCase();
    const rule = RULES.find(([k]) => text.includes(k));
    const query = rule ? rule[1] : CAT_FALLBACK[slugById[p.category?.toString()]] || "motorcycle";

    const photos = await pool(query);
    if (photos.length < 3) continue;
    const h = hash(p.slug || p.name);
    const picked = [];
    for (let k = 0; picked.length < 3 && k < 30; k++) {
      const url = photos[(h + k * 7) % photos.length];
      if (!picked.includes(url)) picked.push(url);
    }
    ops.push({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { images: picked.map((url, i) => ({ url, isMain: i === 0 })) } },
      },
    });
  }

  if (ops.length) await Product.bulkWrite(ops);
  console.log("\nProducts updated with 3 real photos:", ops.length);
  process.exit(0);
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });