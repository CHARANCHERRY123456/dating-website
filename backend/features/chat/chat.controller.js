const chatService = require('./chat.service');

class ChatController {
  async getMessages(req, res) {
    try {
      const { matchId } = req.params;
      const messages = await chatService.getMessages(matchId);
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { messageId } = req.params;
      await chatService.markMessageAsRead(messageId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ChatController();