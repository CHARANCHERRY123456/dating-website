const express = require('express');
const chatController = require('./chat.controller');
const authMiddleware = require('../../shared/middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/:matchId/messages', chatController.getMessages);
router.post('/messages/:messageId/read', chatController.markAsRead);

module.exports = router;