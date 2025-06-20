const User = require('./user.model');

class UserRepository {
  constructor() {
    this.users = new Map(); // In-memory fallback
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      // Fallback to in-memory
      return Array.from(this.users.values()).find(user => user.email === email);
    }
  }

  async findById(id) {
    try {
      return await User.findOne({ id });
    } catch (error) {
      return this.users.get(id);
    }
  }

  async create(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      // Fallback to in-memory
      this.users.set(userData.id, userData);
      return userData;
    }
  }

  async findAll() {
    try {
      return await User.find({});
    } catch (error) {
      return Array.from(this.users.values());
    }
  }

  async updateById(id, updateData) {
    try {
      return await User.findOneAndUpdate({ id }, updateData, { new: true });
    } catch (error) {
      const user = this.users.get(id);
      if (user) {
        const updated = { ...user, ...updateData };
        this.users.set(id, updated);
        return updated;
      }
      return null;
    }
  }
}

module.exports = new UserRepository();