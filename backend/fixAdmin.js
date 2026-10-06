require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const EMAIL = (process.env.ADMIN_EMAIL || "admin@perfectmoto.com").trim().toLowerCase();
const PASSWORD = (process.env.ADMIN_PASSWORD || "Admin@123!").trim();

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to:", mongoose.connection.name);

  const hash = await bcrypt.hash(PASSWORD, 12);
  let user = await User.findOne({ email: EMAIL });

  if (!user) {
    console.log("Admin not found, creating...");
    await User.collection.insertOne({
      name: "Perfect Moto Admin",
      email: EMAIL,
      password: hash,
      phone: "9999999999",
      role: "admin",
      isActive: true,
      isEmailVerified: true,
      referralCode: "ADMIN" + Math.floor(1000 + Math.random() * 9000),
      loyaltyPoints: 0,
      addresses: [],
      savedBikes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hash, role: "admin", isActive: true, isEmailVerified: true } }
    );
  }

  // Verify
  const check = await User.findOne({ email: EMAIL }).select("+password");
  const ok = await bcrypt.compare(PASSWORD, check.password);
  console.log("\nEmail:    ", EMAIL);
  console.log("Password: ", PASSWORD);
  console.log("Role:     ", check.role, "| Active:", check.isActive);
  console.log("Password check:", ok ? "MATCHES" : "FAILED");
  process.exit(0);
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });