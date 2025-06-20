import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../configs/api';
import socketService from '../configs/socket';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          
          localStorage.setItem('lonetown_token', token);
          localStorage.setItem('lonetown_user', JSON.stringify(user));
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });

          // Connect socket
          socketService.connect(user.id);
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        try {
          if (get().token) {
            await api.post('/auth/logout');
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('lonetown_token');
          localStorage.removeItem('lonetown_user');
          socketService.disconnect();
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            error: null 
          });
        }
      },

      getCurrentUser: async () => {
        if (!get().token) return;
        
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data.user });
        } catch (error) {
          console.error('Get current user error:', error);
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('lonetown_token');
        const userStr = localStorage.getItem('lonetown_user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ 
              user, 
              token, 
              isAuthenticated: true 
            });
            socketService.connect(user.id);
          } catch (error) {
            console.error('Auth initialization error:', error);
            localStorage.removeItem('lonetown_token');
            localStorage.removeItem('lonetown_user');
          }
        }
      }
    }),
    {
      name: 'lonetown-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;