const multer = require("multer");

const memoryStorageEngine = multer.memoryStorage();

const mechanicalImageFilter = (req, file, callback) => {
  // Enforce rigid verification bounds on incoming MIME categories
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(new Error("Mimetype mismatch. Target file stream must pass as an image format layout."), false);
  }
};

const uploadProcessor = multer({
  storage: memoryStorageEngine,
  fileFilter: mechanicalImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB structural size floor limits rule
  }
});

module.exports = uploadProcessor;