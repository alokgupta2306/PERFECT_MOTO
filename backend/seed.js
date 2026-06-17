// backend/seed.js
require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Coupon = require("./models/Coupon");

const seedDatabaseEngine = async () => {
  try {
    console.log("INITIALIZING CONNECTION TO MONGO CLUSTER...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DATABASE CONNECTION ESTABLISHED SUCCESSFULLY.");

    console.log("WIPING PREVIOUS TABLE RECORDS...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    console.log("EXISTING DATA WIPED CLEAN FROM REGISTRIES.");

    // ✅ No manual bcrypt — pre-save hook handles hashing automatically
    console.log("ENCRYPTING ADMIN CREDENTIAL VECTOR...");
    const adminPasswordRaw = process.env.ADMIN_PASSWORD || "Admin@PerfectMoto2024!";

    const adminUser = await User.create({
      name: "Perfect Moto Admin",
      email: process.env.ADMIN_EMAIL || "admin@perfectmoto.com",
      password: adminPasswordRaw, // ✅ Plain text — pre-save hook hashes it
      phone: "8356968789",
      role: "admin",
      isEmailVerified: true,
      referralCode: "ADMIN001",
      loyaltyPoints: 0
    });
    console.log(`ADMIN ACCOUNT INITIALIZED SUCCESSFULLY: ${adminUser.email}`);

    console.log("INJECTING CATEGORY SCHEMA RECORDS...");
    const categorizedCollections = await Category.insertMany([
      { name: "Helmets", slug: "helmets", isActive: true, sortOrder: 1, image: { url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500" } },
      { name: "Gloves", slug: "gloves", isActive: true, sortOrder: 2, image: { url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500" } },
      { name: "Jackets", slug: "jackets", isActive: true, sortOrder: 3, image: { url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500" } },
      { name: "Boots", slug: "boots", isActive: true, sortOrder: 4, image: { url: "https://images.unsplash.com/photo-1611245451991-8848467da5b2?w=500" } },
      { name: "Visors", slug: "visors", isActive: true, sortOrder: 5, image: { url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500" } },
      { name: "Luggage", slug: "luggage", isActive: true, sortOrder: 6, image: { url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500" } },
      { name: "Bike Parts", slug: "bike-parts", isActive: true, sortOrder: 7, image: { url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500" } },
      { name: "Accessories", slug: "accessories", isActive: true, sortOrder: 8, image: { url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500" } }
    ]);
    console.log(`LAUNCH MATRIX LOGGED: ${categorizedCollections.length} CATEGORIES SECURED.`);

    const helmetCatId = categorizedCollections[0]._id;
    const glovesCatId = categorizedCollections[1]._id;

    console.log("GENERATING LIVE PERFORMANCE PRODUCT LINES...");
    await Product.insertMany([
      {
        name: "Vega Crux Full Face Helmet ISI Certified",
        brand: "Vega",
        category: helmetCatId,
        slug: "vega-crux-full-face-helmet-isi",
        description: "Premium ISI certified aerodynamic full face protection module.",
        features: ["ISI BIS Certified", "ABS Hard Shell", "Quick Release Buckle"],
        specifications: [
          { key: "Material", value: "ABS Polymer Blend" },
          { key: "Weight", value: "1.4 KG" },
          { key: "Finish", value: "Matte Stealth Black" }
        ],
        whatsInBox: ["1x Premium Crux Helmet", "1x Microfiber Storage Bag"],
        images: [{ url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800", isMain: true }],
        price: 3200,
        salePrice: 2499,
        gstPercent: 18,
        stock: 50,
        lowStockAlert: 5,
        compatibleBikes: [
          { brand: "Royal Enfield", model: "Classic 350", yearFrom: 2019, yearTo: 2024 },
          { brand: "Royal Enfield", model: "Bullet 350", yearFrom: 2019, yearTo: 2024 }
        ],
        isFeatured: true,
        isNewArrival: true,
        status: "active"
      },
      {
        name: "Steelbird Pro Riding Gloves",
        brand: "Steelbird",
        category: glovesCatId,
        slug: "steelbird-pro-riding-gloves",
        description: "Knuckle carbon protection mesh riding gloves with touchscreen pads.",
        features: ["Carbon Knuckle Armor", "High Breathability", "Touch Screen Compatible"],
        specifications: [
          { key: "Material", value: "Reinforced Mesh Leather" },
          { key: "Weight", value: "350 Grams" },
          { key: "Finish", value: "Brushed Charcoal" }
        ],
        whatsInBox: ["1x Pair Steelbird Performance Gloves"],
        images: [{ url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800", isMain: true }],
        price: 1200,
        salePrice: 899,
        gstPercent: 18,
        stock: 100,
        lowStockAlert: 10,
        compatibleBikes: [
          { brand: "Royal Enfield", model: "Classic 350", yearFrom: 2019, yearTo: 2024 },
          { brand: "KTM", model: "Duke 390", yearFrom: 2019, yearTo: 2024 }
        ],
        isFeatured: true,
        isBestSeller: true,
        status: "active"
      }
    ]);
    console.log("PRODUCT RECOGNITION UPGRADE RECORDS ONLINE.");

    console.log("COMPILING VALIDATION COUPONS...");
    await Coupon.insertMany([
      {
        code: "WELCOME10",
        discountType: "percent",
        discountValue: 10,
        maxDiscount: 500,
        minOrderValue: 999,
        maxUses: 10000,
        usesPerUser: 1,
        isFirstOrderOnly: true,
        validFrom: new Date(),
        expiryDate: new Date("2027-12-31"),
        isActive: true
      },
      {
        code: "FLAT100",
        discountType: "flat",
        discountValue: 100,
        maxDiscount: 100,
        minOrderValue: 1499,
        maxUses: 500,
        usesPerUser: 2,
        isFirstOrderOnly: false,
        validFrom: new Date(),
        expiryDate: new Date("2027-12-31"),
        isActive: true
      }
    ]);
    console.log("DEFAULT COUPONS SYSTEM ENGAGED.");

    console.log("\n==========================================");
    console.log("🏁 DATABASE SEED RUN COMPLETED SUCCESSFULLY!");
    console.log(`Admin Entry Email: ${adminUser.email}`);
    console.log(`Admin Entry Password: ${adminPasswordRaw}`);
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ CRITICAL EXCEPTION RUNNING SEED UTILITIES:", error);
    process.exit(1);
  }
};

seedDatabaseEngine();