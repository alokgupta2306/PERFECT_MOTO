require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Category = require("./models/Category");

const isPlaceholder = (u = "") =>
  u.includes("via.placeholder.com") || (u.includes("placehold.co") && !u.includes(".png"));

const makeUrl = (text, w = 600, h = 600) =>
  `https://placehold.co/${w}x${h}/1A1A1A/FFB800.png?text=${encodeURIComponent(text.slice(0, 28))}`;

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const products = await Product.find({});
  const pOps = [];
  for (const p of products) {
    const imgs = p.images || [];
    if (imgs.length === 0 || imgs.every((i) => isPlaceholder(i.url))) {
      pOps.push({
        updateOne: {
          filter: { _id: p._id },
          update: { $set: { images: [{ url: makeUrl(`${p.brand || ""} ${p.name}`), isMain: true }] } },
        },
      });
    }
  }
  if (pOps.length) await Product.bulkWrite(pOps);
  console.log("Product images fixed:", pOps.length);

  const cats = await Category.find({});
  let cFixed = 0;
  for (const c of cats) {
    if (!c.image?.url || isPlaceholder(c.image.url)) {
      c.image = { url: makeUrl(c.name, 400, 300) };
      await c.save();
      cFixed++;
    }
  }
  console.log("Category images fixed:", cFixed);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });