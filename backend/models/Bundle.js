const mongoose = require('mongoose');

const bundleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 }
});

const bundleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  products: [bundleItemSchema],
  bundlePrice: { type: Number, required: true, min: 0 },
  originalTotal: { type: Number, min: 0 }, // ✅ auto-calculated from products
  savings: { type: Number, min: 0 },       // ✅ auto-calculated
  isActive: { type: Boolean, default: true },
  validFrom: { type: Date, default: Date.now },
  validTo: { type: Date },                  // ✅ optional — no expiry if not set
  soldCount: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bundle', bundleSchema);