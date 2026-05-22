// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate a signed JWT for a given user ID.
 */
function signToken(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

/**
 * Verify a JWT and return the decoded payload.
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = { signToken, verifyToken };
