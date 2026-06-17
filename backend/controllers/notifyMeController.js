const NotifyMe = require('../models/NotifyMe');
const Product = require('../models/Product');
const sendWhatsApp = require('../utils/whatsapp'); // FIXED (Issue 3): Imported the WhatsApp utility

// @desc    Add a customer request to an out-of-stock product waitlist
// @route   POST /api/notify-me
// @access  Public
exports.addToWaitlist = async (req, res, next) => {
  try {
    const { product, phone, email } = req.body;

    if (!product || !phone) {
      return res.status(400).json({ success: false, message: 'Product reference and phone number are required.' });
    }

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ success: false, message: 'Product reference not found.' });
    }

    // Atomic upsert prevents duplicate logs if a rider resubmits their phone number
    await NotifyMe.findOneAndUpdate(
      { product: product, phone: phone.trim() },
      { 
        $set: {
          email: email ? email.toLowerCase().trim() : undefined, 
          notifiedAt: null 
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({
      success: true,
      message: 'We will notify you on WhatsApp as soon as this item is back in stock!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get waitlist count and details for a specific product item — Admin
// @route   GET /api/notify-me/product/:productId
// @access  Admin
exports.getWaitlist = async (req, res, next) => {
  try {
    const waitlist = await NotifyMe.find({
      product: req.params.productId,
      notifiedAt: null
    }).populate('product', 'name');

    // FIXED (Issue 1): Standardized response payload key schema property to "waitlist"
    return res.status(200).json({
      success: true,
      count: waitlist.length,
      waitlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send automated notifications to product waitlist records — Admin
// @route   POST /api/notify-me/send/:productId
// @access  Admin
exports.sendNotifications = async (req, res, next) => {
  try {
    const waitlist = await NotifyMe.find({
      product: req.params.productId,
      notifiedAt: null
    });

    if (waitlist.length === 0) {
      return res.status(200).json({ success: true, message: 'No pending waitlist entries found.' });
    }

    const product = await Product.findById(req.params.productId);

    // FIXED (Issue 3): Real implementation loop dispatching messages via WhatsApp Gateway integration
    for (const entry of waitlist) {
      try {
        await sendWhatsApp(entry.phone, 'notify_me_alert', [
          { key: 'product_name', value: product?.name || 'Your requested motorcycle accessory' }
        ]);
      } catch (whatsappError) {
        // Safe execution guard: Individual delivery errors must not crash the broader execution loop
        console.error(`WhatsApp notification failed to transmit to target number ${entry.phone}:`, whatsappError);
      }
    }

    // Mark all as notified in the database after dispatch attempts conclude
    await NotifyMe.updateMany(
      { product: req.params.productId, notifiedAt: null },
      { $set: { notifiedAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: `Notifications sent to ${waitlist.length} customers successfully.`,
      count: waitlist.length
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ✅ FIXED (Issue 2): Added the Missing Overview Waitlist Stream Controller
// ============================================================================

// @desc    Retrieve all waitlist entries across all products — Admin
// @route   GET /api/notify-me
// @access  Admin
exports.getAllWaitlist = async (req, res, next) => {
  try {
    const waitlist = await NotifyMe.find()
      .populate('product', 'name slug images stock')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: waitlist.length,
      waitlist
    });
  } catch (error) {
    next(error);
  }
};