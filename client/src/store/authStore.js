import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password });
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true
          });
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
      },
      
      register: async (username, email, password) => {
        try {
          const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true
          });
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        delete axios.defaults.headers.common['Authorization'];
      },
      
      becomeAgent: async (commissionRate) => {
        try {
          const { token } = useAuthStore.getState();
          const response = await axios.post(
            `${API_URL}/auth/become-agent`,
            { commissionRate },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          set((state) => ({
            user: { ...state.user, isAgent: true }
          }));
          return { success: true, data: response.data };
        } catch (error) {
          return { success: false, error: error.response?.data?.error || 'Failed to become agent' };
        }
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);

// Initialize axios headers if token exists
const token = useAuthStore.getState().token;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
