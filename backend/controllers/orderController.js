// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); 
const generateOrderNumber = require('../utils/generateOrderNumber');

// Sourced transaction email functions to bridge background admin alerts
const {
  sendOrderConfirmedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail
} = require('../utils/email');

// @desc    Create a new transaction order with thread-safe stock deduction checks
// @route   POST /api/orders
// @access  Auth
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty' });
    }

    let itemsTotal = 0;
    const validatedItems = [];

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product reference not found: ${cartItem.product}` });
      }

      const priceToCharge = product.salePrice && (!product.saleEndDate || product.saleEndDate > new Date())
        ? product.salePrice
        : product.price;

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: cartItem.product, stock: { $gte: cartItem.quantity }, status: 'active' },
        { $inc: { stock: -cartItem.quantity } },
        { returnDocument: 'after' }
      );

      if (!updatedProduct) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock or item deactivated for accessory: ${product.name}. Available items left: ${product.stock}`
        });
      }

      if (updatedProduct.stock === 0) {
        updatedProduct.status = 'out_of_stock';
        await updatedProduct.save();
      }

      itemsTotal += priceToCharge * cartItem.quantity;
      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images.find(img => img.isMain)?.url || product.images[0]?.url || '',
        price: priceToCharge,
        quantity: cartItem.quantity
      });
    }

    // Free shipping baseline updated to ₹50 per platform specs
    const shippingCharge = itemsTotal >= 999 ? 0 : 50;
    const discount = 0;
    
    // GST is already natively included in unit pricing thresholds. Set to 0 to prevent inflation.
    const gstAmount = 0; 
    const totalAmount = itemsTotal + shippingCharge - discount;

    const orderNumber = await generateOrderNumber();

    const order = new Order({
      user: req.user._id,
      orderNumber,
      items: validatedItems,
      shippingAddress,
      paymentMethod, // Inherits hardcoded prepaid 'shiprocket' parameter mapping
      paymentStatus: 'pending',
      orderStatus: 'placed',
      itemsTotal,
      shippingCharge,
      discount,
      gstAmount,
      totalAmount,
      statusHistory: [{ status: 'placed', note: 'Order successfully created via checkout gateway' }]
    });

    await order.save();

    // Loyalty Engine integration calculates and credits points on checkout conversion
    const pointsEarned = Math.floor(itemsTotal / 100) * 10; // Earns 10 points for every ₹100 spent
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { loyaltyPoints: pointsEarned }
    });
    
    order.loyaltyPointsEarned = pointsEarned;
    await order.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders history list
// @route   GET /api/orders/my
// @access  Auth
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Auth
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Auth
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order after it has been shipped.' });
    }

    // Restore stock for each item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });
    await order.save();

    try {
      await sendOrderCancelledEmail(order);
    } catch (emailErr) {
      console.error('Asynchronous background template error tracking caught:', emailErr);
    }

    return res.status(200).json({ success: true, message: 'Order cancelled successfully.', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Return request
// @route   PUT /api/orders/:id/return-request
// @access  Auth
exports.returnRequest = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Return request only allowed for delivered orders.' });
    }

    order.orderStatus = 'return_requested';
    order.statusHistory.push({ status: 'return_requested', note: 'Return requested by customer' });
    await order.save();

    return res.status(200).json({ success: true, message: 'Return request submitted.', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders — Admin
// @route   GET /api/orders
// @access  Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.orderStatus = status;

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit))
      .populate('user', 'name email phone');

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status — Admin
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber, trackingUrl, awbCode, note } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // 🔥 FIX: Normalize status casing string to prevent structural matching bypasses
    const normalizedStatus = orderStatus ? orderStatus.trim().toLowerCase() : order.orderStatus;
    order.orderStatus = normalizedStatus;

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (awbCode) order.awbCode = awbCode; 

    order.statusHistory.push({
      status: normalizedStatus,
      note: note || `Status updated to ${normalizedStatus} by admin`
    });

    await order.save();

    // 🔥 CORE DISPATCH PIPELINE: Handles case-insensitive matches cleanly
    try {
      if (normalizedStatus === 'confirmed') {
        console.log(`[SMTP Trigger] Deserializing template parameters for confirmation mail to: ${order.user?.email}`);
        await sendOrderConfirmedEmail(order);
      } else if (normalizedStatus === 'shipped') {
        console.log(`[SMTP Trigger] Deserializing template parameters for shipment mail to: ${order.user?.email}`);
        await sendOrderShippedEmail(order);
      } else if (normalizedStatus === 'delivered') {
        console.log(`[SMTP Trigger] Deserializing template parameters for delivery mail to: ${order.user?.email}`);
        await sendOrderDeliveredEmail(order);
      } else if (normalizedStatus === 'cancelled') {
        console.log(`[SMTP Trigger] Deserializing template parameters for cancellation mail to: ${order.user?.email}`);
        await sendOrderCancelledEmail(order);
      }
    } catch (emailTriggerErr) {
      console.error('⚠️ Logistics Email Engine Notification Interception Fault:', emailTriggerErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${normalizedStatus}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order metrics log parameters for guest context users
// @route   GET /api/track
// @access  Public
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, phone } = req.query;

    if (!orderNumber || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide both an order number and mobile phone reference.' });
    }

    const order = await Order.findOne({ orderNumber: orderNumber.trim().toUpperCase() });
    
    if (!order || order.shippingAddress?.phone?.slice(-10) !== phone.trim().slice(-10)) {
      return res.status(404).json({ success: false, message: 'Order tracking log not found or mobile number mismatch.' });
    }

    return res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        awbCode: order.awbCode, 
        estimatedDelivery: order.estimatedDelivery,
        statusHistory: order.statusHistory,
        items: order.items,
        itemsTotal: order.itemsTotal,
        shippingCharge: order.shippingCharge,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    next(error);
  }
};