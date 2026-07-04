// backend/controllers/paymentController.js
const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Order = require('../models/Order');

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payment/create-order
 * @access  Private
 */
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Security Boundary Control: Enforce strict account ownership checking vectors
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Initialize Razorpay SDK Order Entity
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(order.totalAmount * 100), // Converted cleanly to paise
      currency: 'INR',
      receipt: order.orderNumber
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create payment order.' });
  }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payment/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Cryptographic validation of backend payload keys using strict HMAC hex digest matches
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    const order = await Order.findById(orderId);
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.statusHistory.push({ status: 'confirmed', note: 'Payment verified via Razorpay.' });
    await order.save();

    return res.status(200).json({ success: true, message: 'Payment verified.', order });
  } catch (error) {
    console.error('Payment verification error:', error.message);
    return res.status(500).json({ success: false, message: 'Verification failed.' });
  }
};

/**
 * @desc    Razorpay Webhook — backup verification
 * @route   POST /api/payment/webhook
 * @access  Public
 */
exports.razorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    // Webhook Signature verification checking raw payload blocks before ingestion
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expected) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;

    if (event === 'payment.captured' && paymentEntity) {
      const order = await Order.findOne({ razorpayOrderId: paymentEntity.order_id });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed via webhook.' });
        await order.save();
      }
    } else if (event === 'payment.failed' && paymentEntity) {
      const order = await Order.findOne({ razorpayOrderId: paymentEntity.order_id });
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    next(error);
  }
};