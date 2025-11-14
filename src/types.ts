// Core Types for Meta World

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface User {
  id: string;
  name: string;
  avatar: Avatar;
  wallet: number; // MetaCoins
  career: Career;
  properties: Property[];
  transactions: Transaction[];
  skills: Skills;
  reputation: number;
}

export interface Avatar {
  appearance: {
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    eyeColor: string;
    bodyType: string;
    height: number;
    clothing: string[];
  };
  position: Vector3;
  rotation: number;
}

export interface Career {
  type: CareerType;
  level: number;
  experience: number;
  earnings: number;
  commissionRate: number;
}

export type CareerType = 
  | 'RealEstateAgent'
  | 'Architect'
  | 'Developer'
  | 'Artist'
  | 'Entrepreneur'
  | 'Designer'
  | 'Investor'
  | 'ContentCreator'
  | 'EventPlanner'
  | 'Custom';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  position: Vector3;
  size: { width: number; depth: number; height: number };
  price: number;
  ownerId: string | null;
  forSale: boolean;
  features: PropertyFeature[];
  quality: number; // 0-100
  neighborhood: string;
  description: string;
}

export type PropertyType = 
  | 'Penthouse'
  | 'Villa'
  | 'Apartment'
  | 'Studio'
  | 'Mansion'
  | 'Office'
  | 'Store'
  | 'Restaurant'
  | 'Hotel'
  | 'Land';

export interface PropertyFeature {
  name: string;
  value: string | number;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'commission';
  propertyId: string;
  amount: number;
  buyerId?: string;
  sellerId?: string;
  agentId?: string;
  timestamp: number;
}

export interface Skills {
  negotiation: number;
  salesmanship: number;
  marketing: number;
  networking: number;
  communication: number;
  leadership: number;
  creativity: number;
  technical: number;
}

export interface WorldState {
  timeOfDay: number; // 0-24
  weather: WeatherType;
  temperature: number;
  season: Season;
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'global' | 'private' | 'system';
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}
