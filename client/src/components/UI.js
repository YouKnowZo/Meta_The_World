import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, DollarSign, MapPin, Building2, 
  Plus, X, ShoppingCart, TrendingUp, LogOut 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UI.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UI({ user, properties, selectedProperty, onPropertySelect, onNavigate, onRefresh }) {
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
  const { logout } = useAuthStore();
  const navigate = useNavigate();

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
      onRefresh();
    } catch (error) {
      alert('Error creating property: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="world-ui">
      {/* Top bar */}
      <div className="ui-topbar">
        <div className="ui-brand">
          <Home className="brand-icon" />
          <span>Meta The World</span>
        </div>
        <div className="ui-user-info">
          <div className="wallet-display">
            <DollarSign className="wallet-icon" />
            <span>${user?.wallet_balance?.toLocaleString() || '0'}</span>
          </div>
          <div className="user-menu">
            <User className="user-icon" />
            <span>{user?.username}</span>
            {user?.role === 'agent' && (
              <span className="role-badge">Agent</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="ui-sidebar">
        <button 
          className="sidebar-button"
          onClick={() => navigate('/world')}
          title="World"
        >
          <MapPin />
          <span>World</span>
        </button>
        <button 
          className="sidebar-button"
          onClick={() => navigate('/properties')}
          title="Properties"
        >
          <Building2 />
          <span>Properties</span>
        </button>
        <button 
          className="sidebar-button"
          onClick={() => navigate('/dashboard')}
          title="Dashboard"
        >
          <TrendingUp />
          <span>Dashboard</span>
        </button>
        {(user?.role === 'agent' || user?.role === 'admin') && (
          <button 
            className="sidebar-button"
            onClick={() => navigate('/agent')}
            title="Agent Dashboard"
          >
            <ShoppingCart />
            <span>Agent</span>
          </button>
        )}
        <button 
          className="sidebar-button logout"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          title="Logout"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </div>

      {/* Property list */}
      <div className="ui-property-list">
        <div className="property-list-header">
          <h3>Properties</h3>
          <button 
            className="create-button"
            onClick={() => setShowCreateModal(true)}
            title="Create Property"
          >
            <Plus />
          </button>
        </div>
        <div className="property-list-content">
          {properties.map((property) => (
            <div
              key={property.id}
              className={`property-item ${selectedProperty?.id === property.id ? 'selected' : ''}`}
              onClick={() => onPropertySelect(property)}
            >
              <div className="property-item-header">
                <span className="property-item-title">{property.title}</span>
                <span className="property-item-price">${property.price.toLocaleString()}</span>
              </div>
              <div className="property-item-meta">
                <span className="property-item-type">{property.property_type}</span>
                <span className={`property-item-status ${property.status}`}>
                  {property.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property detail modal */}
      <AnimatePresence>
        {showPropertyModal && selectedProperty && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPropertyModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setShowPropertyModal(false)}
              >
                <X />
              </button>
              <h2>{selectedProperty.title}</h2>
              <p>{selectedProperty.description}</p>
              <div className="modal-details">
                <div className="detail-item">
                  <strong>Price:</strong> ${selectedProperty.price.toLocaleString()}
                </div>
                <div className="detail-item">
                  <strong>Size:</strong> {selectedProperty.size} sq units
                </div>
                <div className="detail-item">
                  <strong>Type:</strong> {selectedProperty.property_type}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> {selectedProperty.status}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create property modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <X />
              </button>
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
                <button type="submit" className="submit-button">Create Property</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UI;
