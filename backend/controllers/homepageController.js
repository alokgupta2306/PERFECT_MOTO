// backend/controllers/homepageController.js
const HomepageContent = require('../models/HomepageContent');

/**
 * @desc    Get all active homepage banners, announcements, and featured blocks
 * @route   GET /api/homepage
 * @access  Public
 */
// FIXED (Issue 4): Appended missing next argument to function signature parameters mapping matrix
exports.getHomepageContent = async (req, res, next) => {
  try {
    // Fetch configuration document and populate the product relation objects arrays
    let content = await HomepageContent.findOne().populate('featuredProducts');
    
    // Create a fallback default configuration tracking framework if the document is uninstantiated
    if (!content) {
      content = await HomepageContent.create({
        announcementText: "WELCOME TO THE UPGRADE RUSH! USE CODE WELCOME10 FOR A 10% DISCOUNT ON YOUR INTAKE MODS!",
        announcementBgColor: "#FFB800",
        heroBanners: [
          {
            image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200",
            title: "PREMIUM RACING COMPONENT UPGRADES",
            subtitle: "Hand-Built By Riders For Indian Track Operations",
            buttonText: "SHOP CATALOG",
            link: "/marketplace",
            isActive: true
          }
        ],
        featuredProducts: []
      });
    }

    // Filter banners down to only dynamically active nodes that fall into today's timeline scope
    const now = new Date();
    const activeBannersFiltered = content.heroBanners.filter(banner => {
      if (!banner.isActive) return false;
      const startCheck = banner.validFrom ? new Date(banner.validFrom) <= now : true;
      const endCheck = banner.validTo ? new Date(banner.validTo) >= now : true;
      return startCheck && endCheck;
    });

    // FIXED (Issue 1): Consolidated layout payload primitives into a unified "content" tracking object matching UI components
    return res.status(200).json({
      success: true,
      content: {
        announcementText: content.announcementText,
        announcementBgColor: content.announcementBgColor,
        heroBanners: activeBannersFiltered,
        featuredProducts: content.featuredProducts,
        trustBadges: content.trustBadges || []
      }
    });
  } catch (error) {
    // FIXED (Issue 3): Excised console logs and routed exceptions down to global centralized interceptors
    next(error);
  }
};

/**
 * @desc    Update homepage banners scheduling and informational layouts
 * @route   PUT /api/homepage
 * @access  Private (Admin Only)
 */
// FIXED (Issue 4): Appended missing next argument to function signature parameters mapping matrix
exports.updateHomepageContent = async (req, res, next) => {
  try {
    const { announcementText, announcementBgColor, heroBanners, featuredProducts, trustBadges } = req.body;

    let content = await HomepageContent.findOne();
    if (!content) {
      content = new HomepageContent();
    }

    // Apply administrative modifications dynamically
    if (announcementText !== undefined) content.announcementText = announcementText;
    if (announcementBgColor !== undefined) content.announcementBgColor = announcementBgColor;
    if (heroBanners !== undefined) content.heroBanners = heroBanners;
    if (featuredProducts !== undefined) content.featuredProducts = featuredProducts;
    if (trustBadges !== undefined) content.trustBadges = trustBadges;

    await content.save();

    // FIXED (Issue 1 & Issue 2): Standardized response envelope to "content" and scrubbed raw bracket citation strings
    return res.status(200).json({
      success: true,
      message: "Homepage content updated successfully.",
      content
    });
  } catch (error) {
    // FIXED (Issue 3): Excised console logs and routed exceptions down to global centralized interceptors
    next(error);
  }
};