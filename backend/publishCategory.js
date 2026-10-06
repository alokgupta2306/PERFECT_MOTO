require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");

const slug = process.argv[2];
if (!slug) { console.log("Usage: node publishCategory.js <category-slug | all>"); process.exit(1); }

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let filter = { status: "draft" };
  if (slug !== "all") {
    const cat = await Category.findOne({ slug });
    if (!cat) { console.log("Category not found:", slug); process.exit(1); }
    filter.category = cat._id;
  }

  const res = await Product.updateMany(filter, { $set: { status: "active" } });
  console.log(`Published ${res.modifiedCount} products (${slug})`);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });