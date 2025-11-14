import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './PropertyMarketplace.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PropertyMarketplace = () => {
  const { user, token, updateUser } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    district: '',
    minPrice: '',
    maxPrice: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.district) params.append('district', filters.district);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('isListed', 'true');

      const response = await axios.get(`${API_URL}/properties?${params}`);
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = properties.filter(p => p.isListed);

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.district) {
      filtered = filtered.filter(p => p.location.district === filters.district);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    }

    setFilteredProperties(filtered);
  };

  const handlePurchase = async () => {
    if (!selectedProperty) return;

    try {
      const response = await axios.post(
        `${API_URL}/transactions/purchase`,
        { propertyId: selectedProperty._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        updateUser({ virtualCurrency: response.data.newBalance });
        setShowPurchaseModal(false);
        setSelectedProperty(null);
        fetchProperties();
        alert('Property purchased successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Purchase failed');
    }
  };

  if (loading) {
    return <div className="marketplace-loading">Loading properties...</div>;
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1>Property Marketplace</h1>
        <p>Explore and purchase virtual real estate</p>
      </div>

      <div className="marketplace-filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="luxury">Luxury</option>
          <option value="penthouse">Penthouse</option>
          <option value="mansion">Mansion</option>
          <option value="land">Land</option>
        </select>

        <input
          type="text"
          placeholder="District"
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />

        <button onClick={fetchProperties} className="btn-filter">Apply Filters</button>
      </div>

      <div className="properties-grid">
        {filteredProperties.length === 0 ? (
          <div className="empty-state">
            <p>No properties found matching your criteria.</p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <div key={property._id} className="property-card">
              <div className="property-image">
                <div className="property-type-badge">{property.type}</div>
              </div>
              <div className="property-info">
                <h3>{property.name}</h3>
                <p className="property-location">📍 {property.location.district}</p>
                <p className="property-description">{property.description}</p>
                <div className="property-details">
                  {property.bedrooms > 0 && <span>🛏️ {property.bedrooms} beds</span>}
                  {property.bathrooms > 0 && <span>🚿 {property.bathrooms} baths</span>}
                  <span>📐 {property.size} sq ft</span>
                </div>
                <div className="property-footer">
                  <span className="property-price">${property.price.toLocaleString()}</span>
                  <button
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowPurchaseModal(true);
                    }}
                    className="btn-purchase"
                  >
                    View & Purchase
                  </button>
                </div>
                {property.agent && (
                  <p className="property-agent">Agent: {property.agent.username}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showPurchaseModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProperty.name}</h2>
            <p className="property-type">{selectedProperty.type}</p>
            <p>{selectedProperty.description}</p>
            <div className="modal-details">
              <p><strong>Location:</strong> {selectedProperty.location.district}</p>
              <p><strong>Size:</strong> {selectedProperty.size} sq ft</p>
              <p><strong>Price:</strong> ${selectedProperty.price.toLocaleString()}</p>
              {selectedProperty.agent && (
                <p><strong>Agent:</strong> {selectedProperty.agent.username}</p>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowPurchaseModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="btn-confirm"
                disabled={user.virtualCurrency < selectedProperty.price}
              >
                Purchase (${selectedProperty.price.toLocaleString()})
              </button>
            </div>
            {user.virtualCurrency < selectedProperty.price && (
              <p className="insufficient-funds">Insufficient funds</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMarketplace;
