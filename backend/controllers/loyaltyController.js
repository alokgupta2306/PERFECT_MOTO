// backend/controllers/loyaltyController.js
const User = require('../models/User');

/**
 * @desc    Get current user's loyalty points balance and base details
 * @route   GET /api/loyalty/my
 * @access  Private
 */
exports.getMyLoyaltyBalance = async (req, res, next) => {
  try {
    // FIXED (Issue 2): Updated identification query parameters to use standard Mongoose ._id properties natively
    const riderProfile = await User.findById(req.user._id).select('loyaltyPoints name email');

    if (!riderProfile) {
      return res.status(404).json({
        success: false,
        message: "Rider lookup registry returned empty for active session token identity."
      });
    }

    const calculatedLoyaltyPoints = riderProfile.loyaltyPoints || 0;
    // 100 loyalty points = Rs 10 valuation reward (₹0.10 per point multiplier)
    const computedCashValue = Math.floor(calculatedLoyaltyPoints * 0.1);

    // FIXED (Issue 1): Restructured response payload shape to deliver points, cashValue, and history directly
    return res.status(200).json({
      success: true,
      points: calculatedLoyaltyPoints,
      cashValue: computedCashValue,
      history: [], // Framework stub placeholder for localized ledger arrays addition post-launch
      rules: "10 loyalty points accumulated per Rs 100 spent. 100 points matches Rs 10 sustainable store credit."
    });
  } catch (error) {
    // FIXED (Issue 5): Routed runtime exceptions down to the centralized global error-handling interceptor
    next(error);
  }
};

/**
 * @desc    Redeem points at checkout to calculate order pricing reductions
 * @route   POST /api/loyalty/redeem
 * @access  Private
 */
exports.redeemLoyaltyPointsAtCheckout = async (req, res, next) => {
  try {
    // FIXED (Issue 4): De-structured alternative request parameters fields to seamlessly catch "points" tokens passed by LoyaltyPointsPage.jsx
    const { pointsToRedeem, points, currentOrderTotal } = req.body;
    const pointsAmount = Number(pointsToRedeem || points || 0);
    const orderTotalValue = Number(currentOrderTotal || 0);

    if (pointsAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters: Points conversion target must sit above zero bounds."
      });
    }

    // FIXED (Issue 2): Fixed profile matching reference lookup strings
    const riderProfile = await User.findById(req.user._id);
    if (!riderProfile) {
      return res.status(404).json({
        success: false,
        message: "Rider dashboard identity mismatch dropped."
      });
    }

    if ((riderProfile.loyaltyPoints || 0) < pointsAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient asset points balance. Active wallet balance counts: ${riderProfile.loyaltyPoints || 0} points.`
      });
    }

    // 100 points = Rs 10 conversion scale math logic
    const calculatedDiscountAmountValue = Math.floor(pointsAmount * 0.1);

    // Apply safety validation threshold only if checking an active, parsed transaction checkout balance total block
    if (orderTotalValue > 0 && calculatedDiscountAmountValue > orderTotalValue) {
      return res.status(400).json({
        success: false,
        message: "Redemption capped: Discount value properties cannot break past active order total values."
      });
    }

    // Deduct balances out of the primary profile document securely
    riderProfile.loyaltyPoints = Math.max(0, (riderProfile.loyaltyPoints || 0) - pointsAmount);
    await riderProfile.save();

    return res.status(200).json({
      success: true,
      message: `Successfully redeemed ${pointsAmount} points! Applied ₹${calculatedDiscountAmountValue} deduction to active checkout balance tracking lines.`,
      pointsRedeemed: pointsAmount,
      discountApplied: calculatedDiscountAmountValue,
      remainingPointsWalletBalance: riderProfile.loyaltyPoints
    });
  } catch (error) {
    // FIXED (Issue 5): Forwarded thread anomalies to centralized handling stacks
    next(error);
  }
};

/**
 * @desc    Admin manually adds or modifies loyalty points to a user
 * @route   POST /api/loyalty/add or POST /api/loyalty/admin/adjust
 * @access  Admin
 */
exports.adminAddPoints = async (req, res, next) => {
  try {
    const { userId, points, reason } = req.body;
    const numericPoints = Number(points || 0);

    if (!userId || !points) {
      return res.status(400).json({
        success: false,
        message: "userId and delta points fields are required to update wallets."
      });
    }

    // Executes atomic updates while returning fresh document fields directly
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: numericPoints } },
      { new: true, runValidators: true }
    ).select('name email loyaltyPoints');

    if (!user) {
      return res.status(404).json({ success: false, message: "User account database entity reference not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully adjusted wallet by ${numericPoints} points for user ${user.name}${reason ? ` — Reason: ${reason}` : ''}`,
      loyaltyPoints: user.loyaltyPoints
    });
  } catch (error) {
    // FIXED (Issue 5): Error tracking delegation normalization pass
    next(error);
  }
};