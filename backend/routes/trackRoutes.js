const express = require('express');
const rateLimit = require('express-rate-limit');
const { trackOrderWithoutLogin } = require('../controllers/trackController');

const router = express.Router();

// Specific, high-security rate limiter to protect anonymous order lookup pipelines from brute-force scripts
const trackingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1-Hour sliding window
  max: 10, // Strict max of 10 dynamic checks per hour per IP footprint
  message: { success: false, message: 'Tracking lookup threshold reached. Please try again in an hour.' }
});

// ============================================================================
// 📦 PUBLIC ANONYMOUS ORDER SELECTION & DELIVERY TRACKING CHANNELS
// ============================================================================

// FIXED (Issue 1): Swapped out the POST verb for a RESTful read-only GET handler 
// to instantly align with public parameter lookups issued by TrackOrder.jsx
router.get('/', trackingLimiter, trackOrderWithoutLogin);

module.exports = router;