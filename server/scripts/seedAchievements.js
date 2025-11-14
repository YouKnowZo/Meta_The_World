import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Achievement from '../models/Achievement.js';

dotenv.config();

const achievements = [
  {
    name: 'First Purchase',
    description: 'Make your first purchase',
    category: 'shopping',
    rarity: 'common',
    requirements: { type: 'buy_item', value: 1 },
    rewards: { currency: 100, experience: 50 }
  },
  {
    name: 'Property Mogul',
    description: 'Own 10 properties',
    category: 'real_estate',
    rarity: 'epic',
    requirements: { type: 'property_count', value: 10 },
    rewards: { currency: 5000, experience: 1000, title: 'Property Mogul' }
  },
  {
    name: 'Social Star',
    description: 'Have 50 friends',
    category: 'social',
    rarity: 'rare',
    requirements: { type: 'friend_count', value: 50 },
    rewards: { currency: 2000, experience: 500, title: 'Social Star' }
  },
  {
    name: 'Level 10',
    description: 'Reach level 10',
    category: 'general',
    rarity: 'rare',
    requirements: { type: 'level', value: 10 },
    rewards: { currency: 1000, experience: 0, title: 'Veteran' }
  },
  {
    name: 'Millionaire',
    description: 'Accumulate 1,000,000 currency',
    category: 'general',
    rarity: 'legendary',
    requirements: { type: 'balance', value: 1000000 },
    rewards: { currency: 10000, experience: 2000, title: 'Millionaire' }
  },
  {
    name: 'Pet Lover',
    description: 'Own 5 pets',
    category: 'pets',
    rarity: 'rare',
    requirements: { type: 'pet_count', value: 5 },
    rewards: { currency: 1500, experience: 300 }
  },
  {
    name: 'Car Collector',
    description: 'Own 5 cars',
    category: 'cars',
    rarity: 'rare',
    requirements: { type: 'car_count', value: 5 },
    rewards: { currency: 2000, experience: 400 }
  },
  {
    name: 'Quest Master',
    description: 'Complete 50 quests',
    category: 'general',
    rarity: 'epic',
    requirements: { type: 'quests_completed', value: 50 },
    rewards: { currency: 3000, experience: 750, title: 'Quest Master' }
  }
];

async function seedAchievements() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-the-world');
    console.log('Connected to MongoDB');

    await Achievement.deleteMany({});
    console.log('Cleared existing achievements');

    for (const achievementData of achievements) {
      const achievement = new Achievement(achievementData);
      await achievement.save();
      console.log(`Created achievement: ${achievement.name}`);
    }

    console.log('\n✅ Achievements seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }
}

seedAchievements();
