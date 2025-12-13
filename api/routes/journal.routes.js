const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', journalController.getAllJournals);
router.get('/statistics', journalController.getStatistics);
router.get('/:id', journalController.getJournalById);

// Protected routes (Contributor and above)
router.post('/', authenticate, journalController.createJournal);

// Admin only routes
router.patch('/:id/status', authenticate, authorize('ADMIN'), journalController.updateJournalStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), journalController.deleteJournal);

module.exports = router;
