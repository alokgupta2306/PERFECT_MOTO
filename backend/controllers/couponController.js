const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// @desc    Validate a coupon code at checkout
// @route   GET /api/coupons/validate or POST /api/coupons/validate
// @access  Auth
exports.validateCoupon = async (req, res, next) => {
  try {
    // FIXED (Issue 2): Coerces params across body and query strings to safely support GET and POST methods uniformly
    const code = req.body.code || req.query.code;
    const orderTotal = Number(req.body.orderTotal || req.query.orderTotal || 0);

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code parameter is required.' });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: 'This coupon code has expired.' });
    }

    if (orderTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required to use this coupon.`
      });
    }

    // FIXED (Issue 3): Migrated loose .id identifiers over to robust native Mongoose Object IDs
    if (coupon.isFirstOrderOnly) {
      const existingOrder = await Order.findOne({ user: req.user._id, orderStatus: { $ne: 'cancelled' } });
      if (existingOrder) {
        return res.status(400).json({ success: false, message: 'This coupon is valid on your first order only.' });
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = (coupon.discountValue / 100) * orderTotal;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'flat') {
      discountAmount = coupon.discountValue;
    }

    // FIXED (Issue 6): Attaches the complete coupon tracking model schema back to the client context
    return res.status(200).json({
      success: true,
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: Math.round(discountAmount),
      message: `Coupon applied! You save ₹${Math.round(discountAmount).toLocaleString("en-IN")}`,
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin
exports.createCoupon = async (req, res, next) => {
  try {
    if (!req.body.code) {
      return res.status(400).json({ success: false, message: "Coupon alpha token code cannot be left blank." });
    }

    const sanitizedCode = req.body.code.trim().toUpperCase();
    const couponExists = await Coupon.findOne({ code: sanitizedCode });
    if (couponExists) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
    }

    const coupon = await Coupon.create({
      ...req.body,
      code: sanitizedCode
    });

    // FIXED (Issue 1): Standardized direct object response variable mapping
    return res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    
    // FIXED (Issue 1): Standardized collection return array matching keys
    return res.status(200).json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ✅ FIXED (Issue 4): Added the Missing Active Voucher Update / Toggle Handler
// ============================================================================

// @desc    Update/Toggle an existing administrative voucher
// @route   PUT /api/coupons/:id
// @access  Admin
exports.updateCoupon = async (req, res, next) => {
  try {
    if (req.body.code) {
      req.body.code = req.body.code.trim().toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Requested coupon profile not found.' });
    }

    return res.status(200).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }
    return res.status(200).json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (error) {
    next(error);
  }
};