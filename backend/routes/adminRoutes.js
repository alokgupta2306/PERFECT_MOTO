const express = require('express');
const {
  getDashboardStats,
  getRestockSuggestions,
  markOrdered,
  getSalesReport,
  getAllCustomers,
  blockUnblockCustomer,
  getCustomerOrders
} = require('../controllers/adminController');

// FIXED (Issue 2 & Issue 3): Sourced secondary handlers from referral and loyalty subsystems
const referralController = require('../controllers/referralController');
const { adminAddPoints } = require('../controllers/loyaltyController');

const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// ============================================================================
// 📊 ADMINISTRATIVE METRICS & PROCUREMENT REPORTS
// ============================================================================

router.get('/stats', verifyToken, requireAdmin, getDashboardStats);
router.get('/restock-suggestions', verifyToken, requireAdmin, getRestockSuggestions);
router.put('/products/:id/mark-ordered', verifyToken, requireAdmin, markOrdered);
router.get('/reports/sales', verifyToken, requireAdmin, getSalesReport);

// ============================================================================
// 👥 CUSTOMER RELATIONSHIP MANAGEMENT (CRM) OPERATIONS
// ============================================================================

router.get('/users', verifyToken, requireAdmin, getAllCustomers);

// FIXED (Issue 1): Added the restful /customers route alias expected by the AdminCustomers.jsx component
router.get('/customers', verifyToken, requireAdmin, getAllCustomers);

router.put('/users/:id/block', verifyToken, requireAdmin, blockUnblockCustomer);
router.get('/users/:id/orders', verifyToken, requireAdmin, getCustomerOrders);

// ============================================================================
// 🎁 SITERS REWARDS, AFFILIATIONS & MARKETING LEDGERS
// ============================================================================

// FIXED (Issue 2): Mounted cross-system referrals log query listener to feed growth metrics tables
router.get('/referrals', verifyToken, requireAdmin, referralController.getAllReferrals);

// FIXED (Issue 3): Mounted loyalty override ledger endpoint to accept direct adjustments from user grids
router.post('/loyalty/adjust', verifyToken, requireAdmin, adminAddPoints);

module.exports = router;