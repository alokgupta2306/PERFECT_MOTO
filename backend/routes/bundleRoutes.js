const express = require('express');
const {
  getBundles,
  getBundlesByProduct,
  createBundle,
  updateBundle,
  deleteBundle
} = require('../controllers/bundleController');
const { verifyToken } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes
router.get('/', getBundles);
router.get('/product/:productId', getBundlesByProduct);

// Admin routes
router.post('/', verifyToken, requireAdmin, createBundle);
router.put('/:id', verifyToken, requireAdmin, updateBundle);
router.delete('/:id', verifyToken, requireAdmin, deleteBundle);

module.exports = router;