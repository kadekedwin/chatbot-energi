const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', journalController.getAllJournals);
router.get('/statistics', journalController.getStatistics);
router.get('/:id', journalController.getJournalById);

router.post('/', authenticate, journalController.createJournal);

router.patch('/:id/status', authenticate, authorize('ADMIN'), journalController.updateJournalStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), journalController.deleteJournal);

module.exports = router;
