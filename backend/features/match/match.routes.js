const express = require('express');
const matchController = require('./match.controller');
const authMiddleware = require('../../shared/middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', matchController.getMatches);
router.get('/active', matchController.getActiveMatch);
router.post('/:matchId/unpin', matchController.unpinMatch);

module.exports = router;