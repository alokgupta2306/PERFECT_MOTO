require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");

// weight in kg, dimensions in cm
const DEFAULTS = {
  helmets:     { weight: 1.6, length: 35, width: 28, height: 28 },
  gloves:      { weight: 0.3, length: 28, width: 18, height: 6 },
  jackets:     { weight: 1.5, length: 45, width: 35, height: 12 },
  boots:       { weight: 1.8, length: 35, width: 25, height: 15 },
  visors:      { weight: 0.2, length: 30, width: 25, height: 8 },
  luggage:     { weight: 1.5, length: 45, width: 30, height: 25 },
  "bike-parts":{ weight: 0.8, length: 25, width: 20, height: 15 },
  accessories: { weight: 0.4, length: 20, width: 15, height: 10 },
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const cats = await Category.find({});
  const slugById = Object.fromEntries(cats.map((c) => [c._id.toString(), c.slug]));

  const products = await Product.find({}).select("category");
  const ops = [];
  let skipped = 0;

  for (const p of products) {
    const d = DEFAULTS[slugById[p.category?.toString()]];
    if (!d) { skipped++; continue; }
    ops.push({
      updateOne: {
        filter: { _id: p._id },
        update: {
          $set: {
            weight: d.weight,
            "dimensions.length": d.length,
            "dimensions.width": d.width,
            "dimensions.height": d.height,
          },
        },
      },
    });
  }

  if (ops.length) await Product.bulkWrite(ops);
  console.log("Updated:", ops.length, "| Skipped (unknown category):", skipped);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });