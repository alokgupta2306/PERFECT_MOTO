require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");
const products = require("./data/products.json");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const cats = await Category.find({});
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c._id]));
  console.log("Categories found:", Object.keys(catMap).join(", ") || "NONE");

  const needed = [...new Set(products.map((p) => p.category))];
  const missing = needed.filter((s) => !catMap[s]);
  if (missing.length) {
    console.log("\nSTOPPED. These categories are missing in your database:");
    console.log(missing.join(", "));
    console.log("Create them in the admin panel (or tell me and I'll give you a script), then run again.");
    process.exit(1);
  }

  const ops = products.map((p) => ({
    updateOne: {
      filter: { slug: p.slug },
      update: { $set: { ...p, category: catMap[p.category] } },
      upsert: true,
      setDefaultsOnInsert: true,
    },
  }));

  const res = await Product.bulkWrite(ops);
  console.log(`\nInserted: ${res.upsertedCount}`);
  console.log(`Updated (already existed): ${res.modifiedCount}`);
  console.log("Total products in DB now:", await Product.countDocuments());
  process.exit(0);
})().catch((e) => {
  console.error("IMPORT FAILED:", e.message);
  process.exit(1);
});