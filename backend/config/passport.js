// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');
const { sendWelcomeEmail } = require('../utils/email');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // PATCH: Dynamically reads absolute URI from environment variables to eliminate redirect_uri mismatches
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this googleId
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // Existing Google user — just login, no welcome email
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user — no welcome email
        user.googleId = profile.id;
        user.authProvider = 'google';
        user.isEmailVerified = true;
        if (!user.profilePhoto) {
          user.profilePhoto = profile.photos[0]?.value;
        }
        await user.save();
        return done(null, user);
      }

      // NEW user via Google — create + send welcome email
      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        authProvider: 'google',
        isEmailVerified: true,
        profilePhoto: profile.photos[0]?.value,
        referralCode: crypto.randomBytes(4).toString('hex').toUpperCase()
      });

      // Send welcome email — wrapped in try-catch so failure never blocks login
      try {
        await sendWelcomeEmail(newUser);
        console.log(`Welcome email sent to new Google user: ${newUser.email}`);
      } catch (emailError) {
        console.error(`Welcome email failed for Google user: ${emailError.message}`);
      }

      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;