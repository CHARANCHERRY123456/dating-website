const feedbackService = require('./feedback.service');
const userService = require('../user/user.service');
const chatService = require('../chat/chat.service');

class FeedbackController {
  async generateFeedback(req, res) {
    try {
      const { matchId, matchedUserId } = req.body;
      
      const user = await userService.getUserById(req.user.userId);
      const matchedUser = await userService.getUserById(matchedUserId);
      const chatHistory = await chatService.getMessages(matchId);

      const feedback = await feedbackService.generateMatchFeedback(
        user,
        matchedUser,
        chatHistory
      );

      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new FeedbackController();