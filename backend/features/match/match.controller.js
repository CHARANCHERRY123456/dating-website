const matchService = require('./match.service');
const userService = require('../user/user.service');

class MatchController {
  async getMatches(req, res) {
    try {
      const matches = await matchService.getUserMatches(req.user.userId);
      const matchesWithUsers = await Promise.all(
        matches.map(async (match) => {
          const matchedUser = await userService.getUserById(match.matchedUserId);
          return {
            ...match,
            matchedUser: {
              id: matchedUser.id,
              name: matchedUser.name,
              age: matchedUser.age,
              bio: matchedUser.bio,
              avatar: matchedUser.avatar,
              interests: matchedUser.interests,
              location: matchedUser.location,
              isOnline: matchedUser.isOnline
            }
          };
        })
      );

      res.json({ matches: matchesWithUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getActiveMatch(req, res) {
    try {
      const matchDoc = await matchService.getActiveMatch(req.user.userId);
      if (!matchDoc) {
        return res.json({ match: null });
      }

      // Convert document to plain object
      const match = matchDoc.toObject ? matchDoc.toObject() : matchDoc;
      const matchedUser = await userService.getUserById(match.matchedUserId);
      res.json({
        match: {
          ...match,
          matchedUser: {
            id: matchedUser.id,
            name: matchedUser.name,
            age: matchedUser.age,
            bio: matchedUser.bio,
            avatar: matchedUser.avatar,
            interests: matchedUser.interests,
            location: matchedUser.location,
            isOnline: matchedUser.isOnline
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async unpinMatch(req, res) {
    try {
      const { matchId } = req.params;
      const result = await matchService.unpinMatch(matchId, req.user.userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new MatchController();