module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyCtFgFI4s3S8x7hvI5U0nIFGWL0H7hOONM',
  PORT: process.env.PORT || 3001,
  
  // App Constants
  FREEZE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  NEW_MATCH_DELAY: 2 * 60 * 60 * 1000, // 2 hours
  MESSAGE_LIMIT: 100,
  VIDEO_CALL_TIME_LIMIT: 48 * 60 * 60 * 1000, // 48 hours
  
  // Test User
  TEST_USER: {
    email: 'test@lonetown.com',
    password: '123456'
  }
};