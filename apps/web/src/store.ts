import { create } from 'zustand'

export interface Land {
  id: number
  position: [number, number, number]
  owner: string | null
  price: number
  type: 'residential' | 'commercial' | 'industrial' | 'park' | 'beach' | 'mountain'
  buildings: Building[]
  resources: number
  developed: boolean
  coordinates: { lat: number; lng: number }
  purchasePrice?: number
}

export interface Building {
  id: string
  type: 'house' | 'skyscraper' | 'shop' | 'factory' | 'park' | 'landmark'
  position: [number, number, number]
  level: number
  income: number
}

export interface User {
  address: string
  balance: number
  ownedLands: number[]
  avatar: {
    position: [number, number, number]
    color: string
  }
  achievements: string[]
  vipLevel?: number
  reputation?: number
}

export interface ToastNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface GameState {
  lands: Land[]
  users: User[]
  currentUser: User | null
  selectedLand: Land | null
  gameMode: 'explore' | 'build' | 'trade'
  worldSeed: number
  notifications: ToastNotification[]
  
  // Actions
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void
  removeNotification: (id: string) => void
  setCurrentUser: (user: User) => void
  selectLand: (land: Land | null) => void
  setGameMode: (mode: 'explore' | 'build' | 'trade') => void
  purchaseLand: (landId: number, price: number) => void
  buildOnLand: (landId: number, building: Building) => void
  syncBackend: () => Promise<void>
  fetchLands: () => Promise<void>
}

export const useGameStore = create<GameState>((set, get) => ({
  lands: [],
  users: [],
  currentUser: null,
  selectedLand: null,
  gameMode: 'explore',
  worldSeed: Math.random(),
  notifications: [],
  
  addNotification: (message, type = 'success') => set((state) => ({
    notifications: [...state.notifications, { id: Date.now().toString() + Math.random(), message, type }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  selectLand: (land) => set({ selectedLand: land }),
  setGameMode: (mode) => set({ gameMode: mode }),
  
  purchaseLand: async (landId, price) => {
    const token = localStorage.getItem('meta_token')
    if (!token) {
      get().addNotification('Please login to purchase lands', 'error')
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/lands/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ landId })
      })
      if (res.ok) {
        get().addNotification(`Successfully purchased Land #${landId}!`, 'success')
        get().syncBackend()
        get().fetchLands()
      } else {
        const error = await res.json()
        get().addNotification(`Failed to purchase: ${error.error || 'Unknown error'}`, 'error')
      }
    } catch(err) {
      console.error(err)
      get().addNotification('Network error occurred', 'error')
    }
  },
  
  buildOnLand: async (landId, building) => {
    const token = localStorage.getItem('meta_token')
    if (!token) {
      get().addNotification('Please login to build', 'error')
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/buildings/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ landId, type: building.type })
      })
      if (res.ok) {
        get().addNotification(`Successfully built ${building.type}!`, 'success')
        get().syncBackend()
        get().fetchLands()
      } else {
        const error = await res.json()
        get().addNotification(`Failed to build: ${error.error || 'Unknown error'}`, 'error')
      }
    } catch(err) {
      console.error(err)
      get().addNotification('Network error occurred', 'error')
    }
  },
  
  syncBackend: async () => {
    const token = localStorage.getItem('meta_token')
    if (!token) return

    try {
      const res = await fetch('http://localhost:4000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const user = await res.json()
        set({ currentUser: user })
      }
    } catch(err) {
      console.error(err)
    }
  },

  fetchLands: async () => {
    try {
      const res = await fetch('http://localhost:4000/api/lands')
      if (res.ok) {
        const lands = await res.json()
        // Format to match local layout if needed, but our schema matches
        // Wait, schema has 'id' string, 'landId' int. The frontend expects 'id' int natively?
        // Let's map it so the frontend doesn't break.
        set({ lands: lands.map((l: any) => ({ ...l, id: l.landId })) })
      }
    } catch(err) {
      console.error(err)
    }
  }
}))