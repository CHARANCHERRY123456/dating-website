import { create } from 'zustand';
import api from '../configs/api';
import socketService from '../configs/socket';

const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  typingUsers: new Set(),
  onlineUsers: new Set(),

  fetchMessages: async (matchId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/chat/${matchId}/messages`);
      set({ messages: response.data.messages, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch messages';
      set({ error: message, isLoading: false });
    }
  },

  sendMessage: (matchId, receiverId, content, type = 'text') => {
    socketService.sendMessage({ matchId, receiverId, content, type }, (message) => {
      if (message.error) {
        console.error('Message send error:', message.error);
      } else {
        set(state => ({ messages: [...state.messages, message] }));
      }
    });
  },

  addMessage: (message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  markMessageAsRead: async (messageId) => {
    try {
      await api.post(`/chat/messages/${messageId}/read`);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  },

  startTyping: (matchId, receiverId) => {
    socketService.startTyping({ matchId, receiverId });
  },

  stopTyping: (matchId, receiverId) => {
    socketService.stopTyping({ matchId, receiverId });
  },

  setUserTyping: (userId, isTyping) => {
    set(state => {
      const newTypingUsers = new Set(state.typingUsers);
      if (isTyping) {
        newTypingUsers.add(userId);
      } else {
        newTypingUsers.delete(userId);
      }
      return { typingUsers: newTypingUsers };
    });
  },

  setUserOnline: (userId, isOnline) => {
    set(state => {
      const newOnlineUsers = new Set(state.onlineUsers);
      if (isOnline) {
        newOnlineUsers.add(userId);
      } else {
        newOnlineUsers.delete(userId);
      }
      return { onlineUsers: newOnlineUsers };
    });
  },

  clearMessages: () => set({ messages: [] }),
  clearError: () => set({ error: null })
}));

export default useChatStore;