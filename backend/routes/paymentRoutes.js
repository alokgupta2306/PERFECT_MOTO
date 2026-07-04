// backend/routes/paymentRoutes.js
const express = require('express');
const { createRazorpayOrder, verifyPayment, razorpayWebhook } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/payment/create-order -> Authenticated user creates Razorpay order
router.post('/create-order', verifyToken, createRazorpayOrder);

// @route   POST /api/payment/verify -> Authenticated user verifies payment signature
router.post('/verify', verifyToken, verifyPayment);

// @route   POST /api/payment/webhook -> Public, Razorpay server-to-server webhook
router.post('/webhook', razorpayWebhook);

module.exports = router;