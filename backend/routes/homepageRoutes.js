// backend/routes/homepageRoutes.js
const express = require('express');
const router = express.Router();
const { getHomepageContent, updateHomepageContent } = require('../controllers/homepageController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware'); // default export

// GET /api/homepage -> Publicly fetch announcement text, scheduled banners, and featured products
router.get('/', getHomepageContent);

// PUT /api/homepage -> Restricted administrative override to modify layout, banners, and rules
router.put('/', verifyToken, requireAdmin, updateHomepageContent);

module.exports = router;