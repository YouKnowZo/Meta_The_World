import { useState, useEffect } from 'react';
import { useWorldStore } from '../../stores/worldStore';
import { Home, DollarSign, MapPin, Plus } from 'lucide-react';
import axios from 'axios';

export default function PropertyPanel({ onClose }) {
  const { selectedProperty } = useWorldStore();
  const [myProperties, setMyProperties] = useState([]);
  const [listingPrice, setListingPrice] = useState('');

  useEffect(() => {
    loadMyProperties();
  }, []);

  const loadMyProperties = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setMyProperties(res.data.ownedProperties || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
  };

  const handleListProperty = async (propertyId) => {
    if (!listingPrice || isNaN(listingPrice)) {
      alert('Please enter a valid price');
      return;
    }

    try {
      await axios.put(`/api/properties/${propertyId}/list`, { price: parseFloat(listingPrice) });
      alert('Property listed successfully!');
      setListingPrice('');
      loadMyProperties();
    } catch (error) {
      alert(`Failed to list property: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Home className="w-8 h-8" />
        My Properties
      </h2>

      {myProperties.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          You don't own any properties yet
        </div>
      ) : (
        <div className="space-y-4">
          {myProperties.map((property) => (
            <div
              key={property._id}
              className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold mb-1 capitalize">{property.propertyType}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    ({property.coordinates.x}, {property.coordinates.z})
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-semibold ${
                  property.listed
                    ? 'bg-green-600/30 text-green-300'
                    : 'bg-gray-600/30 text-gray-300'
                }`}>
                  {property.listed ? 'Listed' : 'Unlisted'}
                </div>
              </div>

              {property.listed ? (
                <div className="flex items-center gap-2 text-purple-400 font-semibold mb-3">
                  <DollarSign className="w-5 h-5" />
                  {property.price?.toLocaleString()}
                </div>
              ) : (
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    placeholder="Listing price"
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleListProperty(property._id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    List
                  </button>
                </div>
              )}

              {property.listed && (
                <button
                  onClick={async () => {
                    try {
                      await axios.put(`/api/properties/${property._id}/unlist`);
                      loadMyProperties();
                    } catch (error) {
                      alert('Failed to unlist property');
                    }
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Unlist Property
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
