import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quest from '../models/Quest.js';

dotenv.config();

const quests = [
  {
    title: 'First Steps',
    description: 'Complete your first purchase',
    type: 'story',
    objectives: [
      { type: 'buy_item', target: 'any', required: 1 }
    ],
    rewards: {
      currency: 500,
      experience: 100
    },
    isActive: true
  },
  {
    title: 'Daily Shopper',
    description: 'Buy 5 items from stores today',
    type: 'daily',
    objectives: [
      { type: 'buy_item', target: 'any', required: 5 }
    ],
    rewards: {
      currency: 200,
      experience: 50
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Property Owner',
    description: 'Own your first property',
    type: 'achievement',
    objectives: [
      { type: 'own_property', target: 'any', required: 1 }
    ],
    rewards: {
      currency: 1000,
      experience: 200
    },
    isActive: true
  },
  {
    title: 'Social Butterfly',
    description: 'Make 3 new friends',
    type: 'weekly',
    objectives: [
      { type: 'make_friend', target: 'any', required: 3 }
    ],
    rewards: {
      currency: 500,
      experience: 150
    },
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'City Explorer',
    description: 'Visit all cities',
    type: 'achievement',
    objectives: [
      { type: 'visit_city', target: 'all', required: 3 }
    ],
    rewards: {
      currency: 2000,
      experience: 500
    },
    isActive: true
  }
];

async function seedQuests() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-the-world');
    console.log('Connected to MongoDB');

    await Quest.deleteMany({});
    console.log('Cleared existing quests');

    for (const questData of quests) {
      const quest = new Quest(questData);
      await quest.save();
      console.log(`Created quest: ${quest.title}`);
    }

    console.log('\n✅ Quests seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding quests:', error);
    process.exit(1);
  }
}

seedQuests();
