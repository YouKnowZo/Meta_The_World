import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from '../models/Store.js';
import Product from '../models/Product.js';

dotenv.config();

const productsByType = {
  food: [
    { name: 'Burger', price: 10, hungerRestore: 30, energyRestore: 10 },
    { name: 'Pizza Slice', price: 8, hungerRestore: 25, energyRestore: 8 },
    { name: 'Salad', price: 12, hungerRestore: 20, energyRestore: 15 },
    { name: 'Energy Drink', price: 5, hungerRestore: 5, energyRestore: 40 },
    { name: 'Coffee', price: 4, hungerRestore: 2, energyRestore: 20 },
    { name: 'Sandwich', price: 9, hungerRestore: 28, energyRestore: 12 }
  ],
  clothing: [
    { name: 'Casual T-Shirt', price: 50, style: 'casual', rarity: 'common' },
    { name: 'Designer Jacket', price: 500, style: 'luxury', rarity: 'rare' },
    { name: 'Sneakers', price: 150, style: 'sporty', rarity: 'common' },
    { name: 'Formal Suit', price: 800, style: 'formal', rarity: 'epic' },
    { name: 'Summer Dress', price: 200, style: 'elegant', rarity: 'rare' },
    { name: 'Legendary Outfit', price: 5000, style: 'legendary', rarity: 'legendary' }
  ],
  pet: [
    { name: 'Dog Food', price: 20, petType: 'dog' },
    { name: 'Cat Food', price: 20, petType: 'cat' },
    { name: 'Bird Seed', price: 15, petType: 'bird' },
    { name: 'Pet Toy', price: 30, petType: 'all' },
    { name: 'Pet Bed', price: 100, petType: 'all' },
    { name: 'Pet Accessory', price: 50, petType: 'all' }
  ],
  'car-part': [
    { name: 'Performance Engine', price: 5000, partType: 'engine', performanceBoost: 20 },
    { name: 'Racing Wheels', price: 2000, partType: 'wheels', performanceBoost: 10 },
    { name: 'Turbo Charger', price: 8000, partType: 'engine', performanceBoost: 30 },
    { name: 'Body Kit', price: 3000, partType: 'body', performanceBoost: 5 }
  ],
  'car-accessory': [
    { name: 'Neon Lights', price: 500 },
    { name: 'Window Tint', price: 200 },
    { name: 'Spoiler', price: 800 },
    { name: 'Custom Paint', price: 1500 }
  ]
};

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-the-world');
    console.log('Connected to MongoDB');

    const stores = await Store.find();
    
    for (const store of stores) {
      const products = productsByType[store.storeType] || [];
      
      for (const productData of products) {
        const product = new Product({
          ...productData,
          store: store._id,
          category: store.storeType === 'car-dealership' ? 'car-part' : store.storeType,
          attributes: {
            ...(productData.hungerRestore && { hungerRestore: productData.hungerRestore }),
            ...(productData.energyRestore && { energyRestore: productData.energyRestore }),
            ...(productData.style && { style: productData.style, rarity: productData.rarity }),
            ...(productData.petType && { petType: productData.petType }),
            ...(productData.partType && { partType: productData.partType, performanceBoost: productData.performanceBoost })
          }
        });
        await product.save();
        store.products.push(product._id);
      }
      
      await store.save();
      console.log(`Added products to ${store.name}`);
    }

    console.log('\n✅ Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
