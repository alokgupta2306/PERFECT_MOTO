// backend/routes/loyaltyRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyLoyaltyBalance,
  redeemLoyaltyPointsAtCheckout,
  adminAddPoints
} = require('../controllers/loyaltyController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// ============================================================================
// 🔐 PROTECTED CUSTOMER LOYALTY CHANNELS
// ============================================================================

// GET  /api/loyalty/my     → Retrieve authenticated rider points balance
router.get('/my', verifyToken, getMyLoyaltyBalance);

// POST /api/loyalty/redeem → Deduct loyalty points during active checkout
router.post('/redeem', verifyToken, redeemLoyaltyPointsAtCheckout);

// ============================================================================
// 🛠️ ADMINISTRATIVE ADJUSTMENT CHANNELS
// ============================================================================

// POST /api/loyalty/add    → Legacy endpoint for manual administrative point additions
router.post('/add', verifyToken, requireAdmin, adminAddPoints);

// FIXED (Issue 1): Mounted the direct administrative adjustment routing endpoint to support AdminCustomers.jsx actions
router.post('/admin/adjust', verifyToken, requireAdmin, adminAddPoints);

module.exports = router;