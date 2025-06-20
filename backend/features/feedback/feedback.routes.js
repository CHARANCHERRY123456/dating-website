const express = require('express');
const feedbackController = require('./feedback.controller');
const authMiddleware = require('../../shared/middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', feedbackController.generateFeedback);

module.exports = router;