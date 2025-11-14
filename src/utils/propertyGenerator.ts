import type { Property, PropertyType, PropertyFeature } from '../types';

const neighborhoods = [
  'Downtown District',
  'Sunset Heights',
  'Riverside Gardens',
  'Metropolitan Plaza',
  'Ocean View Estates',
  'Skyline District',
  'Golden Hills',
  'Harbor Bay',
  'Crystal Heights',
  'Paradise Valley'
];

const propertyNames: Record<PropertyType, string[]> = {
  Penthouse: ['Sky Palace', 'Cloud Nine', 'Summit Residence', 'Apex Tower', 'Zenith Suite'],
  Villa: ['Serenity Villa', 'Paradise Estate', 'Harmony House', 'Tranquil Manor', 'Eden Villa'],
  Apartment: ['Urban Loft', 'City View Apt', 'Modern Living', 'Comfort Suites', 'Metro Flat'],
  Studio: ['Cozy Studio', 'Creative Space', 'Minimalist Haven', 'Artist Loft', 'Smart Studio'],
  Mansion: ['Grand Estate', 'Luxury Manor', 'Royal Residence', 'Prestige Palace', 'Elite Mansion'],
  Office: ['Business Hub', 'Corporate Center', 'Innovation Office', 'Executive Suite', 'Pro Space'],
  Store: ['Retail Space', 'Shop Front', 'Market Place', 'Commerce Center', 'Trade Corner'],
  Restaurant: ['Dining Haven', 'Culinary Space', 'Gourmet Spot', 'Food Paradise', 'Bistro Place'],
  Hotel: ['Grand Hotel', 'Hospitality Inn', 'Luxury Lodge', 'Resort Palace', 'Premier Hotel'],
  Land: ['Prime Land', 'Development Plot', 'Build Site', 'Open Parcel', 'Future Estate']
};

const getPropertyFeatures = (type: PropertyType): PropertyFeature[] => {
  const commonFeatures = [
    { name: 'Smart Home System', value: 'Included' },
    { name: 'Security', value: '24/7' },
    { name: 'Internet Speed', value: '10 Gbps' }
  ];

  const typeSpecific: Record<PropertyType, PropertyFeature[]> = {
    Penthouse: [
      { name: 'Bedrooms', value: 4 },
      { name: 'Bathrooms', value: 3 },
      { name: 'Terrace', value: 'Private Rooftop' },
      { name: 'View', value: '360° City' },
      { name: 'Elevator', value: 'Private' }
    ],
    Villa: [
      { name: 'Bedrooms', value: 5 },
      { name: 'Bathrooms', value: 4 },
      { name: 'Garden', value: '5000 sqft' },
      { name: 'Pool', value: 'Infinity' },
      { name: 'Garage', value: '3 Car' }
    ],
    Apartment: [
      { name: 'Bedrooms', value: 2 },
      { name: 'Bathrooms', value: 2 },
      { name: 'Balcony', value: 'Yes' },
      { name: 'Parking', value: '1 Space' }
    ],
    Studio: [
      { name: 'Area', value: '500 sqft' },
      { name: 'Bathroom', value: 1 },
      { name: 'Kitchen', value: 'Kitchenette' }
    ],
    Mansion: [
      { name: 'Bedrooms', value: 8 },
      { name: 'Bathrooms', value: 6 },
      { name: 'Land', value: '2 acres' },
      { name: 'Pool', value: 'Olympic' },
      { name: 'Cinema', value: 'Private' },
      { name: 'Garage', value: '6 Car' }
    ],
    Office: [
      { name: 'Workstations', value: 20 },
      { name: 'Meeting Rooms', value: 3 },
      { name: 'Reception', value: 'Yes' }
    ],
    Store: [
      { name: 'Floor Space', value: '2000 sqft' },
      { name: 'Storage', value: '500 sqft' },
      { name: 'Display Windows', value: 4 }
    ],
    Restaurant: [
      { name: 'Seating Capacity', value: 80 },
      { name: 'Kitchen', value: 'Commercial' },
      { name: 'Patio', value: 'Outdoor' }
    ],
    Hotel: [
      { name: 'Rooms', value: 50 },
      { name: 'Suites', value: 10 },
      { name: 'Restaurant', value: 'Yes' },
      { name: 'Pool', value: 'Yes' }
    ],
    Land: [
      { name: 'Area', value: '10000 sqft' },
      { name: 'Zoning', value: 'Mixed Use' },
      { name: 'Utilities', value: 'Ready' }
    ]
  };

  return [...commonFeatures, ...typeSpecific[type]];
};

const getPropertySize = (type: PropertyType) => {
  const sizes: Record<PropertyType, { width: number; depth: number; height: number }> = {
    Penthouse: { width: 20, depth: 15, height: 5 },
    Villa: { width: 25, depth: 25, height: 8 },
    Apartment: { width: 12, depth: 10, height: 3 },
    Studio: { width: 8, depth: 8, height: 3 },
    Mansion: { width: 35, depth: 30, height: 12 },
    Office: { width: 20, depth: 15, height: 4 },
    Store: { width: 15, depth: 12, height: 4 },
    Restaurant: { width: 18, depth: 15, height: 4 },
    Hotel: { width: 40, depth: 30, height: 20 },
    Land: { width: 30, depth: 30, height: 0 }
  };
  return sizes[type];
};

const getPropertyPrice = (type: PropertyType, quality: number): number => {
  const basePrices: Record<PropertyType, number> = {
    Studio: 25000,
    Apartment: 75000,
    Penthouse: 250000,
    Villa: 350000,
    Mansion: 1000000,
    Office: 150000,
    Store: 100000,
    Restaurant: 200000,
    Hotel: 800000,
    Land: 50000
  };
  
  const basePrice = basePrices[type];
  const qualityMultiplier = 0.5 + (quality / 100) * 1.5;
  return Math.round(basePrice * qualityMultiplier);
};

export const generateProperties = (count: number = 50): Property[] => {
  const properties: Property[] = [];
  const propertyTypes: PropertyType[] = [
    'Penthouse', 'Villa', 'Apartment', 'Studio', 'Mansion',
    'Office', 'Store', 'Restaurant', 'Hotel', 'Land'
  ];

  for (let i = 0; i < count; i++) {
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const quality = 50 + Math.random() * 50; // 50-100 quality
    const names = propertyNames[type];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    
    // Position properties in a grid-like city layout with some randomness
    const gridX = (i % 10) * 50;
    const gridZ = Math.floor(i / 10) * 50;
    const randomOffsetX = (Math.random() - 0.5) * 20;
    const randomOffsetZ = (Math.random() - 0.5) * 20;

    properties.push({
      id: `property-${i + 1}`,
      name: `${names[Math.floor(Math.random() * names.length)]} ${i + 1}`,
      type,
      position: {
        x: gridX + randomOffsetX,
        y: 0,
        z: gridZ + randomOffsetZ
      },
      size: getPropertySize(type),
      price: getPropertyPrice(type, quality),
      ownerId: Math.random() > 0.7 ? null : `owner-${Math.floor(Math.random() * 20)}`,
      forSale: Math.random() > 0.5,
      features: getPropertyFeatures(type),
      quality: Math.round(quality),
      neighborhood,
      description: `Beautiful ${type.toLowerCase()} in ${neighborhood}. This property features premium amenities and is located in one of the most desirable areas of Meta World.`
    });
  }

  return properties;
};
