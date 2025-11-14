import { create } from 'zustand';

// Simple localStorage persistence
const loadAuth = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state || { user: null, token: null };
    }
  } catch (e) {
    // Ignore errors
  }
  return { user: null, token: null };
};

const saveAuth = (state) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify({ state }));
  } catch (e) {
    // Ignore errors
  }
};

const initialState = loadAuth();

export const useAuthStore = create((set) => ({
  user: initialState.user,
  token: initialState.token,
  setAuth: (user, token) => {
    set({ user, token });
    saveAuth({ user, token });
  },
  logout: () => {
    set({ user: null, token: null });
    saveAuth({ user: null, token: null });
  },
}));
