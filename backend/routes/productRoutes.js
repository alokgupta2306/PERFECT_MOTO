const express = require('express');
const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceHistory,
  uploadProductImages,
  deleteProductImage
} = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// FIXED (Issue 2): Replaced local raw Multer initialization with your pre-configured, optimized global upload middleware
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// ============================================================================
// 🛒 PUBLIC CUSTOMER ACCESS CHANNELS
// ============================================================================

// ⚠️ DETERMINISTIC PREFERENCE NOTE: Specific structural sub-paths (e.g., /slug, /price-history) 
// MUST be evaluated before dynamic parameter keys (/:id) to prevent parameter string hijacking.
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/price-history', getPriceHistory);
router.get('/:id', getProductById);

// ============================================================================
// 🛠️ ADMINISTRATIVE CATALOG DATA CHANNELS
// ============================================================================

router.post('/', verifyToken, requireAdmin, createProduct);
router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

// ============================================================================
// 📸 MEDIA ASSET CLOUDINARY STREAM MANAGEMENT CHANNELS
// ============================================================================

// FIXED (Issue 2): Applies your central upload validation middleware to safeguard image memory buffers
router.post('/:id/images', verifyToken, requireAdmin, upload.array('images', 4), uploadProductImages);
router.delete('/:id/images/:imgId', verifyToken, requireAdmin, deleteProductImage);

module.exports = router;