const rateLimit = require("express-rate-limit");

/**
 * Standard Standard Message Formatting Struct Payload Engine
 * @param {string} msg - Informative response rationale layout token 
 */
const configureErrorMessage = (msg) => ({
  success: false,
  message: msg || "Volumetric transaction threshold breached. Automated rate-limiter active."
});

// 1. Core Platform Fallback Limiter (100 operations every 15 minutes)
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many global server requests from this footprint. Please wait 15 minutes.")
});

// 2. Client Authentication Login Protection (Strictly capped at 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many login attempts. Critical authentication brute-force protection triggered. Try again in 15 minutes.")
});

// 3. New Account Registration Throttler (Strictly capped at 10 requests per hour)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many account profiles created from this node. Infrastructure protection active. Try again in an hour.")
});

// 4. Forgot Password Recovery Leak Protection (Strictly capped at 3 requests per hour)
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many credential reset requests. Mailer pipeline anti-spam guard active. Try again in an hour.")
});

// 5. CRM Waitlist Registration Pipeline Throttler (Strictly capped at 3 requests per hour)
const notifyMeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many out-of-stock restock watch registrations. Please slow down your monitoring sweeps.")
});

// 6. Checkout Transactions Pipeline Protection (Strictly capped at 20 operations per hour)
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many high-value order creation sequences initiated. Bulk checkout bot containment active. Try again later.")
});

// 7. Back-Office Administrative Dashboard Access Protection (Strictly capped at 3 attempts per 15 minutes)
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many admin terminal authentication attempts. Supervisor threat log dispatched.")
});

// 8. Session Token Refresh Loop Shield (Strictly capped at 30 requests per 15 minutes)
// Safely halts cascading infinity-rehydration loops across Axios interceptors
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: configureErrorMessage("Too many JWT re-issue cycles detected. Interceptor infinity-loop override active.")
});

module.exports = {
  apiRateLimiter,
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  notifyMeLimiter,
  orderLimiter,
  adminLoginLimiter,
  refreshLimiter
};