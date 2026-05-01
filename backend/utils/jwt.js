const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables. Please set it in your .env file.');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.sendTokenResponse = (user, statusCode, res) => {
  const token = exports.generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};