import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ArrowLeft, Plus, MapPin, DollarSign, Tag, Edit, Trash2 } from 'lucide-react';
import './PropertyManager.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function PropertyManager() {
  const [properties, setProperties] = useState([]);
  const [listings, setListings] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    size: '',
    property_type: 'residential',
    location_x: (Math.random() - 0.5) * 50,
    location_y: 0,
    location_z: (Math.random() - 0.5) * 50
  });
  const [listingPrice, setListingPrice] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propertiesRes, listingsRes] = await Promise.all([
        axios.get(`${API_URL}/api/properties`),
        axios.get(`${API_URL}/api/listings`)
      ]);
      setProperties(propertiesRes.data);
      setListings(listingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/properties`, {
        ...newProperty,
        price: parseFloat(newProperty.price),
        size: parseFloat(newProperty.size)
      });
      setShowCreateModal(false);
      setNewProperty({
        title: '',
        description: '',
        price: '',
        size: '',
        property_type: 'residential',
        location_x: (Math.random() - 0.5) * 50,
        location_y: 0,
        location_z: (Math.random() - 0.5) * 50
      });
      fetchData();
    } catch (error) {
      alert('Error creating property: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleListProperty = async (e) => {
    e.preventDefault();
    if (!selectedProperty) return;
    
    try {
      await axios.post(`${API_URL}/api/listings`, {
        property_id: selectedProperty.id,
        listing_price: parseFloat(listingPrice),
        agent_id: user?.role === 'agent' ? user.id : null
      });
      setShowListModal(false);
      setListingPrice('');
      setSelectedProperty(null);
      fetchData();
    } catch (error) {
      alert('Error listing property: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleBuyProperty = async (listing) => {
    if (!window.confirm(`Buy ${listing.title} for $${listing.listing_price.toLocaleString()}?`)) {
      return;
    }

    try {
      await axios.post(`${API_URL}/api/transactions`, {
        property_id: listing.property_id,
        listing_id: listing.id
      });
      alert('Property purchased successfully!');
      fetchData();
    } catch (error) {
      alert('Error purchasing property: ' + (error.response?.data?.error || error.message));
    }
  };

  const userProperties = properties.filter(p => p.owner_id === user.id);
  const availableListings = listings.filter(l => l.owner_id !== user.id);

  return (
    <div className="property-manager-container">
      <div className="property-manager-header">
        <button className="back-button" onClick={() => navigate('/world')}>
          <ArrowLeft />
          Back to World
        </button>
        <h1>Property Manager</h1>
        <button className="create-button" onClick={() => setShowCreateModal(true)}>
          <Plus />
          Create Property
        </button>
      </div>

      <div className="property-manager-content">
        <div className="properties-section">
          <h2>My Properties ({userProperties.length})</h2>
          <div className="properties-grid">
            {userProperties.length === 0 ? (
              <div className="empty-state">You don't own any properties yet</div>
            ) : (
              userProperties.map((property) => (
                <div key={property.id} className="property-card">
                  <div className="property-card-header">
                    <h3>{property.title}</h3>
                    <span className={`status-badge ${property.status}`}>
                      {property.status}
                    </span>
                  </div>
                  <p className="property-description">{property.description || 'No description'}</p>
                  <div className="property-details">
                    <div className="detail">
                      <DollarSign className="detail-icon" />
                      <span>${property.price.toLocaleString()}</span>
                    </div>
                    <div className="detail">
                      <Tag className="detail-icon" />
                      <span>{property.property_type}</span>
                    </div>
                    <div className="detail">
                      <MapPin className="detail-icon" />
                      <span>{property.size} sq units</span>
                    </div>
                  </div>
                  {property.status === 'available' && (
                    <button 
                      className="list-button"
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowListModal(true);
                      }}
                    >
                      List for Sale
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="listings-section">
          <h2>Available Properties ({availableListings.length})</h2>
          <div className="properties-grid">
            {availableListings.length === 0 ? (
              <div className="empty-state">No properties available for purchase</div>
            ) : (
              availableListings.map((listing) => (
                <div key={listing.id} className="property-card">
                  <div className="property-card-header">
                    <h3>{listing.title}</h3>
                    <span className="status-badge listed">Listed</span>
                  </div>
                  <p className="property-description">{listing.description || 'No description'}</p>
                  <div className="property-details">
                    <div className="detail">
                      <DollarSign className="detail-icon" />
                      <span>${listing.listing_price.toLocaleString()}</span>
                    </div>
                    <div className="detail">
                      <Tag className="detail-icon" />
                      <span>{listing.property_type}</span>
                    </div>
                    {listing.agent_name && (
                      <div className="detail">
                        <span>Agent: {listing.agent_name}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    className="buy-button"
                    onClick={() => handleBuyProperty(listing)}
                  >
                    Buy Property
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Property Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Property</h2>
            <form onSubmit={handleCreateProperty}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newProperty.title}
                  onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="number"
                    value={newProperty.size}
                    onChange={(e) => setNewProperty({ ...newProperty, size: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Property Type</label>
                <select
                  value={newProperty.property_type}
                  onChange={(e) => setNewProperty({ ...newProperty, property_type: e.target.value })}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">Create Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Property Modal */}
      {showListModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowListModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>List Property for Sale</h2>
            <p><strong>{selectedProperty.title}</strong></p>
            <form onSubmit={handleListProperty}>
              <div className="form-group">
                <label>Listing Price</label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  placeholder={`Current value: $${selectedProperty.price.toLocaleString()}`}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowListModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">List Property</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyManager;
