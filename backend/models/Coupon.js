const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['flat', 'percent', 'free_shipping'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  maxDiscount: { type: Number, min: 0 },
  minOrderValue: { type: Number, default: 0, min: 0 },
  maxUses: { type: Number, default: 1000 },
  usesPerUser: { type: Number, default: 1 },
  isFirstOrderOnly: { type: Boolean, default: false },
  usedCount: { type: Number, default: 0, min: 0 },
  validFrom: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Removed manual duplicate code index declaration to completely eliminate warning flags

module.exports = mongoose.model('Coupon', couponSchema);