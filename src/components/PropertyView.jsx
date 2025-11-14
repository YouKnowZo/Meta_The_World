import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import './PropertyView.css';

function PropertyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionAmount, setTransactionAmount] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!property.listing_id || !transactionAmount) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/transactions',
        {
          property_id: id,
          listing_id: property.listing_id,
          transaction_type: 'sale',
          amount: parseFloat(transactionAmount),
          agent_id: property.listing_agent_id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Transaction initiated! Complete it from your dashboard.');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Transaction failed');
    }
  };

  if (loading) return <div className="property-view">Loading...</div>;
  if (!property) return <div className="property-view">Property not found</div>;

  return (
    <div className="property-view">
      <button className="back-button" onClick={() => navigate('/world')}>
        ← Back to World
      </button>

      <div className="property-details">
        <h1>{property.title}</h1>
        <p className="property-description">{property.description || property.listing_description}</p>

        <div className="property-info-grid">
          <div className="info-card">
            <h3>Price</h3>
            <p className="price">{property.asking_price || property.price} MTC</p>
          </div>
          <div className="info-card">
            <h3>Location</h3>
            <p>({property.location_x}, {property.location_y}, {property.location_z})</p>
          </div>
          <div className="info-card">
            <h3>Size</h3>
            <p>{property.size_x} × {property.size_y} × {property.size_z}</p>
          </div>
          <div className="info-card">
            <h3>Status</h3>
            <p className={`status ${property.status}`}>{property.status}</p>
          </div>
        </div>

        {property.agent_name && (
          <div className="agent-info">
            <h3>Listing Agent</h3>
            <p>{property.agent_name}</p>
          </div>
        )}

        {property.status === 'available' && property.listing_id && (
          <div className="purchase-section">
            <h2>Purchase This Property</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <button onClick={handlePurchase} className="purchase-button">
              Initiate Purchase
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyView;
