const express = require('express');
// FIXED (Issue 1 & 2): Imported getCustomerPhotos and rejectReview controller methods
const {
  createReview,
  getProductReviews,
  approveReview,
  getAllReviews,
  deleteReview,
  getCustomerPhotos,
  rejectReview
} = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// ============================================================================
// 🛒 PUBLIC CUSTOMER REVIEW & COMPONENT MEDIA CHANNELS
// ============================================================================

// ⚠️ ROUTING ORDER MATRIX: Static paths like /photos MUST be initialized 
// before generic parameters (/:productId or /:id) to prevent endpoint hijacking.

// FIXED (Issue 1): Mounted the public photos lookup to feed the homepage masonry lookup galleries
router.get('/photos', getCustomerPhotos);

// FIXED (Issue 3): Aliased dynamic root product routes to support frontend component queries
router.get('/:productId', getProductReviews);
router.get('/product/:productId', getProductReviews);

// ============================================================================
// 🔐 PROTECTED CUSTOMER EVALUATION CHANNELS
// ============================================================================

router.post('/', verifyToken, createReview);

// ============================================================================
// 🛠️ ADMINISTRATIVE CONTENT MODERATION CHANNELS
// ============================================================================

router.get('/', verifyToken, requireAdmin, getAllReviews);
router.put('/:id/approve', verifyToken, requireAdmin, approveReview);

// FIXED (Issue 2): Mounted explicit backend rejection pipeline tracking routes
router.put('/:id/reject', verifyToken, requireAdmin, rejectReview);
router.delete('/:id', verifyToken, requireAdmin, deleteReview);

module.exports = router;