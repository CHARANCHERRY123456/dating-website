const matchRepository = require('./match.repository');
const userService = require('../user/user.service');
const compatibilityService = require('./compatibility.service');
const { generateMatchId } = require('../../shared/utils/helpers');
const { FREEZE_DURATION: FREEZE_TIME, NEW_MATCH_DELAY: MATCH_DELAY } = require('../../shared/config/constants');

class MatchService {
  async createMatch(userId, matchedUserId) {
    const createdAt = new Date();
    // Get compatibility score for the match
    const user = await userService.getUserById(userId);
    const matchedUser = await userService.getUserById(matchedUserId);
    const compatibilityScore = await compatibilityService.calculateCompatibilityScore(user, matchedUser);

    const matchData = {
      id: generateMatchId(),
      userId,
      matchedUserId,
      status: 'active',
      isPinned: true,
      messageCount: 0,
      videoCallUnlocked: false,
      compatibilityScore,
      createdAt,
      updatedAt: createdAt
    };

    // Create reciprocal match with same compatibility score
    const reciprocalData = {
      id: generateMatchId(),
      userId: matchedUserId,
      matchedUserId: userId,
      status: 'active',
      isPinned: true,
      messageCount: 0,
      videoCallUnlocked: false,
      compatibilityScore,
      createdAt,
      updatedAt: createdAt
    };

    // Save both records in parallel
    const [primaryMatch] = await Promise.all([
      matchRepository.create(matchData),
      matchRepository.create(reciprocalData)
    ]);
    return primaryMatch;
  }

  async getUserMatches(userId) {
    return await matchRepository.findByUserId(userId);
  }

  async getActiveMatch(userId) {
    return await matchRepository.findActiveMatch(userId);
  }

  async unpinMatch(matchId, userId) {
    const match = await matchRepository.findById(matchId);
    if (!match || match.userId !== userId) {
      throw new Error('Match not found or unauthorized');
    }

    const freezeUntil = new Date(Date.now() + FREEZE_TIME);
    
    // Update user's match history
    await userService.updateMatchHistory(userId, {
      matchId,
      userId: match.matchedUserId,
      duration: (Date.now() - new Date(match.createdAt).getTime()) / (1000 * 60 * 60 * 24),
      messageCount: match.messageCount,
      compatibility: match.compatibilityScore,
      outcome: 'unmatched'
    });

    await matchRepository.updateById(matchId, {
      status: 'frozen',
      isPinned: false,
      freezeUntil,
      updatedAt: new Date()
    });

    // Schedule new match for the other user after delay
    setTimeout(async () => {
      await this.createNewMatchForUser(match.matchedUserId);
    }, MATCH_DELAY);

    return { 
      freezeUntil, 
      message: 'Match unpinned. You are now in a 24-hour reflection phase.' 
    };
  }

  async createNewMatchForUser(userId) {
    // Find the best match using compatibility service
    const bestMatch = await compatibilityService.findBestMatch(userId);
    
    if (bestMatch && bestMatch.score >= 0.5) {
      return await this.createMatch(userId, bestMatch.match.id);
    }
    
    return null;
  }

  async incrementMessageCount(matchId) {
    const match = await matchRepository.findById(matchId);
    if (!match) return null;

    const newCount = match.messageCount + 1;
    const videoCallUnlocked = newCount >= 100 && 
      (Date.now() - new Date(match.createdAt).getTime()) <= (48 * 60 * 60 * 1000);

    return await matchRepository.updateById(matchId, {
      messageCount: newCount,
      videoCallUnlocked,
      updatedAt: new Date()
    });
  }
}

module.exports = new MatchService();