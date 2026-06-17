const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// FIXED (Issue 1): Replaced duplicate manual Multer setup with your global standard upload middleware
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// ============================================================================
// 📸 ADMINISTRATIVE MEDIA UPLOAD ENDPOINTS
// ============================================================================

// FIXED (Issue 1): Uses the central upload engine to handle size restrictions (5MB) and type filtering cleanly
router.post('/', verifyToken, requireAdmin, upload.single('image'), uploadImage);

module.exports = router;