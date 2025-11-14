import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  login: async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token });
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },
  
  register: async (username, email, password, walletAddress) => {
    try {
      const res = await axios.post('/api/auth/register', { username, email, password, walletAddress });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token });
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const res = await axios.get('/api/users/me');
        set({ user: res.data, token });
      } catch (error) {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      }
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    delete axios.defaults.headers.common['Authorization'];
  }
}));
