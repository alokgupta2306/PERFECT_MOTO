const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * @desc    Retrieve complete list of compatible Indian motorcycles
 * @route   GET /api/bikes
 * @access  Public
 */
router.get('/', (req, res, next) => {
  try {
    const bikesFilePath = path.join(__dirname, '../data/bikes.json');
    const rawData = fs.readFileSync(bikesFilePath, 'utf-8');
    const bikesData = JSON.parse(rawData);
    
    // FIXED (Issue 1): Swapped out generic "data" envelope key for an explicit "brands" parameter 
    // to instantly sync with state maps inside ShopByBike.jsx and Garage.jsx components
    return res.status(200).json({
      success: true,
      brands: bikesData.brands
    });
  } catch (error) {
    // Gracefully bubble filesystem compilation anomalies down to the central error interceptor
    next(error);
  }
});

module.exports = router;