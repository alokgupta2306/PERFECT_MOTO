const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Decode user data payload using secret key token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from DB, omitting the encrypted password field
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account no longer exists' });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ success: false, message: 'This user account has been suspended' });
      }

      return next();
    } catch (error) {
      // Capture expired token signature separate from bad signature validation strings
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, code: 'TOKEN_EXPIRED', message: 'Access token expired' });
      }
      return res.status(401).json({ success: false, message: 'Invalid or structural token error' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization rejected, missing token signature' });
  }
};

module.exports = { verifyToken };