import { create } from 'zustand';

export const useRealEstateStore = create((set, get) => ({
  properties: [],
  listings: [],
  transactions: [],
  selectedProperty: null,
  commissionRate: 0.03, // 3% default commission for agents
  
  // Initialize with some sample properties
  initializeProperties: () => {
    const sampleProperties = [
      {
        id: 'prop-1',
        name: 'Luxury Sky Villa',
        type: 'residential',
        price: 500000,
        location: { x: 10, y: 0, z: 10 },
        size: { width: 50, height: 30, depth: 50 },
        owner: null,
        features: ['ocean-view', 'rooftop-garden', 'smart-home'],
        status: 'for-sale',
        listingAgent: null,
      },
      {
        id: 'prop-2',
        name: 'Modern Business Tower',
        type: 'commercial',
        price: 2000000,
        location: { x: -20, y: 0, z: 15 },
        size: { width: 80, height: 100, depth: 80 },
        owner: null,
        features: ['prime-location', 'high-tech', 'sustainable'],
        status: 'for-sale',
        listingAgent: null,
      },
      {
        id: 'prop-3',
        name: 'Beachfront Paradise',
        type: 'residential',
        price: 750000,
        location: { x: 30, y: 0, z: -25 },
        size: { width: 60, height: 25, depth: 60 },
        owner: null,
        features: ['beach-access', 'infinity-pool', 'private-dock'],
        status: 'for-sale',
        listingAgent: null,
      },
    ];
    set({ properties: sampleProperties });
  },
  
  addProperty: (property) => set((state) => ({
    properties: [...state.properties, property],
  })),
  
  createListing: (propertyId, agentId, listingPrice) => {
    const property = get().properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const listing = {
      id: `listing-${Date.now()}`,
      propertyId,
      agentId,
      listingPrice: listingPrice || property.price,
      status: 'active',
      createdAt: new Date().toISOString(),
      views: 0,
      inquiries: 0,
    };
    
    set((state) => ({
      listings: [...state.listings, listing],
      properties: state.properties.map(p =>
        p.id === propertyId
          ? { ...p, status: 'listed', listingAgent: agentId }
          : p
      ),
    }));
    
    return listing;
  },
  
  processTransaction: (listingId, buyerId, finalPrice, agentId) => {
    const listing = get().listings.find(l => l.id === listingId);
    if (!listing) return null;
    
    const commission = finalPrice * get().commissionRate;
    
    const transaction = {
      id: `txn-${Date.now()}`,
      listingId,
      propertyId: listing.propertyId,
      buyerId,
      sellerId: get().properties.find(p => p.id === listing.propertyId)?.owner,
      agentId,
      finalPrice,
      commission,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      transactions: [...state.transactions, transaction],
      listings: state.listings.map(l =>
        l.id === listingId ? { ...l, status: 'sold' } : l
      ),
      properties: state.properties.map(p =>
        p.id === listing.propertyId
          ? { ...p, owner: buyerId, status: 'owned', listingAgent: null }
          : p
      ),
    }));
    
    return transaction;
  },
  
  selectProperty: (propertyId) => set({
    selectedProperty: get().properties.find(p => p.id === propertyId),
  }),
  
  clearSelection: () => set({ selectedProperty: null }),
  
  getAgentTransactions: (agentId) => {
    return get().transactions.filter(t => t.agentId === agentId);
  },
  
  getAgentEarnings: (agentId) => {
    const agentTransactions = get().getAgentTransactions(agentId);
    return agentTransactions.reduce((total, txn) => total + txn.commission, 0);
  },
}));
