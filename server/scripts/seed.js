import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedProperties = [
  {
    tokenId: 1,
    coordinates: { x: 10, z: 10, width: 20, depth: 20 },
    propertyType: 'residential',
    listed: true,
    price: 50000,
    description: 'Beautiful starter home with modern amenities',
    features: ['2 bedrooms', '1 bathroom', 'garden', 'parking']
  },
  {
    tokenId: 2,
    coordinates: { x: -15, z: 20, width: 30, depth: 30 },
    propertyType: 'commercial',
    listed: true,
    price: 150000,
    description: 'Prime commercial space for your business',
    features: ['high traffic', 'parking', 'storefront', 'office space']
  },
  {
    tokenId: 3,
    coordinates: { x: 30, z: -10, width: 50, depth: 50 },
    propertyType: 'luxury',
    listed: true,
    price: 500000,
    description: 'Luxury estate with stunning views',
    features: ['5 bedrooms', 'pool', 'gym', 'home theater', 'wine cellar']
  },
  {
    tokenId: 4,
    coordinates: { x: -25, z: -30, width: 40, depth: 40 },
    propertyType: 'land',
    listed: true,
    price: 25000,
    description: 'Empty plot ready for your dream build',
    features: ['waterfront', 'zoning approved', 'utilities ready']
  },
  {
    tokenId: 5,
    coordinates: { x: 50, z: 50, width: 100, depth: 100 },
    propertyType: 'island',
    listed: true,
    price: 1000000,
    description: 'Private island paradise',
    features: ['beach', 'tropical', 'privacy', 'helicopter pad']
  },
  {
    tokenId: 6,
    coordinates: { x: 0, z: 0, width: 15, depth: 15 },
    propertyType: 'skybox',
    listed: true,
    price: 75000,
    description: 'Floating skybox with panoramic views',
    features: ['360 views', 'private', 'modern design', 'elevator access']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-the-world');
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out to keep existing data)
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Create demo user if doesn't exist
    let demoUser = await User.findOne({ email: 'demo@metaworld.com' });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      demoUser = new User({
        username: 'DemoUser',
        email: 'demo@metaworld.com',
        password: hashedPassword,
        balance: 10000
      });
      await demoUser.save();
      console.log('Created demo user');
    }

    // Create properties
    for (const propData of seedProperties) {
      const property = new Property({
        ...propData,
        owner: demoUser._id
      });
      await property.save();
      console.log(`Created property: ${propData.propertyType} at (${propData.coordinates.x}, ${propData.coordinates.z})`);
    }

    // Update user's owned properties
    const properties = await Property.find({ owner: demoUser._id });
    demoUser.ownedProperties = properties.map(p => p._id);
    await demoUser.save();

    console.log('\n✅ Seeding completed successfully!');
    console.log(`\nDemo account:`);
    console.log(`Email: demo@metaworld.com`);
    console.log(`Password: demo123`);
    console.log(`\nCreated ${seedProperties.length} properties`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
