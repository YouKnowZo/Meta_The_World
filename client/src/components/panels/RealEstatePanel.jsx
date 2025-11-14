import { useEffect, useState } from 'react';
import { useWorldStore } from '../../stores/worldStore';
import { Building2, MapPin, DollarSign, Home } from 'lucide-react';
import axios from 'axios';

export default function RealEstatePanel({ onClose }) {
  const { properties, selectProperty, purchaseProperty } = useWorldStore();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const res = await axios.get('/api/properties');
      setListings(res.data.filter(p => p.listed));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load listings:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async (property) => {
    if (confirm(`Purchase this property for $${property.price?.toLocaleString()}?`)) {
      const result = await purchaseProperty(
        property._id,
        property.owner?._id,
        null,
        property.price
      );
      if (result.success) {
        alert('Property purchased successfully!');
        loadListings();
      } else {
        alert(`Purchase failed: ${result.error}`);
      }
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Building2 className="w-8 h-8" />
        Real Estate Marketplace
      </h2>

      {loading ? (
        <div className="text-center py-12">Loading properties...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          No properties currently listed
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((property) => (
            <div
              key={property._id}
              className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/60 transition-all cursor-pointer"
              onClick={() => selectProperty(property)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{property.propertyType}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    ({property.coordinates.x}, {property.coordinates.z})
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  <DollarSign className="w-6 h-6 inline" />
                  {property.price?.toLocaleString()}
                </div>
              </div>

              {property.description && (
                <p className="text-white/70 text-sm mb-3">{property.description}</p>
              )}

              <div className="flex gap-2 flex-wrap mb-3">
                {property.features?.slice(0, 3).map((feature, i) => (
                  <span
                    key={i}
                    className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(property);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Purchase Property
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
