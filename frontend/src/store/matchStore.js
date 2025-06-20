import { create } from 'zustand';
import api from '../configs/api';

const useMatchStore = create((set, get) => ({
  matches: [],
  activeMatch: null,
  isLoading: false,
  error: null,

  fetchMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/matches');
      set({ matches: response.data.matches, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch matches';
      set({ error: message, isLoading: false });
    }
  },

  fetchActiveMatch: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/matches/active');
      set({ activeMatch: response.data.match, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch active match';
      set({ error: message, isLoading: false });
    }
  },

  unpinMatch: async (matchId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/matches/${matchId}/unpin`);
      
      // Update active match to null since it's unpinned
      set({ activeMatch: null, isLoading: false });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to unpin match';
      set({ error: message, isLoading: false });
      return {
        success: false,
        error: message
      };
    }
  },

  clearError: () => set({ error: null }),

  // Real-time updates
  updateMatchStatus: (matchId, status) => {
    set(state => ({
      matches: state.matches.map(match => 
        match.id === matchId ? { ...match, status } : match
      ),
      activeMatch: state.activeMatch?.id === matchId 
        ? { ...state.activeMatch, status }
        : state.activeMatch
    }));
  },

  updateMessageCount: (matchId, count) => {
    set(state => ({
      matches: state.matches.map(match => 
        match.id === matchId ? { ...match, messageCount: count } : match
      ),
      activeMatch: state.activeMatch?.id === matchId 
        ? { ...state.activeMatch, messageCount: count }
        : state.activeMatch
    }));
  }
}));

export default useMatchStore;