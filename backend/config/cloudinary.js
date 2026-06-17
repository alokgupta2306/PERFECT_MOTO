const cloudinary = require("cloudinary").v2;

// FIXED: Standardized to process.env.CLOUDINARY_NAME to prevent configuration desync
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("⚠️ Warning: Cloudinary storage engine credentials missing from .env resource.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // FIXED: Matches global standard env parameters
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

module.exports = cloudinary;