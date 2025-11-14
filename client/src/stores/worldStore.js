import { create } from 'zustand';
import axios from 'axios';

export const useWorldStore = create((set, get) => ({
  properties: [],
  users: [],
  selectedProperty: null,
  realEstateMode: false,
  agentMode: false,
  
  loadProperties: async () => {
    try {
      const res = await axios.get('/api/properties');
      set({ properties: res.data });
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
  },
  
  selectProperty: (property) => {
    set({ selectedProperty: property });
  },
  
  toggleRealEstateMode: () => {
    set({ realEstateMode: !get().realEstateMode });
  },
  
  toggleAgentMode: () => {
    set({ agentMode: !get().agentMode });
  },
  
  purchaseProperty: async (propertyId, sellerId, agentId, price) => {
    try {
      const res = await axios.post('/api/transactions/purchase', {
        propertyId,
        sellerId,
        agentId,
        price
      });
      await get().loadProperties();
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Purchase failed' };
    }
  }
}));
