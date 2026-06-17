const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  image: {
    url: { type: String, required: true },
    publicId: { type: String }
  },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);