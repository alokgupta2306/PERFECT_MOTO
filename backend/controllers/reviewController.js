const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Submit a product review with optional photo attachments
// @route   POST /api/reviews
// @access  Auth
exports.createReview = async (req, res, next) => {
  try {
    const { product, rating, comment, images } = req.body;

    if (!product || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, star rating, and commentary text are required.' });
    }

    const reviewImages = (images && Array.isArray(images)) ? images.map(img => ({
      url: img.url || img,
      publicId: img.publicId || ''
    })) : [];

    const review = new Review({
      product,
      // FIXED (Issue 2): Standardized lookup key parameters to use native Mongoose user identifiers
      user: req.user._id,
      rating: Number(rating),
      comment,
      images: reviewImages,
      status: 'pending'
    });

    await review.save();

    // FIXED (Issue 1): Standardized response structural keys to plain "review"
    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will go live once verified by our team.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approved customer reviews for a specific product item
// @route   GET /api/reviews/:productId or GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 });

    // FIXED (Issue 1): Standardized response payload key schema property to "reviews"
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews — Admin
// @route   GET /api/reviews
// @access  Admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    // FIXED (Issue 1): Standardized response payload key schema property to "reviews"
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a review and recalculate metrics average — Admin
// @route   PUT /api/reviews/:id/approve
// @access  Admin
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    review.status = 'approved';
    await review.save();

    // Update product ratings average based on freshly filtered approved metrics matrices
    const allApprovedReviews = await Review.find({
      product: review.product,
      status: 'approved'
    });

    const avgRating = allApprovedReviews.length > 0 
      ? allApprovedReviews.reduce((acc, r) => acc + r.rating, 0) / allApprovedReviews.length
      : review.rating;

    await Product.findByIdAndUpdate(review.product, {
      $set: {
        'ratings.average': Math.round(avgRating * 10) / 10,
        'ratings.count': allApprovedReviews.length
      }
    });

    // FIXED (Issue 1): Unified direct payload response references
    return res.status(200).json({
      success: true,
      message: 'Review approved and now live on product page.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review — Admin
// @route   DELETE /api/reviews/:id
// @access  Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ✅ FIXED (Issue 4): Added Customer Review Media Feed Extraction Handler
// ============================================================================

// @desc    Retrieve approved reviews containing image arrays to populate galleries
// @route   GET /api/reviews/photos
// @access  Public
exports.getCustomerPhotos = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    // Looks up approved logs that contain at least one valid index media asset attachment link
    const reviewsWithImages = await Review.find({
      status: 'approved',
      'images.0': { $exists: true }
    })
      .populate('user', 'name')
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ 
      success: true, 
      photos: reviewsWithImages 
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ✅ FIXED (Issue 5): Added Administrative Content Rejection Handler
// ============================================================================

// @desc    Mark a submitted review as rejected/hidden — Admin
// @route   PUT /api/reviews/:id/reject
// @access  Admin
exports.rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'rejected' } },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review validation reference not found.' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Review rejected and excluded from public catalog feeds.', 
      review 
    });
  } catch (error) {
    next(error);
  }
};