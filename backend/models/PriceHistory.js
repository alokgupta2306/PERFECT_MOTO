const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  recordedAt: { type: Date, default: Date.now, required: true }
}, {
  timestamps: true
});

// Optimization compound lookups + automatically purge indices after 180 days (15552000 seconds)
priceHistorySchema.index({ product: 1, recordedAt: -1 });
priceHistorySchema.index({ recordedAt: 1 }, { expireAfterSeconds: 15552000 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);