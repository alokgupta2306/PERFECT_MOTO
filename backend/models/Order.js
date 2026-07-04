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
  orderNumber: { type: String, required: true, unique: true }, // Recharts / Postman format matching verbatim[cite: 1]
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
  paymentMethod: { type: String, enum: ['razorpay'], default: 'razorpay' },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  
  // Shiprocket fields for shipment tracking (post-payment logistics only)
  shiprocketOrderId: { type: String },
  shiprocketShipmentId: { type: String },
  awbCode: { type: String }, // Air Waybill Number acting as tracking reference[cite: 1]
  
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

// Database indexes for fast querying and scannability[cite: 1]
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ shiprocketOrderId: 1 }); // Performance optimizations lookup key[cite: 1]
 
module.exports = mongoose.model('Order', orderSchema);