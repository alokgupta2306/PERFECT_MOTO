const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get top-level dashboard overview metrics and statistics
// @route   GET /api/admin/stats
// @access  Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // FIXED (Issue 2): Added active chronological query constraint selectors mapping off the request parameters
    const { timeframe } = req.query;
    const timeframeMap = { '24h': 1, '7d': 7, '30d': 30 };
    const targetedDays = timeframeMap[timeframe] || 7;
    const analyticsStartDate = new Date(Date.now() - targetedDays * 24 * 60 * 60 * 1000);

    const [totalProducts, totalCustomers, totalOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments({ createdAt: { $gte: analyticsStartDate } })
    ]);

    const revenueAggregation = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'cancelled' },
          paymentStatus: { $in: ['paid', 'pending'] },
          // FIXED (Issue 2): Filters transactional income aggregations to respect targeted dashboard timelines
          createdAt: { $gte: analyticsStartDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // FIXED (Issue 1): Stripped out the raw data wrapper object layer to serve clean parameters directly to front-facing layouts
    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers
      },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get smart restock suggestions
// @route   GET /api/admin/restock-suggestions
// @access  Admin
exports.getRestockSuggestions = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.find({
      $or: [
        { stock: 0 },
        { $expr: { $lte: ['$stock', '$lowStockAlert'] } }
      ],
      status: { $ne: 'draft' }
    });

    const suggestions = [];

    for (const product of lowStockProducts) {
      if (product.lastRestockDate) {
        const daysSinceRestock = (new Date() - new Date(product.lastRestockDate)) / (1000 * 60 * 60 * 24);
        if (daysSinceRestock < 7) continue;
      }

      const salesAgg = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
            orderStatus: { $ne: 'cancelled' }
          }
        },
        { $unwind: '$items' },
        { $match: { 'items.product': product._id } },
        { $group: { _id: null, totalSold: { $sum: '$items.quantity' } } }
      ]);

      const totalSold = salesAgg.length > 0 ? salesAgg[0].totalSold : 0;
      const weeklyAvgSales = Math.round(totalSold / 4);
      const suggestedOrderQty = weeklyAvgSales * 4 || 10;

      suggestions.push({
        _id: product._id,
        name: product.name,
        brand: product.brand,
        currentStock: product.stock,
        lowStockAlert: product.lowStockAlert,
        weeklyAvgSales,
        suggestedOrderQty,
        isOutOfStock: product.stock === 0
      });
    }

    suggestions.sort((a, b) => {
      if (a.isOutOfStock && !b.isOutOfStock) return -1;
      if (!a.isOutOfStock && b.isOutOfStock) return 1;
      return b.weeklyAvgSales - a.weeklyAvgSales;
    });

    return res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark product as ordered — snooze restock alert 7 days
// @route   PUT /api/admin/products/:id/mark-ordered
// @access  Admin
exports.markOrdered = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { lastRestockDate: new Date() } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product marked as ordered. Restock alert snoozed for 7 days.',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Admin
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = {
      orderStatus: { $ne: 'cancelled' }
    };

    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const dailySales = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 }
    ]);

    const topProducts = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    const summary = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary: summary[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        dailySales,
        topProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Admin
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    // FIXED (Issue 1): Standardized collection return variable directly to "customers" parameter key
    return res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or unblock a customer
// @route   PUT /api/admin/users/:id/block
// @access  Admin
exports.blockUnblockCustomer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully.`,
      data: { isActive: user.isActive }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders of a specific customer
// @route   GET /api/admin/users/:id/orders
// @access  Admin
exports.getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ✅ FIXED (Issue 4): Added Missing Loyalty Points Ledger Adjustment Controller
// ============================================================================

// @desc    Manually modify a user's loyalty ledger account point score balances — Admin
// @route   POST /api/admin/loyalty/adjust
// @access  Admin
exports.adjustCustomerLoyaltyPoints = async (req, res, next) => {
  try {
    const { userId, points } = req.body;

    if (!userId || points === undefined) {
      return res.status(400).json({ success: false, message: 'User identification string and delta point value are required.' });
    }

    // Direct atomic mathematical modification execution
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: Number(points) } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Target customer account not found.' });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Customer wallet adjusted by ${points} points. New ledger total: ${user.loyaltyPoints}`,
      loyaltyPoints: user.loyaltyPoints 
    });
  } catch (error) {
    next(error);
  }
};