require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Product = require("./models/Product");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT = path.join(__dirname, "data", "photos");
const OK = /\.(jpe?g|png|webp)$/i;

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const folders = fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const f of folders) {
    const product = await Product.findOne({ slug: f.name });
    if (!product) { console.log("NO MATCH for slug:", f.name); continue; }

    const files = fs.readdirSync(path.join(ROOT, f.name)).filter((x) => OK.test(x))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).slice(0, 4);
    if (!files.length) continue;

    const images = [];
    for (let i = 0; i < files.length; i++) {
      const r = await cloudinary.uploader.upload(path.join(ROOT, f.name, files[i]), {
        folder: "perfect_moto/products",
        public_id: `${f.name}-${i + 1}`,
        overwrite: true,
        transformation: [{ width: 1200, height: 1600, crop: "limit", quality: "auto" }],
      });
      images.push({ url: r.secure_url, publicId: r.public_id, isMain: i === 0 });
    }
    product.images = images;
    await product.save();
    console.log("OK", f.name, images.length, "images");
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });