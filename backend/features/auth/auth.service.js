const userService = require('../user/user.service');
const { comparePassword, generateToken } = require('../../shared/utils/helpers');

class AuthService {
  async login(email, password) {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);
    
    // Update user online status
    await userService.updateUserStatus(user.id, true);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    };
  }

  async logout(userId) {
    await userService.updateUserStatus(userId, false);
    return { message: 'Logged out successfully' };
  }
}

module.exports = new AuthService();