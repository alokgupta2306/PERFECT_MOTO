const cron = require('node-cron');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');

// Schedule background worker task to sweep inventory at midnight daily
const initPriceHistoryCron = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily Midnight Price History Snapshot Cron Job...');
    try {
      const activeProducts = await Product.find({ status: 'active' });
      
      const snapshotRecords = activeProducts.map(product => ({
        product: product._id,
        price: product.price,
        salePrice: product.salePrice || null,
        recordedAt: new Date()
      }));

      if (snapshotRecords.length > 0) {
        await PriceHistory.insertMany(snapshotRecords);
        console.log(`Successfully recorded price history snapshots for ${snapshotRecords.length} accessories.`);
      }
    } catch (error) {
      console.error('Price history cron execution failed:', error.message);
    }
  });
};

module.exports = initPriceHistoryCron;