import { useState, useEffect } from 'react';
import { Store, ShoppingCart, DollarSign, UtensilsCrossed, Shirt, Heart } from 'lucide-react';
import axios from 'axios';

const storeIcons = {
  food: UtensilsCrossed,
  clothing: Shirt,
  pet: Heart,
  restaurant: UtensilsCrossed,
  'car-dealership': ShoppingCart
};

export default function StorePanel({ onClose, cityId }) {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, [cityId]);

  useEffect(() => {
    if (selectedStore) {
      loadProducts();
    }
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      const params = cityId ? { cityId } : {};
      const res = await axios.get('/api/stores', { params });
      setStores(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stores:', error);
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get(`/api/stores/${selectedStore._id}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handlePurchase = async (product, quantity = 1) => {
    if (confirm(`Purchase ${product.name} for $${(product.price * quantity).toLocaleString()}?`)) {
      try {
        const res = await axios.post(`/api/stores/${selectedStore._id}/purchase`, {
          productId: product._id,
          quantity
        });
        alert('Purchase successful!');
        loadProducts();
      } catch (error) {
        alert(`Purchase failed: ${error.response?.data?.error || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Store className="w-8 h-8" />
        Stores & Shopping
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Stores</h3>
          {loading ? (
            <div className="text-center py-12 text-white/60">Loading stores...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12 text-white/60 bg-gray-800/50 rounded-lg">
              No stores available
            </div>
          ) : (
            <div className="space-y-2">
              {stores.map((store) => {
                const Icon = storeIcons[store.storeType] || Store;
                return (
                  <div
                    key={store._id}
                    onClick={() => setSelectedStore(store)}
                    className={`bg-gray-800/50 border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedStore?._id === store._id
                        ? 'border-purple-500 bg-purple-600/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-purple-400" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{store.name}</h4>
                        <p className="text-white/60 text-sm capitalize">{store.storeType}</p>
                      </div>
                      {store.isOpen ? (
                        <span className="text-green-400 text-xs">Open</span>
                      ) : (
                        <span className="text-red-400 text-xs">Closed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedStore ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">{selectedStore.name}</h3>
              {products.length === 0 ? (
                <div className="text-center py-12 text-white/60 bg-gray-800/50 rounded-lg">
                  No products available
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                    >
                      <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                      {product.description && (
                        <p className="text-white/70 text-sm mb-3">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-purple-400 font-bold">
                          <DollarSign className="w-5 h-5 inline" />
                          {product.price.toLocaleString()}
                        </div>
                        <button
                          onClick={() => handlePurchase(product)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Buy
                        </button>
                      </div>
                      {product.attributes?.hungerRestore && (
                        <p className="text-green-400 text-xs mt-2">
                          +{product.attributes.hungerRestore} Hunger
                        </p>
                      )}
                      {product.attributes?.energyRestore && (
                        <p className="text-blue-400 text-xs mt-1">
                          +{product.attributes.energyRestore} Energy
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-white/60 bg-gray-800/50 rounded-lg">
              Select a store to view products
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
