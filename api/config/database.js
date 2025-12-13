const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['info', 'warn', 'error'] 
    : ['error'],
});

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

process.on('beforeExit', async () => {
  if (isConnected) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
});

module.exports = prisma;
