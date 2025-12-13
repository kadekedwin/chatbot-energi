const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Chat route - public access (no authentication required for demo)
// User info will be logged if authenticated via optionalAuth
router.post('/', optionalAuth, chatController.sendMessage);

module.exports = router;
