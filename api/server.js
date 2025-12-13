/**
 * 🚀 ENERNOVA REST API SERVER
 * Universal Backend for Web & Mobile Apps
 * Compatible: Next.js, React Native, Flutter
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const journalRoutes = require('./routes/journal.routes');
const uploadRoutes = require('./routes/upload.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// =============== SECURITY MIDDLEWARE ===============
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting (prevent DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// =============== CORS CONFIGURATION ===============
// Allow all origins
const allowedOrigins = ['*']; // Allow all origins
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400 // 24 hours
}));

// =============== BODY PARSERS ===============
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// =============== LOGGING ===============
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// =============== HEALTH CHECK ===============
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'EnerNova API Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      chat: '/api/chat',
      journals: '/api/journals',
      upload: '/api/upload'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// =============== API ROUTES ===============
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/upload', uploadRoutes);

// =============== 404 HANDLER ===============
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path
  });
});

// =============== ERROR HANDLER ===============
app.use(errorHandler);

// =============== START SERVER ===============
const server = app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];
  
  // Get all IPv4 addresses
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    });
  });
  
  logger.info(`🚀 EnerNova API Server running on port ${PORT}`);
  logger.info(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/`);
  logger.info(`🔗 Local: http://localhost:${PORT}`);
  
  if (addresses.length > 0) {
    logger.info(`🌍 Network: ${addresses.map(addr => `http://${addr}:${PORT}`).join(', ')}`);
  }
});

// =============== GRACEFUL SHUTDOWN ===============
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
