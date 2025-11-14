import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
    delete axios.defaults.headers.common['Authorization'];
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/api/users/me`);
      set({ user: response.data, token });
    } catch (error) {
      get().logout();
    }
  },
  
  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  }
}));

export { useAuthStore };
