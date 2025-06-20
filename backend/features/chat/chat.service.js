const chatRepository = require('./chat.repository');
const matchService = require('../match/match.service');
const { generateUserId } = require('../../shared/utils/helpers');

class ChatService {
  async sendMessage(matchId, senderId, receiverId, content, type = 'text') {
    const messageData = {
      id: generateUserId(),
      matchId,
      senderId,
      receiverId,
      content,
      type,
      timestamp: new Date(),
      isRead: false
    };

    const message = await chatRepository.create(messageData);
    
    // Increment message count for the match
    await matchService.incrementMessageCount(matchId);
    
    return message;
  }

  async getMessages(matchId) {
    return await chatRepository.findByMatchId(matchId);
  }

  async markMessageAsRead(messageId) {
    return await chatRepository.markAsRead(messageId);
  }
}

module.exports = new ChatService();