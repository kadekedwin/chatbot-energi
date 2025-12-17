const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authenticate = (req, res, next) => {
  try {
    
    const token = req.cookies.token || 
                  req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please login.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    
    logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please login again.'
    });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token || 
                  req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      logger.info(`User identified: ${decoded.email} (${decoded.role})`);
    } else {
      req.user = null;
      logger.info('Anonymous user request');
    }
    
    next();
  } catch (error) {
    
    req.user = null;
    next();
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize, optionalAuth };
