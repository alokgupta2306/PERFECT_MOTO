const mongoose = require('mongoose');

const notifyMeSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  notifiedAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Compound index prevents duplicate phone notifications for the same item
notifyMeSchema.index({ product: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('NotifyMe', notifyMeSchema);