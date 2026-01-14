const jwt = require('jsonwebtoken');
const FirestoreService = require('../lib/firestore');

const usersService = new FirestoreService('User');

// Protect routes - Authentication middleware
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized to access this route. Please log in.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await usersService.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: 'The user belonging to this token no longer exists.'
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(401).json({
        error: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Not authorized to access this route.' });
  }
};

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await usersService.findById(decoded.id);
      if (user && user.isActive !== false) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { protect, restrictTo, optionalAuth };
