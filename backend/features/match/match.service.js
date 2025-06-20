const matchRepository = require('./match.repository');
const userService = require('../user/user.service');
const { generateMatchId, FREEZE_DURATION, NEW_MATCH_DELAY } = require('../../shared/utils/helpers');
const { FREEZE_DURATION: FREEZE_TIME, NEW_MATCH_DELAY: MATCH_DELAY } = require('../../shared/config/constants');

class MatchService {
  async createMatch(userId, matchedUserId) {
    const matchData = {
      id: generateMatchId(),
      userId,
      matchedUserId,
      status: 'active',
      isPinned: true,
      messageCount: 0,
      videoCallUnlocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await matchRepository.create(matchData);
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
    
    await matchRepository.updateById(matchId, {
      status: 'frozen',
      isPinned: false,
      freezeUntil,
      updatedAt: new Date()
    });

    // Schedule new match for the other user after 2 hours
    setTimeout(async () => {
      await this.createNewMatchForUser(match.matchedUserId);
    }, MATCH_DELAY);

    return { freezeUntil, message: 'Match unpinned. You are now in a 24-hour reflection phase.' };
  }

  async createNewMatchForUser(userId) {
    const users = await userService.getAllUsers();
    const availableUsers = (await Promise.all(
      users.map(async user => {
        if (user.id !== userId && !(await this.getActiveMatch(user.id))) {
          return user;
        }
        return null;
      })
    )).filter(Boolean);

    if (availableUsers.length > 0) {
      const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
      await this.createMatch(userId, randomUser.id);
    }
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