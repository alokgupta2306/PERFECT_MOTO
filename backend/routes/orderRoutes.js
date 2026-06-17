const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  returnRequest,
  getAllOrders,
  updateOrderStatus,
  trackOrder // FIXED (Issue 4): Imported the public tracking controller method
} = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// FIXED (Issue 3): Sourced the standard network order creation rate limiter middleware
const { orderLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// ============================================================================
// 🛒 PROTECTED CUSTOMER TRANSACTION & HISTORY ROUTES
// ============================================================================

// ⚠️ ORDER OF EXECUTION NOTICE: Static paths like /my and /track MUST be initialized 
// before dynamic parameter endpoints (/:id) to prevent parameter string hijacking.

// FIXED (Issue 3): Applied orderLimiter to safeguard checkout streams from automation bots
router.post('/', verifyToken, orderLimiter, createOrder);
router.get('/my', verifyToken, getMyOrders);

// FIXED (Issue 4): Mounted the public tracker endpoint directly under the storefront's expected API signature path
router.get('/track', trackOrder);

router.get('/:id', verifyToken, getOrderById);
router.put('/:id/cancel', verifyToken, cancelOrder);
router.put('/:id/return-request', verifyToken, returnRequest);

// ============================================================================
// 🛠️ PROTECTED ADMINISTRATIVE ORDER MANAGEMENT ROUTES
// ============================================================================

router.get('/', verifyToken, requireAdmin, getAllOrders);
router.put('/:id/status', verifyToken, requireAdmin, updateOrderStatus);

module.exports = router;