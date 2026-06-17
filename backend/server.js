// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const initPriceHistoryCron = require('./utils/priceHistoryCron');

// Import System Management Routing Modules
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
// PATCH: Updated comments profile to reflect our transition away from old legacy handlers
const paymentRoutes = require('./routes/paymentRoutes'); // Handles transactions via Shiprocket configurations
const bikeRoutes = require('./routes/bikeRoutes');
const couponRoutes = require('./routes/couponRoutes');
const bundleRoutes = require('./routes/bundleRoutes');
const notifyMeRoutes = require('./routes/notifyMeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const activityRoutes = require('./routes/activityRoutes');
const trackRoutes = require('./routes/trackRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const homepageRoutes = require('./routes/homepageRoutes');

// Import Administrative Business Logic Controllers
const settingsController = require("./controllers/settingsController");
const referralController = require("./controllers/referralController");

const app = express();

// Set up security layers to inject defensive HTTP headers automatically
app.use(helmet());

// Cross-Origin Resource Sharing matching technical specifications
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Payload parsing constraints configuration
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Passport middleware
app.use(passport.initialize());

// Global standard system protection rate-limiting controls
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many server requests from this IP footprint, please wait a minute.' }
});
app.use('/api', globalLimiter);

// Establish database cluster handshake link
connectDB();

// Initialize Automated Daily Price History Background Cron
initPriceHistoryCron();

// Enclosed runtime request logs inside a development context flag to keep production streams optimized
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    console.log(`📦 Body keys: ${Object.keys(req.body || {}).join(', ')}`);
    next();
  });
}

// Root endpoint diagnostic heartbeat probe
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Registered the newsletter marketing subscription target hook
app.post("/api/auth/newsletter", (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }
    return res.status(200).json({ 
      success: true, 
      message: "Subscribed to system monitoring newsletters successfully." 
    });
  } catch (err) {
    next(err);
  }
});

// Mount System Management Target Modules to API Pipeline Layers
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); 
app.use('/api/bikes', bikeRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/notify-me', notifyMeRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/activity', activityRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/homepage', homepageRoutes);

// Administrative dynamic platform configuration variables endpoints
app.get("/api/settings", settingsController.fetchSystemVariables);
app.put("/api/settings", settingsController.overrideSystemVariables);
app.get("/api/settings/badges", settingsController.fetchBadges);

// Singular mapping for affiliate referral tracking mechanics
app.get("/api/referral/my", referralController.getMyReferralData);
app.post("/api/referral/generate", referralController.generateUserReferralNode);
app.post("/api/referral/validate", referralController.evaluateReferralOnboardingReward);

// Centralized exception interception boundary controller
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Perfect Moto Core Server running in [${process.env.NODE_ENV || 'development'}] mode on port: ${PORT}`);
});

// Unhandled Promise Rejection containment safety hook
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection structural fault logged: ${err.message}`);
  server.close(() => process.exit(1));
});