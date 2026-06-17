const Order = require('../models/Order');

// In-Memory Volatile Cache State Structs for High-Volume Storefront Throttling
let activityCache = null;
let cacheTimestamp = null;
const CACHE_TTL_MS = 30000; // 30-Second Time-To-Live Windows Optimization Buffer

/**
 * @desc    Retrieve real recent order data logs to feed the live social proof notification popups
 * @route   GET /api/activity/recent
 * @access  Public
 */
exports.getRecentActivity = async (req, res, next) => {
  try {
    const currentTime = Date.now();

    // FIXED (Issue 3): Intercept and serve via memory reference instantly if within TTL bounds
    if (activityCache && cacheTimestamp && (currentTime - cacheTimestamp < CACHE_TTL_MS)) {
      // FIXED (Issue 1): Standardized matching response parameter payload key back to "activities"
      return res.status(200).json({
        success: true,
        activities: activityCache
      });
    }

    // Cache cold or invalid: Fetch the last 10 real orders processed by the network engine
    const recentOrders = await Order.find({ orderStatus: { $ne: 'cancelled' } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('items.product', 'name');

    const activityFeed = recentOrders.map(order => {
      // Split name parameters to enforce data privacy compliance regulations (First name only)
      const firstName = order.shippingAddress?.fullName 
        ? order.shippingAddress.fullName.split(' ')[0] 
        : 'Rider';
        
      const city = order.shippingAddress?.city || 'India';
      
      // Select the primary ordered item to feature safely
      const primaryItemName = order.items[0]?.name || 'Premium Riding Gear';

      return {
        customerName: firstName,
        customerCity: city,
        productName: primaryItemName,
        action: 'purchased',
        createdAt: order.createdAt
      };
    });

    // Hydrate local cache properties before handing down the context payloads
    activityCache = activityFeed;
    cacheTimestamp = currentTime;

    // FIXED (Issue 1): Standardized matching response parameter payload key back to "activities"
    return res.status(200).json({
      success: true,
      activities: activityFeed
    });
  } catch (error) {
    // Forward transaction pipeline block errors to centralized interceptors cleanly
    next(error);
  }
};