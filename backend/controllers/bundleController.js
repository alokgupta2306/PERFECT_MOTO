const Bundle = require('../models/Bundle');
const Product = require('../models/Product'); // FIXED (Issue 2): Imported Product model for pricing calculations

// @desc    Get all active bundles
// @route   GET /api/bundles
// @access  Public
exports.getBundles = async (req, res, next) => {
  try {
    const now = new Date();
    const bundles = await Bundle.find({
      isActive: true,
      $or: [
        { validTo: { $gte: now } },
        { validTo: null },
        { validTo: { $exists: false } }
      ]
    }).populate('products.product', 'name price salePrice images stock status');

    // FIXED (Issue 1): Standardized response payload key schema property to "bundles"
    return res.status(200).json({ success: true, count: bundles.length, bundles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bundles containing a specific product (Cross-Sell / Co-deployed Recommendation)
// @route   GET /api/bundles/product/:productId
// @access  Public
exports.getBundlesByProduct = async (req, res, next) => {
  try {
    const now = new Date();
    const bundles = await Bundle.find({
      isActive: true,
      $or: [
        { validTo: { $gte: now } },
        { validTo: null },
        { validTo: { $exists: false } }
      ],
      'products.product': req.params.productId
    }).populate('products.product', 'name price salePrice images stock status');

    // FIXED (Issue 1): Standardized response payload key schema property to "bundles"
    // Also defensive check: if single cross-sell suggestion is expected by components, return the first active bundle item
    return res.status(200).json({ 
      success: true, 
      bundles: bundles.length > 0 ? bundles : [],
      bundle: bundles.length > 0 ? bundles[0] : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a bundle
// @route   POST /api/bundles
// @access  Admin
exports.createBundle = async (req, res, next) => {
  try {
    const { name, products, bundlePrice, isActive, validFrom, validTo } = req.body;

    if (!name || !products || !bundlePrice) {
      return res.status(400).json({ success: false, message: 'Name, products and bundlePrice are required.' });
    }

    // FIXED (Issue 2): Algorithmic check queries active product definitions to sum base catalog prices accurately
    let originalTotal = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        const itemPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        originalTotal += itemPrice * (item.quantity || 1);
      }
    }
    const savings = originalTotal - Number(bundlePrice);

    const bundle = await Bundle.create({
      name,
      products,
      bundlePrice: Number(bundlePrice),
      originalTotal,
      savings: savings > 0 ? savings : 0,
      isActive: isActive !== undefined ? isActive : true,
      validFrom: validFrom || new Date(),
      validTo: validTo || null
    });

    // FIXED (Issue 1): Standardized response payload key schema property to "bundle"
    return res.status(201).json({ success: true, bundle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a bundle
// @route   PUT /api/bundles/:id
// @access  Admin
exports.updateBundle = async (req, res, next) => {
  try {
    // FIXED (Issue 2): Recalculate financial breakdown numbers on update parameters changes to avoid stale pricing margins
    if (req.body.products || req.body.bundlePrice) {
      const existingBundle = await Bundle.findById(req.params.id);
      if (!existingBundle) {
        return res.status(404).json({ success: false, message: 'Bundle not found.' });
      }

      const productsList = req.body.products || existingBundle.products;
      const targetingPrice = req.body.bundlePrice !== undefined ? req.body.bundlePrice : existingBundle.bundlePrice;

      let originalTotal = 0;
      for (const item of productsList) {
        const product = await Product.findById(item.product);
        if (product) {
          const itemPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
          originalTotal += itemPrice * (item.quantity || 1);
        }
      }
      
      req.body.originalTotal = originalTotal;
      req.body.savings = originalTotal - Number(targetingPrice) > 0 ? originalTotal - Number(targetingPrice) : 0;
    }

    const bundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('products.product', 'name price salePrice images stock status');

    if (!bundle) {
      return res.status(404).json({ success: false, message: 'Bundle not found.' });
    }

    // FIXED (Issue 1): Standardized response payload key schema property to "bundle"
    return res.status(200).json({ success: true, bundle });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a bundle
// @route   DELETE /api/bundles/:id
// @access  Admin
exports.deleteBundle = async (req, res, next) => {
  try {
    const bundle = await Bundle.findByIdAndDelete(req.params.id);
    if (!bundle) {
      return res.status(404).json({ success: false, message: 'Bundle not found.' });
    }
    return res.status(200).json({ success: true, message: 'Bundle deleted successfully.' });
  } catch (error) {
    next(error);
  }
};