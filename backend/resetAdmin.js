require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const EMAIL = process.env.ADMIN_EMAIL || "admin@perfectmoto.com";
const PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123!";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email: EMAIL });
  if (!user) {
    console.log("No user with email:", EMAIL);
    console.log("Existing admins:", (await User.find({ role: "admin" }).select("email")).map(u => u.email));
    process.exit(1);
  }

  const hash = await bcrypt.hash(PASSWORD, 12);
  await User.updateOne(
    { _id: user._id },
    { $set: { password: hash, role: "admin", isActive: true, isEmailVerified: true } }
  );

  console.log("Admin reset OK");
  console.log("Email:   ", EMAIL);
  console.log("Password:", PASSWORD);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });