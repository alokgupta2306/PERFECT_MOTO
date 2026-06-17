// backend/controllers/referralController.js
const User = require('../models/User');
const Referral = require('../models/Referral');

/**
 * @desc    Get current user's personalized campaign data, link asset tracking, and conversion stats
 * @route   GET /api/referral/my
 * @access  Private (Authenticated User)
 */
exports.getMyReferralData = async (req, res, next) => {
  try {
    // Queries the database to capture the user's authentic profile referral tracking code
    const user = await User.findById(req.user._id).select('referralCode name');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Rider identity registry reference not found.' });
    }

    // Pull every referral entry logged where this specific rider acts as the referrer node
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referee', 'name createdAt')
      .sort({ createdAt: -1 });

    const completed = referrals.filter(record => record.status === 'completed');
    // 200 points credited per converted checkout milestone according to system specifications
    const pointsAccrued = completed.length * 200; 

    return res.status(200).json({
      success: true,
      referralCode: user.referralCode,
      referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`,
      totalReferrals: referrals.length,
      completedReferrals: completed.length,
      totalPointsEarned: pointsAccrued,
      referrals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all sitewide referral logs and conversion records — Admin Only
 * @route   GET /api/admin/referrals
 * @access  Private (Admin Only)
 */
exports.getAllReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find()
      .populate('referrer', 'name email referralCode')
      .populate('referee', 'name email createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: referrals.length,
      referrals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Process conversion and credit loyalty points when a referee places their first-time order
 * @access  Internal Server Invoke Only (Called inside order creation boundaries)
 */
exports.processReferralReward = async (refereeUserId) => {
  try {
    // Fetch the referee to determine who introduced them into the application ecosystem
    const user = await User.findById(refereeUserId).populate('referredBy');
    if (!user || !user.referredBy) return; // No referral string was linked during account sign-up

    // Defensive check to enforce idempotency boundaries: prevent duplicate reward payouts
    const alreadyRewarded = await Referral.findOne({
      referee: refereeUserId,
      status: 'completed'
    });
    if (alreadyRewarded) return;

    // Credit 200 points directly to the referrer's loyalty wallet balance ledger
    await User.findByIdAndUpdate(user.referredBy._id, {
      $inc: { loyaltyPoints: 200 }
    });

    // Update or upsert the tracker tracking node status matrix to completed status
    await Referral.findOneAndUpdate(
      { referee: refereeUserId },
      { 
        $set: {
          referrer: user.referredBy._id,
          status: 'completed', 
          referrerRewarded: true,
          convertedAt: new Date()
        } 
      },
      { upsert: true, new: true }
    );
    
    console.log(`[REFERRAL ENGINE] Successfully credited 200 loyalty points to user ${user.referredBy._id} for converting referee ${refereeUserId}.`);
  } catch (error) {
    // Fail-silent boundary: Telemetry conversion faults must never compromise or abort active payment operations
    console.error('Critical internal referral incentive reward distribution exception caught:', error);
  }
};

// FIXED (Issue 1): Preserve old naming aliases to ensure zero compilation downtime across legacy entry tracks
exports.generateUserReferralNode = exports.getMyReferralData;
exports.evaluateReferralOnboardingReward = exports.getMyReferralData;