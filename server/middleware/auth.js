const Admin = require('../models/admin');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

const authMiddleware = {
  verifyToken: (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Token tidak ditemukan'
        });
      }

      const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Format token tidak valid'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Add user info to request
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid atau kadaluarsa'
      });
    }
  }
};

module.exports = authMiddleware; 