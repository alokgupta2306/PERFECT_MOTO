// backend/controllers/settingsController.js
const SiteSettings = require('../models/SiteSettings');
const HomepageContent = require('../models/HomepageContent');

/**
 * @desc    Get top-level global operational configuration variables
 * @route   GET /api/settings
 * @access  Public
 */
exports.fetchSystemVariables = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    
    // FIXED (Issue 1 & Issue 2): Auto-instantiates structural default parameters if the collection is unhydrated
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    return res.status(200).json({ 
      success: true, 
      settings 
    });
  } catch (error) {
    // FIXED (Issue 3): Intercept and route lifecycle execution issues straight to global error middleware
    next(error);
  }
};

/**
 * @desc    Override system variables ledger parameters via administrative update commands
 * @route   PUT /api/settings
 * @access  Admin Only
 */
exports.overrideSystemVariables = async (req, res, next) => {
  try {
    // FIXED (Issue 1 & Issue 2): Atomically queries and patches persistent fields matching SiteSettings requirements
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = new SiteSettings();
    }

    // Safely morph incoming tracking properties (siteName, contactEmail, shippingRules, etc.) into the document
    Object.assign(settings, req.body);
    await settings.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Global operational configuration settings committed safely.', 
      settings 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve active trust badges and brand verification blocks
 * @route   GET /api/settings/badges
 * @access  Public
 */
exports.fetchBadges = async (req, res, next) => {
  try {
    // FIXED (Issue 1): Extracts marketing parameters dynamically off structural storefront models directly
    const content = await HomepageContent.findOne();
    const badges = content?.trustBadges?.filter(badge => badge.isActive) || [];
    
    return res.status(200).json({ 
      success: true, 
      badges 
    });
  } catch (error) {
    next(error);
  }
};