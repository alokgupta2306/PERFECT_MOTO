require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");

const OLD_ID = "6ac4b5f27bc5f61a3c31be27";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Does a boots category already exist under another id?
  let cat = await Category.findOne({ slug: "boots" });

  if (cat) {
    console.log("Boots exists with id:", cat._id.toString());
    if (cat._id.toString() !== OLD_ID) {
      const r = await Product.updateMany(
        { category: new mongoose.Types.ObjectId(OLD_ID) },
        { $set: { category: cat._id } }
      );
      console.log("Re-linked products:", r.modifiedCount);
    }
  } else {
    // 2. Recreate it with the SAME id so the 28 products link up again
    await Category.collection.insertOne({
      _id: new mongoose.Types.ObjectId(OLD_ID),
      name: "Boots",
      slug: "boots",
      isActive: true,
      sortOrder: 4,
      image: { url: "https://placehold.co/400x300/1A1A1A/FFB800.png?text=Boots" },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Boots category restored with id", OLD_ID);
  }

  const n = await Product.countDocuments({ category: (await Category.findOne({ slug: "boots" }))._id });
  console.log("Products now linked to Boots:", n);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });