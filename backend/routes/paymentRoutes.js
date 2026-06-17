// backend/routes/paymentRoutes.js
const express = require('express');
const { createShiprocketOrder, shiprocketWebhook } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/payment/create-order -> Authenticated user initiates checkout link mapping
router.post('/create-order', verifyToken, createShiprocketOrder);

// @route   POST /api/payment/webhook -> Public logistics background automation webhooks entry point
router.post('/webhook', shiprocketWebhook); 

module.exports = router;