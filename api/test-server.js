

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

const mockJournals = require('../journals_metadata.json').slice(0, 10);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '✅ EnerNova API Server (TEST MODE - No Database)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      chat: '/api/chat (requires OpenAI key)',
      journals: '/api/journals (mock data)',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'TEST (No Database)',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/journals', (req, res) => {
  res.json({
    status: 'success',
    data: {
      journals: mockJournals,
      pagination: {
        page: 1,
        limit: 10,
        total: mockJournals.length,
        pages: 1
      }
    }
  });
});

app.get('/api/journals/:id', (req, res) => {
  const journal = mockJournals.find(j => j.id === req.params.id);
  
  if (!journal) {
    return res.status(404).json({
      status: 'error',
      message: 'Journal not found'
    });
  }
  
  res.json({
    status: 'success',
    data: { journal }
  });
});

app.get('/api/journals/statistics', (req, res) => {
  const uniqueAuthors = new Set(
    mockJournals
      .filter(j => !j.detectedAuthor.includes('Perlu Review'))
      .map(j => j.detectedAuthor)
  );
  
  res.json({
    status: 'success',
    data: {
      statistics: {
        total: mockJournals.length,
        pending: mockJournals.filter(j => j.status === 'pending').length,
        approved: 0,
        rejected: 0,
        uniqueAuthors: uniqueAuthors.size
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
    hint: 'See available endpoints at /'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST SERVER STARTED (No Database Required)');
  console.log('='.repeat(60));
  console.log(`\n🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📱 Mode: ${process.env.NODE_ENV}`);
  console.log(`\n✅ Test endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - GET  http://localhost:${PORT}/api/journals`);
  console.log(`   - GET  http://localhost:${PORT}/api/journals/:id`);
  console.log(`\n💡 To use full API dengan database:`);
  console.log(`   1. Install PostgreSQL`);
  console.log(`   2. Update DATABASE_URL di .env`);
  console.log(`   3. Run: npx prisma migrate dev`);
  console.log(`   4. Run: node server.js`);
  console.log('\n' + '='.repeat(60) + '\n');
});

module.exports = app;
