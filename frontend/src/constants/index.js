export const APP_NAME = 'LoneTown';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  PROFILE: '/profile'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image'
};

export const MATCH_STATUS = {
  ACTIVE: 'active',
  FROZEN: 'frozen',
  UNPINNED: 'unpinned'
};

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away'
};

export const FREEZE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
export const MESSAGE_LIMIT = 100;
export const VIDEO_CALL_TIME_LIMIT = 48 * 60 * 60 * 1000; // 48 hours

export const TEST_CREDENTIALS = {
  email: 'test@lonetown.com',
  password: '123456'
};