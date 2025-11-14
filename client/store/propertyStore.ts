import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface Property {
  id: string
  owner_id: string | null
  owner_name?: string
  title: string
  description: string
  property_type: string
  size: number
  price: number
  location_x: number
  location_y: number
  location_z: number
  status: 'available' | 'sold' | 'pending'
  images: string[]
  features: string[]
  created_at: string
}

interface PropertyState {
  properties: Property[]
  selectedProperty: Property | null
  loading: boolean
  fetchProperties: () => Promise<void>
  selectProperty: (property: Property | null) => void
  createProperty: (propertyData: Partial<Property>) => Promise<void>
  purchaseProperty: (propertyId: string, agentId?: string) => Promise<void>
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  selectedProperty: null,
  loading: false,

  fetchProperties: async () => {
    set({ loading: true })
    try {
      const response = await axios.get(`${API_URL}/properties`)
      set({ properties: response.data, loading: false })
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      set({ loading: false })
    }
  },

  selectProperty: (property: Property | null) => {
    set({ selectedProperty: property })
  },

  createProperty: async (propertyData: Partial<Property>) => {
    try {
      await axios.post(`${API_URL}/properties`, propertyData)
      await get().fetchProperties()
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create property')
    }
  },

  purchaseProperty: async (propertyId: string, agentId?: string) => {
    try {
      await axios.post(`${API_URL}/transactions`, { propertyId, agentId })
      await get().fetchProperties()
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to purchase property')
    }
  },
}))
