const Category = require('../models/Category');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    
    // FIXED (Issue 1): Standardized response payload key schema property to "categories"
    return res.status(200).json({ 
      success: true, 
      count: categories.length, 
      categories 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, image, sortOrder, metaTitle, metaDescription } = req.body;

    // Auto-generate slug from name if not provided
    const finalSlug = slug
      ? slug.toLowerCase()
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const categoryExists = await Category.findOne({ slug: finalSlug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category slug tracking mapping already exists.' });
    }

    const category = await Category.create({
      name,
      slug: finalSlug,
      image,
      sortOrder,
      metaTitle,
      metaDescription
    });

    // FIXED (Issue 1): Standardized response payload key schema property to "category"
    return res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    
    // FIXED (Issue 1): Standardized response payload key schema property to "category"
    return res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res, next) => {
  try {
    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase();
    } else if (req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // FIXED (Issue 1): Standardized response payload key schema property to "category"
    return res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    return res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};