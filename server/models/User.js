import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, unique: true, sparse: true },
  avatar: {
    appearance: {
      skinColor: String,
      hairColor: String,
      hairStyle: String,
      eyeColor: String,
      bodyType: String,
      height: Number,
    },
    clothing: {
      outfit: String,
      accessories: [String],
    }
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
    rotation: { type: Number, default: 0 }
  },
  profession: { type: String, default: 'citizen' },
  isRealEstateAgent: { type: Boolean, default: false },
  agentLicense: String,
  agentCommissionRate: { type: Number, default: 0.05 }, // 5% default
  balance: { type: Number, default: 10000 }, // Starting virtual currency (10,000 for new users)
  ownedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  ownedCars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  ownedPets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }],
  currentCity: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  stats: {
    hunger: { type: Number, default: 100, min: 0, max: 100 },
    energy: { type: Number, default: 100, min: 0, max: 100 },
    happiness: { type: Number, default: 100, min: 0, max: 100 },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 }
  },
  social: {
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
  },
  settings: {
    graphics: {
      quality: { type: String, enum: ['low', 'medium', 'high', 'ultra'], default: 'medium' },
      shadows: { type: Boolean, default: true },
      antialiasing: { type: Boolean, default: true }
    },
    audio: {
      masterVolume: { type: Number, default: 100, min: 0, max: 100 },
      musicVolume: { type: Number, default: 70, min: 0, max: 100 },
      sfxVolume: { type: Number, default: 100, min: 0, max: 100 },
      voiceVolume: { type: Number, default: 100, min: 0, max: 100 }
    },
    controls: {
      mouseSensitivity: { type: Number, default: 1.0 },
      invertY: { type: Boolean, default: false }
    },
    privacy: {
      showOnlineStatus: { type: Boolean, default: true },
      allowFriendRequests: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true }
    },
    notifications: {
      enabled: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      transactions: { type: Boolean, default: true },
      quests: { type: Boolean, default: true }
    }
  },
  tutorialCompleted: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
