const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request headers:', req.headers);
    console.log('Request query:', req.query);

    let token = null;

    // Try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('Token from header:', token);
    }

    // If no token in header, try to get from URL query
    if (!token && req.query.token) {
      token = req.query.token;
      console.log('Token from URL:', token);
    }

    if (!token) {
      console.log('No token found');
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      console.log('User is not admin');
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    // Add user info to request
    req.user = decoded;
    console.log('Auth successful for user:', decoded.email);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah kadaluarsa'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

module.exports = authMiddleware;
