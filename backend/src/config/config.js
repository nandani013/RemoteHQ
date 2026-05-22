// src/config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  db: {
    connectionString: process.env.DATABASE_URL,
  },
};
