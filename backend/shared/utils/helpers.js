const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/constants');

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const generateMatchId = () => {
  return Math.random().toString(36).substr(2, 12);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  generateUserId,
  generateMatchId
};