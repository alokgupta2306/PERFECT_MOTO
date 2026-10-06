require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const isPlaceholder = (u = "") => u.includes("placehold.co");
const labels = ["Front", "Side", "Detail"];
const mk = (name, label) =>
  `https://placehold.co/600x800/1A1A1A/FFB800.png?text=${encodeURIComponent(name.slice(0, 26) + " - " + label)}`;

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({}).select("name images");
  const ops = [];
  for (const p of products) {
    const imgs = p.images || [];
    // only touch products that still use placeholders (never overwrite real photos)
    if (imgs.length && !imgs.every((i) => isPlaceholder(i.url))) continue;
    ops.push({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { images: labels.map((l, i) => ({ url: mk(p.name, l), isMain: i === 0 })) } },
      },
    });
  }
  if (ops.length) await Product.bulkWrite(ops);
  console.log("Products updated with 3 images:", ops.length);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });