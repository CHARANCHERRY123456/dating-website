const userRepository = require('./user.repository');
const { hashPassword, generateUserId } = require('../../shared/utils/helpers');

class UserService {
  async createUser(userData) {
    const hashedPassword = await hashPassword(userData.password);
    const user = {
      id: generateUserId(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return await userRepository.create(user);
  }

  async getUserByEmail(email) {
    return await userRepository.findByEmail(email);
  }

  async getUserById(id) {
    return await userRepository.findById(id);
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async updateUserStatus(id, isOnline) {
    return await userRepository.updateById(id, { 
      isOnline, 
      lastSeen: new Date(),
      updatedAt: new Date()
    });
  }

  async updateMatchHistory(userId, matchHistory) {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');

    user.matchHistory = user.matchHistory || [];
    user.matchHistory.push(matchHistory);

    // Update activity metrics based on match history
    const recentMatches = user.matchHistory.slice(-5);
    const avgMessageCount = recentMatches.reduce((sum, m) => sum + m.messageCount, 0) / recentMatches.length;
    const avgDuration = recentMatches.reduce((sum, m) => sum + m.duration, 0) / recentMatches.length;
    
    // Update engagement score based on recent match performance
    const engagementScore = Math.min(
      1,
      (avgMessageCount / 100) * 0.5 + // Message quantity
      (avgDuration / 7) * 0.3 + // Match duration (normalized to a week)
      (recentMatches.filter(m => m.outcome === 'success').length / recentMatches.length) * 0.2 // Success rate
    );

    await userRepository.updateById(userId, {
      matchHistory: user.matchHistory,
      'activityMetrics.engagementScore': engagementScore,
      updatedAt: new Date()
    });

    return user;
  }

  async getPotentialMatches(userId) {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const query = {
      id: { $ne: userId },
      'preferences.ageRange.min': { $lte: user.age },
      'preferences.ageRange.max': { $gte: user.age },
      age: {
        $gte: user.preferences.ageRange.min,
        $lte: user.preferences.ageRange.max
      }
    };

    if (user.coordinates?.coordinates) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.coordinates.coordinates
          },
          $maxDistance: user.preferences.maxDistance * 1000 // Convert km to meters
        }
      };
    }

    return await userRepository.findMany(query);
  }
}

module.exports = new UserService();