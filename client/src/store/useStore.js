import { create } from 'zustand';

const useStore = create((set) => ({
  // User state
  userWallet: null,
  setUserWallet: (wallet) => set({ userWallet: wallet }),

  // Player position
  position: { x: 0, y: 5, z: 10 },
  setPosition: (position) => set({ position }),

  // Multiplayer
  otherPlayers: {},
  setOtherPlayers: (players) => set({ otherPlayers: players }),

  // NFT lands
  ownedLands: [],
  setOwnedLands: (lands) => set({ ownedLands: lands }),

  // UI state
  loading: false,
  setLoading: (loading) => set({ loading }),

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now() }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export default useStore;
