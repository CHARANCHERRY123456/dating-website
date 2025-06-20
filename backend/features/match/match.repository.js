const Match = require('./match.model');

class MatchRepository {
  constructor() {
    this.matches = new Map();
  }

  async create(matchData) {
    try {
      const match = new Match(matchData);
      await match.save();
      return match;
    } catch (error) {
      this.matches.set(matchData.id, matchData);
      return matchData;
    }
  }

  async findByUserId(userId) {
    try {
      return await Match.find({ userId });
    } catch (error) {
      return Array.from(this.matches.values()).filter(match => match.userId === userId);
    }
  }

  async findActiveMatch(userId) {
    try {
      return await Match.findOne({ userId, status: 'active', isPinned: true });
    } catch (error) {
      return Array.from(this.matches.values()).find(
        match => match.userId === userId && match.status === 'active' && match.isPinned
      );
    }
  }

  async updateById(id, updateData) {
    try {
      return await Match.findOneAndUpdate({ id }, updateData, { new: true });
    } catch (error) {
      const match = this.matches.get(id);
      if (match) {
        const updated = { ...match, ...updateData };
        this.matches.set(id, updated);
        return updated;
      }
      return null;
    }
  }

  async findById(id) {
    try {
      return await Match.findOne({ id });
    } catch (error) {
      return this.matches.get(id);
    }
  }
}

module.exports = new MatchRepository();