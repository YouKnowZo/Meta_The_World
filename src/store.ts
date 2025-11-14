import { create } from 'zustand';
import type { User, Property, WorldState, Message, Notification } from './types';

interface GameStore {
  // User State
  user: User;
  updateUser: (updates: Partial<User>) => void;
  addMetaCoins: (amount: number) => void;
  purchaseProperty: (property: Property) => void;
  
  // World State
  worldState: WorldState;
  updateWorldState: (updates: Partial<WorldState>) => void;
  
  // Properties
  allProperties: Property[];
  setProperties: (properties: Property[]) => void;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  
  // UI State
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  showRealEstateUI: boolean;
  setShowRealEstateUI: (show: boolean) => void;
  showCareerUI: boolean;
  setShowCareerUI: (show: boolean) => void;
  
  // Messages & Social
  messages: Message[];
  addMessage: (message: Message) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  
  // Game Actions
  earnCommission: (propertyId: string, salePrice: number) => void;
  completeSale: (property: Property, buyerId: string) => void;
}

const initialUser: User = {
  id: 'player-1',
  name: 'New Resident',
  wallet: 50000, // Starting MetaCoins
  avatar: {
    appearance: {
      skinTone: '#f5d5b8',
      hairStyle: 'short',
      hairColor: '#3d2817',
      eyeColor: '#4a7c59',
      bodyType: 'average',
      height: 1.75,
      clothing: ['casual-shirt', 'jeans', 'sneakers']
    },
    position: { x: 0, y: 0, z: 0 },
    rotation: 0
  },
  career: {
    type: 'RealEstateAgent',
    level: 1,
    experience: 0,
    earnings: 0,
    commissionRate: 0.03 // 3% commission
  },
  properties: [],
  transactions: [],
  skills: {
    negotiation: 10,
    salesmanship: 10,
    marketing: 5,
    networking: 5,
    communication: 10,
    leadership: 5,
    creativity: 5,
    technical: 5
  },
  reputation: 50
};

const initialWorldState: WorldState = {
  timeOfDay: 14, // 2 PM
  weather: 'sunny',
  temperature: 72,
  season: 'summer'
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  user: initialUser,
  worldState: initialWorldState,
  allProperties: [],
  selectedProperty: null,
  showRealEstateUI: false,
  showCareerUI: false,
  messages: [],
  notifications: [],

  // User Actions
  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  })),

  addMetaCoins: (amount) => set((state) => ({
    user: { ...state.user, wallet: state.user.wallet + amount }
  })),

  purchaseProperty: (property) => set((state) => {
    if (state.user.wallet < property.price) {
      get().addNotification({
        type: 'error',
        title: 'Insufficient Funds',
        message: `You need ${property.price - state.user.wallet} more MetaCoins`
      });
      return state;
    }

    const updatedProperty = { ...property, ownerId: state.user.id, forSale: false };
    
    get().addNotification({
      type: 'success',
      title: 'Property Acquired!',
      message: `You now own ${property.name}`
    });

    return {
      user: {
        ...state.user,
        wallet: state.user.wallet - property.price,
        properties: [...state.user.properties, updatedProperty]
      },
      allProperties: state.allProperties.map(p => 
        p.id === property.id ? updatedProperty : p
      )
    };
  }),

  // World Actions
  updateWorldState: (updates) => set((state) => ({
    worldState: { ...state.worldState, ...updates }
  })),

  // Property Actions
  setProperties: (properties) => set({ allProperties: properties }),

  updateProperty: (propertyId, updates) => set((state) => ({
    allProperties: state.allProperties.map(p =>
      p.id === propertyId ? { ...p, ...updates } : p
    )
  })),

  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setShowRealEstateUI: (show) => set({ showRealEstateUI: show }),
  setShowCareerUI: (show) => set({ showCareerUI: show }),

  // Social Actions
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message].slice(-100) // Keep last 100 messages
  })),

  // Notification Actions
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    }]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  // Game Actions
  earnCommission: (_propertyId, salePrice) => set((state) => {
    const commission = salePrice * state.user.career.commissionRate;
    const newExperience = state.user.career.experience + Math.floor(salePrice / 1000);
    const newLevel = Math.floor(newExperience / 100) + 1;

    get().addNotification({
      type: 'success',
      title: 'Commission Earned!',
      message: `You earned ${commission.toFixed(0)} MetaCoins (${(state.user.career.commissionRate * 100).toFixed(1)}% commission)`
    });

    return {
      user: {
        ...state.user,
        wallet: state.user.wallet + commission,
        career: {
          ...state.user.career,
          earnings: state.user.career.earnings + commission,
          experience: newExperience,
          level: newLevel
        }
      }
    };
  }),

  completeSale: (property, buyerId) => {
    const { user } = get();
    if (user.career.type === 'RealEstateAgent') {
      get().earnCommission(property.id, property.price);
    }
    get().updateProperty(property.id, { ownerId: buyerId, forSale: false });
  }
}));
