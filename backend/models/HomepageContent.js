const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  buttonText: { type: String, default: 'Shop Now' },
  link: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  validFrom: { type: Date },
  validTo: { type: Date }
});

const trustBadgeSchema = new mongoose.Schema({
  icon: { type: String, required: true }, // Element identifier mapping
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  detailText: { type: String }
});

const homepageContentSchema = new mongoose.Schema({
  heroBanners: [heroBannerSchema],
  featuredProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  announcementText: { type: String },
  announcementBgColor: { type: String, default: '#FFB800' },
  trustBadges: [trustBadgeSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('HomepageContent', homepageContentSchema);