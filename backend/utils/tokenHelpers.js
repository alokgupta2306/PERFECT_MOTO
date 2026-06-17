const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m' // Tight short lifetime window verification check for absolute security
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d' // Extends connectivity across shopping context interactions safely
  });
};

module.exports = { generateAccessToken, generateRefreshToken };