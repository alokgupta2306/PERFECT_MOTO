// backend/controllers/shipmentController.js
const axios = require('axios');
const Order = require('../models/Order');

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

/**
 * Fetches an authenticated bearer token from Shiprocket.
 * Token remains valid up to 10 days.
 */
const getShiprocketAuthToken = async () => {
  try {
    const payload = {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    };

    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.token) {
      return response.data.token;
    }
    throw new Error('Token missing from Shiprocket auth response.');
  } catch (error) {
    console.error('Shiprocket login failed:', error.message);
    throw new Error(`Shiprocket auth failed: ${error.message}`);
  }
};

/**
 * @desc    Create Shiprocket shipment for a PAID order (logistics only, no payment)
 * @route   POST /api/shipment/create
 * @access  Admin
 */
const createShipment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    // Deep populate user email and items product dimension metadata fields
    const order = await Order.findById(orderId)
      .populate('user', 'email')
      .populate('items.product', 'weight dimensions');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Guard: only ship orders that are actually paid[cite: 1]
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'Cannot ship an unpaid order.' });
    }

    // Aggregate real product weight and dimensions across all items in the order.
    // Weight sums up (heavier order = heavier package).
    // Length/Width take the largest single item (assumes items packed side-by-side).
    // Height sums up (assumes items stacked in one box) — reasonable approximation for a single shipment box.
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    order.items.forEach((item) => {
      const productData = item.product || {};
      const itemWeight = Number(productData.weight) || 0.5; // fallback if missing
      const dims = productData.dimensions || {};
      const itemLength = Number(dims.length) || 10;
      const itemWidth = Number(dims.width) || 10;
      const itemHeight = Number(dims.height) || 10;

      totalWeight += itemWeight * item.quantity;
      maxLength = Math.max(maxLength, itemLength);
      maxWidth = Math.max(maxWidth, itemWidth);
      totalHeight += itemHeight * item.quantity;
    });

    // Safety floor — Shiprocket rejects zero/near-zero values
    totalWeight = totalWeight > 0 ? totalWeight : 1;
    maxLength = maxLength > 0 ? maxLength : 10;
    maxWidth = maxWidth > 0 ? maxWidth : 10;
    totalHeight = totalHeight > 0 ? totalHeight : 10;

    const authToken = await getShiprocketAuthToken();

    const shiprocketOrderPayload = {
      order_id: order.orderNumber,
      order_date: new Date(order.createdAt).toISOString().slice(0, 10),
      pickup_location: "Primary Warehouse Hub",
      channel_id: process.env.SHIPROCKET_CHANNEL_ID,
      billing_customer_name: order.shippingAddress.fullName.split(' ')[0] || "Customer",
      billing_last_name: order.shippingAddress.fullName.split(' ').slice(1).join(' ') || "Rider",
      billing_address: order.shippingAddress.addressLine1,
      billing_address_2: order.shippingAddress.addressLine2 || "",
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: order.user.email,
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.name,
        sku: item.product._id.toString(),
        units: item.quantity,
        selling_price: item.price
      })),
      payment_method: "Prepaid", // Already paid via Razorpay
      sub_total: order.totalAmount,
      length: maxLength,
      width: maxWidth,
      height: totalHeight,
      weight: totalWeight
    };

    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
      shiprocketOrderPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    const gatewayData = response.data;

    if (!gatewayData || !gatewayData.order_id) {
      return res.status(400).json({ success: false, message: 'Shiprocket rejected shipment creation.' });
    }

    order.shiprocketOrderId = gatewayData.order_id;
    order.shiprocketShipmentId = gatewayData.shipment_id;
    order.orderStatus = 'shipped';
    order.statusHistory.push({ status: 'shipped', note: 'Shipment created via Shiprocket.' });
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Shipment created successfully.',
      shiprocketOrderId: gatewayData.order_id,
      shiprocketShipmentId: gatewayData.shipment_id
    });

  } catch (error) {
    console.error('Shipment creation failed:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create shipment.',
      error: error.response?.data || error.message
    });
  }
};

/**
 * @desc    Shiprocket webhook — tracking updates only (AWB, delivery status)
 * @route   POST /api/shipment/webhook
 * @access  Public
 */
const shiprocketWebhook = async (req, res, next) => {
  try {
    const { awb, order_id, status } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: 'Missing order identifier.' });
    }

    const order = await Order.findOne({ shiprocketOrderId: order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (awb) order.awbCode = awb;

    const normalizedStatus = status?.toString().toLowerCase();

    if (normalizedStatus === 'delivered') {
      order.orderStatus = 'delivered';
      order.statusHistory.push({ status: 'delivered', note: 'Delivered — confirmed via Shiprocket webhook.' });
    } else if (normalizedStatus === 'out for delivery') {
      order.orderStatus = 'out_for_delivery';
      order.statusHistory.push({ status: 'out_for_delivery', note: 'Out for delivery.' });
    } else if (normalizedStatus === 'rto' || normalizedStatus === 'canceled') {
      order.statusHistory.push({ status: order.orderStatus, note: `Shipment issue: ${normalizedStatus}` });
    }

    await order.save();
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Shiprocket webhook error:', error.message);
    next(error);
  }
};

// Explicit named export configurations to satisfy routing map destructuring requirements
module.exports = {
  createShipment,
  shiprocketWebhook
};