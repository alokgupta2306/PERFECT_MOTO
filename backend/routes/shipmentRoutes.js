// backend/routes/shipmentRoutes.js
const express = require('express');
const { createShipment, shiprocketWebhook } = require('../controllers/shipmentController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/shipment/create -> Admin triggers shipment creation for a paid order
router.post('/create', verifyToken, requireAdmin, createShipment);

// @route   POST /api/shipment/webhook -> Public, Shiprocket tracking status webhook
router.post('/webhook', shiprocketWebhook);

module.exports = router;