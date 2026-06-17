const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String },
  isMain: { type: Boolean, default: false }
});

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const compatibleBikeSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  yearFrom: { type: Number, required: true },
  yearTo: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  specifications: [specificationSchema],
  whatsInBox: [{ type: String }],
  images: [imageSchema],
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  saleEndDate: { type: Date },
  gstPercent: { type: Number, default: 18 },
  stock: { type: Number, default: 0, min: 0 },
  lowStockAlert: { type: Number, default: 5 },
  compatibleBikes: [compatibleBikeSchema],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'draft', 'out_of_stock'], default: 'active' },
  viewCount: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  lastRestockDate: { type: Date }
}, {
  timestamps: true
});

// ✅ Auto-generate slug from name before saving — synchronous, no callback needed
productSchema.pre('save', function() {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// Indexes
productSchema.index({ category: 1, status: 1 });
productSchema.index({ isFeatured: 1, status: 1 });
productSchema.index({ brand: 1 });

module.exports = mongoose.model('Product', productSchema);