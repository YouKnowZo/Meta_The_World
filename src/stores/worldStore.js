import { create } from 'zustand'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
})

export const useWorldStore = create((set, get) => ({
  // Loading state
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),

  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Real Estate Agent state
  isAgent: false,
  agentCommission: 0.05, // 5% commission
  totalEarnings: 0,
  transactions: [],
  setAgent: (isAgent) => set({ isAgent }),
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, transaction],
    totalEarnings: state.totalEarnings + (transaction.amount * state.agentCommission)
  })),

  // Properties
  properties: [],
  selectedProperty: null,
  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),

  // UI State
  showPropertyPanel: false,
  showAgentPanel: false,
  showCreateProperty: false,
  setShowPropertyPanel: (show) => set({ showPropertyPanel: show }),
  setShowAgentPanel: (show) => set({ showAgentPanel: show }),
  setShowCreateProperty: (show) => set({ showCreateProperty: show }),

  // Socket connection
  socket,
  connected: false,
  setConnected: (connected) => set({ connected }),

  // Initialize
  initialize: async () => {
    socket.on('connect', () => {
      set({ connected: true })
      socket.emit('getProperties')
    })

    socket.on('disconnect', () => {
      set({ connected: false })
    })

    socket.on('properties', (properties) => {
      set({ properties })
    })

    socket.on('propertySold', (data) => {
      const state = get()
      if (state.isAgent && data.agentId === state.user?.id) {
        state.addTransaction({
          id: data.transactionId,
          propertyId: data.propertyId,
          amount: data.amount,
          buyer: data.buyer,
          timestamp: new Date()
        })
      }
      // Update properties
      socket.emit('getProperties')
    })

    // Simulate loading
    setTimeout(() => {
      set({ isLoaded: true })
    }, 2000)
  }
}))
