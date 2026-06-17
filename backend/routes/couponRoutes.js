const express = require('express');
const {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon // FIXED (Issue 2): Imported the status toggle controller method
} = require('../controllers/couponController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// ============================================================================
// 🛒 PUBLIC CUSTOMER ACCESS CHANNELS
// ============================================================================

// ⚠️ DETERMINISTIC PATH NOTE: Specific sub-routes like /validate MUST be initialized 
// before dynamic parameter fields (/:id) to prevent parameter hijacking.

// FIXED (Issue 1): Swapped out the POST verb for a RESTful GET lookup to synchronize with CartContext.jsx actions
router.get('/validate', verifyToken, validateCoupon);

// ============================================================================
// 🛠️ ADMINISTRATIVE VOUCHER CONTROL PANEL CHANNELS
// ============================================================================

router.post('/', verifyToken, requireAdmin, createCoupon);
router.get('/', verifyToken, requireAdmin, getAllCoupons);

// FIXED (Issue 2): Mounted the administrative PUT endpoint to enable live status / validation overrides
router.put('/:id', verifyToken, requireAdmin, updateCoupon);
router.delete('/:id', verifyToken, requireAdmin, deleteCoupon);

module.exports = router;