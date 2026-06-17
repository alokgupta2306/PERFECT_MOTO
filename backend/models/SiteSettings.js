const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: { 
    type: String, 
    default: 'Perfect Moto',
    trim: true 
  },
  tagline: { 
    type: String, 
    default: 'One Stop Accessories Store for Motorcycle & Riders',
    trim: true 
  },
  logo: { type: String, trim: true },
  favicon: { type: String, trim: true },
  contactEmail: { 
    type: String, 
    default: 'perfectmoto.accessories@gmail.com',
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid corporate email address']
  },
  contactPhone: { 
    type: String, 
    default: '+918356968789',
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number with country code']
  },
  socialLinks: {
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true },
    whatsapp: { type: String, trim: true }
  },
  shippingRules: {
    freeAbove: { 
      type: Number, 
      default: 999,
      min: [0, 'Free shipping threshold cannot be negative']
    },
    standardCharge: { 
      type: Number, 
      default: 80,
      min: [0, 'Shipping charge cannot be negative']
    },
    codCharge: { 
      type: Number, 
      default: 50,
      min: [0, 'COD surcharge cannot be negative']
    }
  },
  gstNumber: { 
    type: String, 
    trim: true,
    uppercase: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please provide a valid Indian GSTIN number']
  },
  loyaltySettings: {
    pointsPerRupee: { 
      type: Number, 
      default: 0.1,
      min: [0, 'Accrual ratio cannot be negative']
    },
    pointValue: { 
      type: Number, 
      default: 0.1,
      min: [0, 'Point monetary valuation cannot be negative']
    },
    pointExpiryDays: { 
      type: Number, 
      default: 365,
      min: [1, 'Points must remain valid for at least 1 day']
    }
  },
  referralSettings: {
    referrerReward: { 
      type: Number, 
      default: 100,
      min: [0, 'Referral credit rewards cannot be negative']
    },
    refereeDiscount: { 
      type: Number, 
      default: 10,
      min: [0, 'Discount percentage cannot be less than 0%'],
      max: [100, 'Discount percentage cannot exceed 100%']
    }
  },
  reviewSettings: {
    autoApprove: { type: Boolean, default: false },
    reviewRequestDays: { 
      type: Number, 
      default: 3,
      min: [0, 'Follow-up wait delay cannot be negative']
    }
  },
  isMaintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { 
    type: String, 
    default: 'We are currently tuning our engines. Back soon!',
    trim: true 
  }
}, {
  // Enforces data model audit consistency by keeping automatic createdAt and updatedAt fields active
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);