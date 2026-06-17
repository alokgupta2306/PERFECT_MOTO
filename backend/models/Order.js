// backend/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  quantity: { type: Number, required: true }
});

const statusHistorySchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned'],
    required: true 
  },
  changedAt: { type: Date, default: Date.now },
  note: { type: String }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  // PATCH: Restructured to completely restrict COD and limit options to shiprocket
  paymentMethod: { type: String, enum: ['shiprocket'], required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  // PATCH: Cleaned out all Razorpay field mappings; replaced with tracking elements[cite: 3]
  shiprocketOrderId: { type: String },
  shiprocketShipmentId: { type: String },
  awbCode: { type: String }, // Air Waybill Number acting as tracking reference[cite: 3]
  orderStatus: { 
    type: String, 
    enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned'], 
    default: 'placed' 
  },
  trackingNumber: { type: String },
  trackingUrl: { type: String },
  couponApplied: {
    code: { type: String },
    discount: { type: Number, default: 0 }
  },
  itemsTotal: { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  loyaltyPointsEarned: { type: Number, default: 0 },
  loyaltyPointsUsed: { type: Number, default: 0 },
  notes: { type: String },
  statusHistory: [statusHistorySchema],
  whatsappSent: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Database indexes for fast querying and scannability
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ shiprocketOrderId: 1 }); // Performance optimizations lookup key[cite: 3]

module.exports = mongoose.model('Order', orderSchema);