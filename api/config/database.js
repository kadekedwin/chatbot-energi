const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['info', 'warn', 'error'] 
    : ['error'],
});

// Lazy connection - only connect when needed
let isConnected = false;

const connectDB = async () => {
  if (!isConnected) {
    try {
      await prisma.$connect();
      isConnected = true;
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }
  return prisma;
};

// Graceful shutdown
process.on('beforeExit', async () => {
  if (isConnected) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
});

// Export prisma instance (will connect on first use)
module.exports = prisma;
