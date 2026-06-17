// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios'); // PATCH: Imported axios for high-performance direct profile sync checks
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenHelpers');
const { sendWelcomeEmail } = require('../utils/email'); // PATCH: Imported missing welcome email helper hook

/**
 * Standard utility generator to output random 8-character code variables
 */
const generateNanoReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode: referralCode.toUpperCase() });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password,
      referralCode: generateNanoReferralCode(),
      referredBy: referredByUser ? referredByUser._id : null
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    newUser.password = undefined;

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: accessToken,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login customer or administrator
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Silent access token renewal
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    let refreshToken = null;

    if (cookies) {
      const cookieArray = cookies.split(';');
      const targetCookie = cookieArray.find(c => c.trim().startsWith('refreshToken='));
      if (targetCookie) {
        refreshToken = targetCookie.split('=')[1];
      }
    }

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh context missing or cookies cleared.' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ success: false, message: 'Refresh authorization token expired or invalid.' });

      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, message: 'Session restoration context invalid.' });
      }

      const newAccessToken = generateAccessToken(user._id);
      return res.status(200).json({ success: true, token: newAccessToken });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout and clear cookies
// @route   POST /api/auth/logout
// @access  Auth
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    return res.status(200).json({ success: true, message: 'Session successfully disconnected' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Auth
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile context not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Password Reset URL:', resetUrl);

    return res.status(200).json({
      success: true,
      message: 'If this email exists, a reset link has been sent.',
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email address via token link
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerifyToken: req.params.token
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.'
      });
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update profile basic properties
// @route   PUT /api/auth/me
// @access  Auth
exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, bloodGroup, emergencyContact } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, phone, bloodGroup, emergencyContact } },
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Add address sub-document log entry to profile
// @route   POST /api/auth/addresses
// @access  Auth
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User context unlinked." });

    user.addresses.push(req.body);
    await user.save();
    
    return res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom index address record off user document map
// @route   DELETE /api/auth/addresses/:id
// @access  Auth
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User context unlinked." });

    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    
    return res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Add motorcycle model profile parameters into cloud garage indices
// @route   POST /api/auth/garage
// @access  Auth
exports.addGarageBike = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User context unlinked." });

    const { brand, model, year, isPrimary } = req.body;
    
    if (isPrimary) {
      user.savedBikes.forEach(b => { b.isPrimary = false; });
    }

    user.savedBikes.push({ 
      brand, 
      model, 
      year: Number(year), 
      isPrimary: isPrimary || user.savedBikes.length === 0 
    });

    await user.save();
    return res.status(200).json({ success: true, savedBikes: user.savedBikes });
  } catch (error) {
    next(error);
  }
};

// @desc    Set targeted garage motorcycle array element as structural primary filter parameter
// @route   PUT /api/auth/garage/:id/primary
// @access  Auth
exports.setPrimaryBike = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User context unlinked." });

    user.savedBikes.forEach(b => {
      b.isPrimary = b._id.toString() === req.params.id;
    });

    await user.save();
    return res.status(200).json({ success: true, savedBikes: user.savedBikes });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete garage motorcycle row object context
// @route   DELETE /api/auth/garage/:id
// @access  Auth
exports.deleteGarageBike = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User context unlinked." });

    user.savedBikes = user.savedBikes.filter(b => b._id.toString() !== req.params.id);
    await user.save();
    
    return res.status(200).json({ success: true, savedBikes: user.savedBikes });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 🔥 FIXED CORE RE-ENGINEERING: Google Unified Access Token Flow Validation
// ============================================================================

// @desc    Google OAuth login/register token exchange handshake validation
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    // PATCH: Accept the structural token parameter sent dynamically by Login.jsx popups
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Google authorization bearer access token missing." });
    }

    // Ping Google's official userinfo profile service securely using the browser access token
    let googleProfileResponse;
    try {
      googleProfileResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (apiErr) {
      return res.status(401).json({ success: false, message: "Google authentication access token validation rejected." });
    }

    const { name, email, sub: googleId, picture } = googleProfileResponse.data;
    if (!email) {
      return res.status(400).json({ success: false, message: "Google security profile context did not disclose an email address." });
    }

    // Locate or create user account properties dynamically based on the verified email channel
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        isEmailVerified: true,
        profilePhoto: picture || '',
        referralCode: generateNanoReferralCode()
      });
    } else if (!user.googleId) {
      // Link the Google auth ID seamlessly to an existing standard email login profile if unbound
      user.googleId = googleId;
      user.authProvider = 'google';
      user.isEmailVerified = true;
      if (!user.profilePhoto) user.profilePhoto = picture;
      await user.save();
    }

    // Trigger missing asynchronous welcome email template if a brand new rider joins the storefront
    if (isNewUser) {
      try {
        await sendWelcomeEmail(user);
        console.log(`Welcome email triggered for new Google sign-on: ${user.email}`);
      } catch (emailErr) {
        console.error(`Non-blocking welcome email pipeline delay caught safely: ${emailErr.message}`);
      }
    }

    // Generate authenticated JWT platform access layers
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ 
      success: true, 
      token: accessToken, 
      user 
    });
  } catch (error) {
    next(error);
  }
};