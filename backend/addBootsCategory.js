require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Category.findOne({ slug: "boots" });
  if (existing) {
    console.log("Boots category already exists:", existing._id.toString());
    process.exit(0);
  }

  const last = await Category.findOne().sort({ sortOrder: -1 });
  const cat = await Category.create({
    name: "Boots",
    slug: "boots",
    isActive: true,
    sortOrder: last ? (last.sortOrder || 0) + 1 : 1,
    image: { url: "https://placehold.co/400x300/1A1A1A/FFB800?text=Boots" },
  });

  console.log("Created category:", cat.name, cat._id.toString());
  process.exit(0);
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});