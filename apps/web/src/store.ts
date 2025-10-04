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

interface GameState {
  lands: Land[]
  users: User[]
  currentUser: User | null
  selectedLand: Land | null
  gameMode: 'explore' | 'build' | 'trade'
  worldSeed: number
  
  // Actions
  setCurrentUser: (user: User) => void
  selectLand: (land: Land | null) => void
  setGameMode: (mode: 'explore' | 'build' | 'trade') => void
  purchaseLand: (landId: number, price: number) => void
  buildOnLand: (landId: number, building: Building) => void
  generateWorld: () => void
}

export const useGameStore = create<GameState>((set) => ({
  lands: [],
  users: [],
  currentUser: null,
  selectedLand: null,
  gameMode: 'explore',
  worldSeed: Math.random(),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  selectLand: (land) => set({ selectedLand: land }),
  setGameMode: (mode) => set({ gameMode: mode }),
  
  purchaseLand: (landId, price) => set((state) => {
    if (!state.currentUser || state.currentUser.balance < price) return state
    
    const lands = state.lands.map(land => 
      land.id === landId 
        ? { ...land, owner: state.currentUser!.address }
        : land
    )
    
    const currentUser = {
      ...state.currentUser,
      balance: state.currentUser.balance - price,
      ownedLands: [...state.currentUser.ownedLands, landId]
    }
    
    return { lands, currentUser }
  }),
  
  buildOnLand: (landId, building) => set((state) => {
    const lands = state.lands.map(land => 
      land.id === landId 
        ? { ...land, buildings: [...land.buildings, building], developed: true }
        : land
    )
    
    return { lands }
  }),
  
  generateWorld: () => set(() => {
    const lands: Land[] = []
    const gridSize = 20
    const landTypes: Land['type'][] = ['residential', 'commercial', 'industrial', 'park', 'beach', 'mountain']
    
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        const id = x * 1000 + z
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1)
        const height = noise * 2
        
        lands.push({
          id,
          position: [x * 4, height, z * 4],
          owner: Math.random() > 0.8 ? 'demo-user' : null,
          price: Math.floor(100 + Math.random() * 500),
          type: landTypes[Math.floor(Math.random() * landTypes.length)],
          buildings: [],
          resources: Math.floor(Math.random() * 100),
          developed: Math.random() > 0.7,
          coordinates: {
            lat: 40.7128 + (x * 0.001),
            lng: -74.0060 + (z * 0.001)
          }
        })
      }
    }
    
    return { lands }
  })
}))