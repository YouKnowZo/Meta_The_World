import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  avatar: null,
  role: 'citizen', // citizen, realEstateAgent, developer, etc.
  wallet: {
    balance: 10000, // Starting virtual currency
    currency: 'META',
  },
  
  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
    avatar: userData.avatar || null,
    role: userData.role || 'citizen',
  }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    avatar: null,
    role: 'citizen',
  }),
  
  updateRole: (newRole) => set((state) => ({
    role: newRole,
    user: { ...state.user, role: newRole },
  })),
  
  updateWallet: (amount) => set((state) => ({
    wallet: {
      ...state.wallet,
      balance: Math.max(0, state.wallet.balance + amount),
    },
  })),
  
  setAvatar: (avatar) => set({ avatar }),
}));
