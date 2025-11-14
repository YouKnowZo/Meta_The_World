const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-world');
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Property.deleteMany({});

    // Create sample properties
    const properties = [
      {
        name: 'Sunset Villa',
        description: 'A luxurious villa with stunning sunset views over the virtual ocean. Perfect for those seeking tranquility and elegance.',
        type: 'luxury',
        location: { x: 30, y: 0, z: 40, region: 'Coastal District' },
        size: { width: 20, height: 15, depth: 20 },
        price: 50000,
        listed: true,
        features: [
          { name: 'Bedrooms', value: '5' },
          { name: 'Bathrooms', value: '4' },
          { name: 'Ocean View', value: 'Yes' },
          { name: 'Pool', value: 'Infinity Pool' }
        ]
      },
      {
        name: 'Downtown Loft',
        description: 'Modern loft in the heart of the city. Perfect for urban living with easy access to all amenities.',
        type: 'residential',
        location: { x: -25, y: 0, z: 15, region: 'City Center' },
        size: { width: 15, height: 10, depth: 15 },
        price: 25000,
        listed: true,
        features: [
          { name: 'Bedrooms', value: '2' },
          { name: 'Bathrooms', value: '2' },
          { name: 'Floor', value: '15th' },
          { name: 'Parking', value: 'Included' }
        ]
      },
      {
        name: 'Commercial Plaza',
        description: 'Prime commercial space for your business. High foot traffic area with excellent visibility.',
        type: 'commercial',
        location: { x: 45, y: 0, z: -30, region: 'Business District' },
        size: { width: 30, height: 20, depth: 30 },
        price: 100000,
        listed: true,
        features: [
          { name: 'Square Footage', value: '900 sq ft' },
          { name: 'Parking Spaces', value: '10' },
          { name: 'Visibility', value: 'High' },
          { name: 'Zoning', value: 'Commercial' }
        ]
      },
      {
        name: 'Mountain Estate',
        description: 'Sprawling estate on the mountainside. Breathtaking views and complete privacy.',
        type: 'estate',
        location: { x: -60, y: 0, z: 50, region: 'Mountain Range' },
        size: { width: 50, height: 25, depth: 50 },
        price: 200000,
        listed: true,
        features: [
          { name: 'Bedrooms', value: '8' },
          { name: 'Bathrooms', value: '6' },
          { name: 'Acres', value: '5' },
          { name: 'Mountain View', value: '360°' }
        ]
      },
      {
        name: 'Beachfront Land',
        description: 'Prime undeveloped land on the beach. Build your dream property here.',
        type: 'land',
        location: { x: 70, y: 0, z: -50, region: 'Beach District' },
        size: { width: 25, height: 1, depth: 25 },
        price: 75000,
        listed: true,
        features: [
          { name: 'Waterfront', value: 'Yes' },
          { name: 'Zoning', value: 'Residential' },
          { name: 'Utilities', value: 'Available' },
          { name: 'Access', value: 'Road Access' }
        ]
      },
      {
        name: 'Skyline Penthouse',
        description: 'Ultra-modern penthouse with panoramic city views. The ultimate in luxury living.',
        type: 'luxury',
        location: { x: 0, y: 0, z: 0, region: 'City Center' },
        size: { width: 18, height: 12, depth: 18 },
        price: 150000,
        listed: true,
        features: [
          { name: 'Bedrooms', value: '4' },
          { name: 'Bathrooms', value: '3' },
          { name: 'Floor', value: 'Top Floor' },
          { name: 'City View', value: '360°' },
          { name: 'Rooftop Terrace', value: 'Yes' }
        ]
      }
    ];

    // Check if properties already exist
    const existingProperties = await Property.countDocuments();
    if (existingProperties === 0) {
      for (const propData of properties) {
        const property = new Property(propData);
        await property.save();
        console.log(`Created property: ${property.name}`);
      }
      console.log(`\n✅ Seeded ${properties.length} properties successfully!`);
    } else {
      console.log(`\n⚠️  Properties already exist (${existingProperties} found). Skipping seed.`);
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
