import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProperties();
  }, []);

  const fetchUserProperties = async () => {
    try {
      const response = await api.get('/properties');
      const userProperties = response.data.filter(
        p => p.owner?._id === user?.id || p.owner === user?.id
      );
      setProperties(userProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Dashboard</h1>
        <Link to="/world" className="btn-back">← Back to World</Link>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Wallet Balance</h3>
            <p className="stat-value">{user?.wallet?.balance?.toLocaleString() || 0} MTC</p>
          </div>
          <div className="stat-card">
            <h3>Properties Owned</h3>
            <p className="stat-value">{user?.stats?.propertiesOwned || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="stat-value">{user?.stats?.totalEarnings?.toLocaleString() || 0} MTC</p>
          </div>
        </div>

        <div className="properties-section">
          <h2>Your Properties</h2>
          {loading ? (
            <p>Loading...</p>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <p>You don't own any properties yet.</p>
              <Link to="/world" className="btn-primary">Explore Properties</Link>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <div key={property._id} className="property-card">
                  <h3>{property.name}</h3>
                  <p className="property-type">{property.type}</p>
                  <p className="property-location">
                    {property.location.region} ({property.location.x}, {property.location.z})
                  </p>
                  <p className="property-price">{property.price.toLocaleString()} MTC</p>
                  <Link to={`/property/${property._id}`} className="btn-view">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
