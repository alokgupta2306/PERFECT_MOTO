const mongoose = require('mongoose');

const reviewImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true }
});

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  images: [reviewImageSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminReply: { type: String, trim: true },
  helpfulCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Compound performance index to serve clean product page review lookups
reviewSchema.index({ product: 1, status: 1 });

module.exports = mongoose.model('Review', reviewSchema);