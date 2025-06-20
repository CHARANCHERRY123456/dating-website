const express = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../shared/middlewares/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.me);

module.exports = router;