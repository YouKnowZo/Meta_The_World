import { useState, useEffect } from 'react';
import { Heart, Plus, Utensils, Gamepad2 } from 'lucide-react';
import axios from 'axios';

const petTypes = [
  { type: 'dog', name: 'Dog', cost: 500 },
  { type: 'cat', name: 'Cat', cost: 400 },
  { type: 'bird', name: 'Bird', cost: 200 },
  { type: 'fish', name: 'Fish', cost: 100 },
  { type: 'reptile', name: 'Reptile', cost: 600 },
  { type: 'exotic', name: 'Exotic', cost: 1000 }
];

export default function PetPanel({ onClose }) {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [adopting, setAdopting] = useState(false);
  const [adoptionForm, setAdoptionForm] = useState({
    name: '',
    type: 'dog',
    breed: '',
    color: '#ff6b6b'
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const res = await axios.get('/api/pets/my-pets');
      setPets(res.data);
      if (res.data.length > 0 && !selectedPet) {
        setSelectedPet(res.data[0]);
      }
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  };

  const handleAdopt = async () => {
    const petType = petTypes.find(p => p.type === adoptionForm.type);
    if (!adoptionForm.name.trim()) {
      alert('Please enter a name for your pet');
      return;
    }
    if (confirm(`Adopt a ${petType.name} for $${petType.cost.toLocaleString()}?`)) {
      try {
        const res = await axios.post('/api/pets/adopt', {
          ...adoptionForm,
          cost: petType.cost
        });
        alert('Pet adopted successfully!');
        setAdopting(false);
        setAdoptionForm({ name: '', type: 'dog', breed: '', color: '#ff6b6b' });
        loadPets();
      } catch (error) {
        alert(`Adoption failed: ${error.response?.data?.error || 'Unknown error'}`);
      }
    }
  };

  const handleFeed = async () => {
    if (!selectedPet) return;
    try {
      await axios.put(`/api/pets/${selectedPet._id}/feed`);
      loadPets();
    } catch (error) {
      console.error('Failed to feed pet:', error);
    }
  };

  const handlePlay = async () => {
    if (!selectedPet) return;
    try {
      await axios.put(`/api/pets/${selectedPet._id}/play`);
      loadPets();
    } catch (error) {
      console.error('Failed to play with pet:', error);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Heart className="w-8 h-8 text-pink-500" />
        My Pets
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">My Pets</h3>
            <button
              onClick={() => setAdopting(!adopting)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adopt Pet
            </button>
          </div>

          {adopting ? (
            <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-4 space-y-4 mb-4">
              <h4 className="text-lg font-semibold">Adopt a Pet</h4>
              <div>
                <label className="block text-white/90 mb-2">Pet Name</label>
                <input
                  type="text"
                  value={adoptionForm.name}
                  onChange={(e) => setAdoptionForm({ ...adoptionForm, name: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
                  placeholder="Enter pet name"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2">Pet Type</label>
                <select
                  value={adoptionForm.type}
                  onChange={(e) => setAdoptionForm({ ...adoptionForm, type: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                >
                  {petTypes.map((pt) => (
                    <option key={pt.type} value={pt.type}>
                      {pt.name} - ${pt.cost.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/90 mb-2">Breed (Optional)</label>
                <input
                  type="text"
                  value={adoptionForm.breed}
                  onChange={(e) => setAdoptionForm({ ...adoptionForm, breed: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
                  placeholder="e.g., Golden Retriever"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2">Color</label>
                <input
                  type="color"
                  value={adoptionForm.color}
                  onChange={(e) => setAdoptionForm({ ...adoptionForm, color: e.target.value })}
                  className="w-full h-12 rounded cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAdopting(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdopt}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Adopt
                </button>
              </div>
            </div>
          ) : null}

          {pets.length === 0 ? (
            <div className="text-center py-12 text-white/60 bg-gray-800/50 rounded-lg">
              No pets yet. Adopt one to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  onClick={() => setSelectedPet(pet)}
                  className={`bg-gray-800/50 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPet?._id === pet._id
                      ? 'border-pink-500 bg-pink-600/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: pet.color + '40' }}
                    >
                      {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : pet.type === 'bird' ? '🐦' : pet.type === 'fish' ? '🐠' : '🦎'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{pet.name}</h4>
                      <p className="text-white/60 text-sm capitalize">{pet.type} {pet.breed && `• ${pet.breed}`}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-yellow-400">Happiness: {pet.happiness}%</span>
                        <span className="text-orange-400">Hunger: {pet.hunger}%</span>
                        <span className="text-blue-400">Energy: {pet.energy}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPet && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Pet Care</h3>
            <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-4 space-y-4">
              <div className="text-center">
                <div
                  className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-6xl mb-4"
                  style={{ backgroundColor: selectedPet.color + '40' }}
                >
                  {selectedPet.type === 'dog' ? '🐕' : selectedPet.type === 'cat' ? '🐱' : selectedPet.type === 'bird' ? '🐦' : selectedPet.type === 'fish' ? '🐠' : '🦎'}
                </div>
                <h4 className="text-2xl font-bold">{selectedPet.name}</h4>
                <p className="text-white/60 capitalize">{selectedPet.type} {selectedPet.breed && `• ${selectedPet.breed}`}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Happiness</span>
                  <span className="text-yellow-400">{selectedPet.happiness}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${selectedPet.happiness}%` }}
                  />
                </div>

                <div className="flex justify-between mt-3">
                  <span>Hunger</span>
                  <span className="text-orange-400">{selectedPet.hunger}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: `${selectedPet.hunger}%` }}
                  />
                </div>

                <div className="flex justify-between mt-3">
                  <span>Energy</span>
                  <span className="text-blue-400">{selectedPet.energy}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${selectedPet.energy}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleFeed}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Utensils className="w-5 h-5" />
                  Feed
                </button>
                <button
                  onClick={handlePlay}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Gamepad2 className="w-5 h-5" />
                  Play
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
