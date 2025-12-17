

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const journalRoutes = require('./routes/journal.routes');
const uploadRoutes = require('./routes/upload.routes');

const errorHandler = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'http://10.21.0.55:3000',
  'http://20.2.81.1:3000',
  'http://192.168.56.1:3000',
  'https://enernova.undiksha.cloud',           // ✅ Production frontend
  'https://www.enernova.undiksha.cloud',       // ✅ Production frontend (www)
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

<<<<<<< HEAD
    // In development, allow all origins
=======
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

<<<<<<< HEAD
    // In production, check whitelist
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      callback(null, true); // Allow for now, bisa diubah ke false jika ingin strict
=======
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

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

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path
  });
});

app.use(errorHandler);

const server = app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

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

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
