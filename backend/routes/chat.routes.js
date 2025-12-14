const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

router.post('/', optionalAuth, chatController.sendMessage);

module.exports = router;
