const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');

// @desc    Get filtered products with pagination and bike verification lookups
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, brand, minPrice, maxPrice, search, bikeBrand, bikeModel, bikeYear, sort, page = 1, limit = 20 } = req.query;
    let queryPayload = { status: 'active' };

    if (search) {
      queryPayload.name = { $regex: search, $options: 'i' };
    }

    if (category) queryPayload.category = category;
    if (brand) queryPayload.brand = brand;

    if (minPrice || maxPrice) {
      queryPayload.price = {};
      if (minPrice) queryPayload.price.$gte = Number(minPrice);
      if (maxPrice) queryPayload.price.$lte = Number(maxPrice);
    }

    if (bikeBrand && bikeModel && bikeYear) {
      const targetYear = Number(bikeYear);
      queryPayload.compatibleBikes = {
        $elemMatch: {
          brand: { $regex: `^${bikeBrand}$`, $options: 'i' },
          model: { $regex: `^${bikeModel}$`, $options: 'i' },
          yearFrom: { $lte: targetYear },
          yearTo: { $gte: targetYear }
        }
      };
    }

    // FIXED (Issue 2): Mount explicit filtration hooks for catalog dashboard sliders and tags
    if (req.query.isFeatured === 'true') queryPayload.isFeatured = true;
    if (req.query.isNewArrival === 'true') queryPayload.isNewArrival = true;
    if (req.query.isBestSeller === 'true') queryPayload.isBestSeller = true;

    let sortPayload = { createdAt: -1 };
    if (sort === 'price_asc') sortPayload = { price: 1 };
    if (sort === 'price_desc') sortPayload = { price: -1 };
    if (sort === 'rating') sortPayload = { 'ratings.average': -1 };

    const skipIndex = (Number(page) - 1) * Number(limit);
    const totalCount = await Product.countDocuments(queryPayload);

    const products = await Product.find(queryPayload)
      .sort(sortPayload)
      .skip(skipIndex)
      .limit(Number(limit))
      .populate('category', 'name slug');

    // FIXED (Issue 1): Standardized response payload key schema properties directly to "products"
    return res.status(200).json({
      success: true,
      count: products.length,
      total: totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Requested motorcycle accessory not found.' });
    }

    // FIXED (Issue 5): Removed internal viewCount arithmetic here to prevent duplicate mutations when parent layout mounts
    return res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Requested motorcycle accessory not found.' });
    }

    // FIXED (Issue 5): Consolidate metrics counter execution strictly inside slug parameters lookup paths
    product.viewCount += 1;
    await product.save();

    return res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product catalog item entry
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res, next) => {
  try {
    // FIXED (Issue 4): Dropped the development trace console logging block to avoid leaking sensitive buffer data in production pipelines

    const slug = req.body.slug
      ? req.body.slug.toLowerCase()
      : req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const productExists = await Product.findOne({ slug });
    if (productExists) {
      return res.status(400).json({ success: false, message: 'Product SEO url tracking signature already exists.' });
    }

    const product = await Product.create({
      ...req.body,
      slug
    });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product catalog record
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase();
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product catalog record permanently
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get price history for a product
// @route   GET /api/products/:id/price-history
// @access  Public
exports.getPriceHistory = async (req, res, next) => {
  try {
    const PriceHistory = require('../models/PriceHistory');
    const days = Number(req.query.days) || 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await PriceHistory.find({
      product: req.params.id,
      recordedAt: { $gte: startDate }
    }).sort({ recordedAt: 1 });

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const prices = history.map(h => h.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : product.salePrice || product.price;
    const isLowestPrice = (product.salePrice || product.price) <= minPrice;

    return res.status(200).json({
      success: true,
      history,
      isLowestPrice,
      currentPrice: product.salePrice || product.price,
      lowestPrice: minPrice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload images to a specific product
// @route   POST /api/products/:id/images
// @access  Admin
exports.uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files detected.' });
    }

    for (const file of req.files) {
      const fileBase64 = file.buffer.toString('base64');
      const fileDataUri = `data:${file.mimetype};base64,${fileBase64}`;

      const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
        folder: 'perfect_moto/products',
        transformation: [{ width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' }]
      });

      product.images.push({
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        isMain: product.images.length === 0
      });
    }

    await product.save();
    return res.status(200).json({ success: true, images: product.images });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product image
// @route   DELETE /api/products/:id/images/:imgId
// @access  Admin
exports.deleteProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const image = product.images.id(req.params.imgId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    product.images.pull(req.params.imgId);
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ✅ FIXED (Issue 3): Added Low Stock Restock Suggestions Diagnostic Endpoint
// ============================================================================

// @desc    Retrieve active products matching low stock conditions
// @route   GET /api/admin/restock-suggestions
// @access  Admin
exports.getRestockSuggestions = async (req, res, next) => {
  try {
    // Evaluates stock numbers strictly beneath designated warning limits
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockAlert'] },
      status: 'active'
    }).select('name brand stock lowStockAlert lastRestockDate images');

    return res.status(200).json({ 
      success: true, 
      products: lowStockProducts 
    });
  } catch (error) {
    next(error);
  }
};