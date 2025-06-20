const Message = require('./chat.model');

class ChatRepository {
  constructor() {
    this.messages = new Map();
  }

  async create(messageData) {
    try {
      const message = new Message(messageData);
      await message.save();
      return message;
    } catch (error) {
      this.messages.set(messageData.id, messageData);
      return messageData;
    }
  }

  async findByMatchId(matchId) {
    try {
      return await Message.find({ matchId }).sort({ timestamp: 1 });
    } catch (error) {
      return Array.from(this.messages.values())
        .filter(msg => msg.matchId === matchId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
  }

  async markAsRead(messageId) {
    try {
      return await Message.findOneAndUpdate({ id: messageId }, { isRead: true }, { new: true });
    } catch (error) {
      const message = this.messages.get(messageId);
      if (message) {
        message.isRead = true;
        this.messages.set(messageId, message);
        return message;
      }
      return null;
    }
  }
}

module.exports = new ChatRepository();