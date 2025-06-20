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
}

module.exports = new UserService();