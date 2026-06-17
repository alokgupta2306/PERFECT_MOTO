require("dotenv").config();
const mongoose = require("mongoose");

const checks = [
  "User", "Product", "Order", "Category",
  "Coupon", "Bundle", "Review", "NotifyMe",
  "Referral", "PriceHistory", "LiveActivity",
  "HomepageContent", "SiteSettings"
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected\n");

  for (const name of checks) {
    try {
      const model = require(`./models/${name}`);
      const count = await model.countDocuments();
      console.log(`✅ ${name} — ${count} documents`);
    } catch (e) {
      console.log(`❌ ${name} — ERROR: ${e.message}`);
    }
  }

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });