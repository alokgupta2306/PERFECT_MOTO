const express = require('express');
// FIXED (Issue 1): Imported the centralized global waitlist retrieval controller method
const {
  addToWaitlist,
  getWaitlist,
  sendNotifications,
  getAllWaitlist
} = require('../controllers/notifyMeController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// FIXED (Issue 2): Sourced the standard pre-configured rate limiter middleware to avoid redundancy
const { notifyMeLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// ============================================================================
// 🛒 PUBLIC CUSTOMER WAITLIST SIGN-UP CHANNELS
// ============================================================================

// FIXED (Issue 2): Attached the unified notifyMeLimiter to safeguard notification subsystems from automated spamming bots
router.post('/', notifyMeLimiter, addToWaitlist);

// ============================================================================
// 🛠️ ADMINISTRATIVE BACK-OFFICE OPERATIONS CHANNELS
// ============================================================================

// FIXED (Issue 1): Mounted global inventory telemetry route to feed the back-office waitlist monitoring panel
router.get('/', verifyToken, requireAdmin, getAllWaitlist);

router.get('/product/:productId', verifyToken, requireAdmin, getWaitlist);
router.post('/send/:productId', verifyToken, requireAdmin, sendNotifications);

module.exports = router;