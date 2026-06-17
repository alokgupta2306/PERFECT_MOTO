const Order = require('../models/Order');

/**
 * @desc    Track order shipment delivery stages dynamically without logging in
 * @route   GET /api/track (or /api/orders/track)
 * @access  Public
 */
exports.trackOrderWithoutLogin = async (req, res, next) => {
  try {
    // FIXED (Issue 2): Extracted configuration metrics from req.query since the channel uses HTTP GET
    const { orderNumber, phone } = req.query;

    if (!orderNumber || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order identification tracking number and phone parameters are required.' 
      });
    }

    const order = await Order.findOne({ orderNumber: orderNumber.trim().toUpperCase() });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'No matching transaction records found for the provided Order Number.' 
      });
    }

    // Defensive phone normalization step matching the strict 10-digit spec requirements
    const storedPhoneTail = order.shippingAddress.phone.replace(/\D/g, '').slice(-10);
    const incomingPhoneTail = phone.replace(/\D/g, '').slice(-10);

    // Keep error messages generic on security mismatches to prevent database string sniffing
    if (storedPhoneTail !== incomingPhoneTail) {
      return res.status(404).json({ 
        success: false, 
        message: 'No matching transaction records found for the provided details.' 
      });
    }

    // FIXED (Issue 3): Replaced static order creation dates with a 5-day estimated logistical offset window
    const creationTimestamp = new Date(order.createdAt);
    creationTimestamp.setDate(creationTimestamp.getDate() + 5);
    const calculatedDeliveryDate = creationTimestamp.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const optimizedTrackingPayload = {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber || null,
      trackingUrl: order.trackingUrl || null,
      estimatedDelivery: calculatedDeliveryDate, // FIXED (Issue 3): Yields calculated delivery estimate
      statusHistory: order.statusHistory || [],
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image
      }))
    };

    // FIXED (Issue 1): Swapped out generic "data" envelope key for an explicit "order" object 
    // to match requirements expected by the TrackOrder.jsx layout page variables
    return res.status(200).json({
      success: true,
      order: optimizedTrackingPayload
    });
  } catch (error) {
    next(error);
  }
};