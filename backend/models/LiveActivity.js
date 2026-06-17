const mongoose = require('mongoose');

const liveActivitySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  customerName: { type: String, required: true }, // First name only for customer data privacy
  customerCity: { type: String, required: true },
  action: { type: String, default: 'purchased' },
  productName: { type: String, required: true }
}, {
  timestamps: true
});

// Automatically purge social actions after 7 days (604800 seconds)
liveActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('LiveActivity', liveActivitySchema);