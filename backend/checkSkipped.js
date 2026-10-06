require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const cats = await Category.find({});
  const known = new Set(cats.map((c) => c._id.toString()));
  console.log("Categories in DB:", cats.map((c) => `${c.slug} (${c._id})`).join(", "));

  const products = await Product.find({}).select("name category weight");
  const bad = products.filter((p) => !p.category || !known.has(p.category.toString()));

  console.log("\nProducts with unknown category:", bad.length);
  const byCat = {};
  bad.forEach((p) => {
    const k = String(p.category);
    byCat[k] = (byCat[k] || 0) + 1;
  });
  console.log("Grouped by category id:", byCat);
  console.log("Examples:", bad.slice(0, 5).map((p) => p.name));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });