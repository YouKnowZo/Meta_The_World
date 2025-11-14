import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import './Dashboard.css';

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();

  useEffect(() => {
    fetchUserProfile();
    fetchProperties();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/world')}>🌍 Enter World</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {user && (
        <div className="user-info">
          <h2>Welcome, {user.username}!</h2>
          <p>Balance: {user.balance} MTC</p>
        </div>
      )}

      <div className="dashboard-content">
        <section className="properties-section">
          <h2>Available Properties</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="property-card"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <div className="property-image">
                    {property.property_type}
                  </div>
                  <div className="property-info">
                    <h3>{property.title}</h3>
                    <p>{property.description}</p>
                    <div className="property-details">
                      <span>💰 {property.price} MTC</span>
                      <span>📍 ({property.location_x}, {property.location_y})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
