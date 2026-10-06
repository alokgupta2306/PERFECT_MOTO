const multer = require("multer");

// 1. Configure Memory Storage
const memoryStorageEngine = multer.memoryStorage();

// 2. Configure Image Mimetype Filter
const mechanicalImageFilter = (req, file, callback) => {
  // Enforce rigid verification bounds on incoming MIME categories
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(
      new Error("Mimetype mismatch. Target file stream must pass as an image format layout."),
      false
    );
  }
};

// 3. Configure Upload Limits and Storage Engine
const uploadProcessor = multer({
  storage: memoryStorageEngine,
  fileFilter: mechanicalImageFilter,
  limits: {
  fileSize: 15 * 1024 * 1024, // 15MB limit
},
});

module.exports = uploadProcessor;