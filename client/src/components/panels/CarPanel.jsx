import { useState, useEffect } from 'react';
import { Car, Palette, Settings, DollarSign } from 'lucide-react';
import axios from 'axios';

export default function CarPanel({ onClose }) {
  const [cars, setCars] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [customization, setCustomization] = useState({
    color: '#000000',
    wheels: 'standard',
    spoiler: false,
    tint: 'none',
    neon: false,
    neonColor: '#00ffff'
  });

  useEffect(() => {
    loadCars();
    loadModels();
  }, []);

  const loadCars = async () => {
    try {
      const res = await axios.get('/api/cars/my-cars');
      setCars(res.data);
      if (res.data.length > 0 && !selectedCar) {
        setSelectedCar(res.data[0]);
        setCustomization(res.data[0].customization || customization);
      }
    } catch (error) {
      console.error('Failed to load cars:', error);
    }
  };

  const loadModels = async () => {
    try {
      const res = await axios.get('/api/cars/models');
      setModels(res.data);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const handlePurchase = async (modelIndex) => {
    const model = models[modelIndex];
    if (confirm(`Purchase ${model.brand} ${model.model} for $${model.basePrice.toLocaleString()}?`)) {
      try {
        const res = await axios.post('/api/cars/purchase', { modelIndex });
        alert('Car purchased successfully!');
        loadCars();
      } catch (error) {
        alert(`Purchase failed: ${error.response?.data?.error || 'Unknown error'}`);
      }
    }
  };

  const handleCustomize = async () => {
    if (!selectedCar) return;
    
    try {
      const res = await axios.put(`/api/cars/${selectedCar._id}/customize`, {
        customization,
        cost: 0 // Calculate cost based on changes
      });
      alert('Car customized!');
      loadCars();
    } catch (error) {
      alert(`Customization failed: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Car className="w-8 h-8" />
        My Garage
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">My Cars</h3>
          {cars.length === 0 ? (
            <div className="text-center py-12 text-white/60 bg-gray-800/50 rounded-lg">
              No cars yet. Buy one from the dealership!
            </div>
          ) : (
            <div className="space-y-3">
              {cars.map((car) => (
                <div
                  key={car._id}
                  onClick={() => {
                    setSelectedCar(car);
                    setCustomization(car.customization || customization);
                  }}
                  className={`bg-gray-800/50 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCar?._id === car._id
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {car.brand} {car.model}
                      </h4>
                      <p className="text-white/60 text-sm">
                        Speed: {car.stats.speed} | Fuel: {car.stats.fuel}%
                      </p>
                    </div>
                    <div
                      className="w-16 h-16 rounded"
                      style={{ backgroundColor: car.customization?.color || '#000000' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Buy New Car</h3>
            <div className="space-y-3">
              {models.map((model, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {model.brand} {model.model}
                      </h4>
                      <p className="text-white/60 text-sm">Base model</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 font-bold">
                        <DollarSign className="w-5 h-5 inline" />
                        {model.basePrice.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handlePurchase(index)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedCar && (
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Customize
            </h3>
            <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-white/90 mb-2">Color</label>
                <input
                  type="color"
                  value={customization.color}
                  onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                  className="w-full h-12 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2">Wheels</label>
                <select
                  value={customization.wheels}
                  onChange={(e) => setCustomization({ ...customization, wheels: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="standard">Standard</option>
                  <option value="sport">Sport</option>
                  <option value="luxury">Luxury</option>
                  <option value="racing">Racing</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/90 mb-2">
                  <input
                    type="checkbox"
                    checked={customization.spoiler}
                    onChange={(e) => setCustomization({ ...customization, spoiler: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Spoiler (+$800)
                </label>
              </div>

              <div>
                <label className="block text-white/90 mb-2">Window Tint</label>
                <select
                  value={customization.tint}
                  onChange={(e) => setCustomization({ ...customization, tint: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="none">None</option>
                  <option value="light">Light (+$200)</option>
                  <option value="medium">Medium (+$300)</option>
                  <option value="dark">Dark (+$400)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/90 mb-2">
                  <input
                    type="checkbox"
                    checked={customization.neon}
                    onChange={(e) => setCustomization({ ...customization, neon: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Neon Lights (+$500)
                </label>
                {customization.neon && (
                  <input
                    type="color"
                    value={customization.neonColor}
                    onChange={(e) => setCustomization({ ...customization, neonColor: e.target.value })}
                    className="w-full h-12 rounded cursor-pointer mt-2"
                  />
                )}
              </div>

              <button
                onClick={handleCustomize}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Apply Customization
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
