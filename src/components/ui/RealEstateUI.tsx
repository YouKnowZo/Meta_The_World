import { useState } from 'react';
import { useGameStore } from '../../store';
import { X, Home, DollarSign, MapPin, Star, TrendingUp, CheckCircle } from 'lucide-react';
import type { Property } from '../../types';

export function RealEstateUI() {
  const showRealEstateUI = useGameStore((state) => state.showRealEstateUI);
  const setShowRealEstateUI = useGameStore((state) => state.setShowRealEstateUI);
  const selectedProperty = useGameStore((state) => state.selectedProperty);
  const setSelectedProperty = useGameStore((state) => state.setSelectedProperty);
  const allProperties = useGameStore((state) => state.allProperties);
  const user = useGameStore((state) => state.user);
  const purchaseProperty = useGameStore((state) => state.purchaseProperty);
  const earnCommission = useGameStore((state) => state.earnCommission);
  const addNotification = useGameStore((state) => state.addNotification);

  const [filter, setFilter] = useState<'all' | 'forSale' | 'owned'>('forSale');

  if (!showRealEstateUI) return null;

  const filteredProperties = allProperties.filter((prop) => {
    if (filter === 'forSale') return prop.forSale && !prop.ownerId;
    if (filter === 'owned') return user.properties.some(p => p.id === prop.id);
    return true;
  });

  const handleBuyProperty = (property: Property) => {
    if (user.wallet >= property.price) {
      purchaseProperty(property);
      setSelectedProperty(null);
    }
  };

  const handleFacilitateSale = (property: Property) => {
    if (user.career.type === 'RealEstateAgent') {
      earnCommission(property.id, property.price);
      addNotification({
        type: 'success',
        title: 'Sale Facilitated!',
        message: `You helped sell ${property.name}`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Real Estate Market</h2>
              <p className="text-blue-100">Your gateway to property ownership in Meta World</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowRealEstateUI(false);
              setSelectedProperty(null);
            }}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Property List */}
          <div className="w-1/2 border-r border-white/10 overflow-y-auto">
            {/* Filter Tabs */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 p-4 z-10">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('forSale')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === 'forSale'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  For Sale ({allProperties.filter(p => p.forSale && !p.ownerId).length})
                </button>
                <button
                  onClick={() => setFilter('owned')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === 'owned'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  My Properties ({user.properties.length})
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  All Properties ({allProperties.length})
                </button>
              </div>
            </div>

            {/* Property Cards */}
            <div className="p-4 space-y-3">
              {filteredProperties.map((property) => {
                const isOwned = user.properties.some(p => p.id === property.id);
                const isSelected = selectedProperty?.id === property.id;

                return (
                  <div
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className={`bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-4 cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">{property.name}</h3>
                        <p className="text-gray-400 text-sm">{property.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{(property.quality / 20).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{property.neighborhood}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <span className="text-white font-bold text-xl">
                          {property.price.toLocaleString()} MC
                        </span>
                      </div>
                      {isOwned && (
                        <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                          OWNED
                        </div>
                      )}
                      {property.forSale && !isOwned && (
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                          FOR SALE
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Property Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedProperty ? (
              <div className="p-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 mb-6 border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProperty.name}</h2>
                  <p className="text-gray-300 mb-6">{selectedProperty.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/30 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Type</div>
                      <div className="text-white font-semibold">{selectedProperty.type}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Neighborhood</div>
                      <div className="text-white font-semibold">{selectedProperty.neighborhood}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Quality Rating</div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">
                          {(selectedProperty.quality / 20).toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">Price</div>
                      <div className="text-green-400 font-bold text-xl">
                        {selectedProperty.price.toLocaleString()} MC
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold text-lg mb-3">Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="bg-black/30 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">{feature.name}</div>
                          <div className="text-white font-medium">{feature.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {selectedProperty.forSale && !user.properties.some(p => p.id === selectedProperty.id) && (
                      <>
                        <button
                          onClick={() => handleBuyProperty(selectedProperty)}
                          disabled={user.wallet < selectedProperty.price}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          {user.wallet >= selectedProperty.price
                            ? 'Purchase Property'
                            : `Need ${(selectedProperty.price - user.wallet).toLocaleString()} more MC`}
                        </button>

                        {user.career.type === 'RealEstateAgent' && (
                          <button
                            onClick={() => handleFacilitateSale(selectedProperty)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <TrendingUp className="w-5 h-5" />
                            Facilitate Sale (Earn {(selectedProperty.price * user.career.commissionRate).toFixed(0)} MC)
                          </button>
                        )}
                      </>
                    )}

                    {user.properties.some(p => p.id === selectedProperty.id) && (
                      <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-blue-400 font-semibold">You own this property!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Home className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Select a property to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
