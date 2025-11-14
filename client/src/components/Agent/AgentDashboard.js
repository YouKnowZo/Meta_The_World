import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './AgentDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AgentDashboard = () => {
  const { user, token, becomeAgent } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBecomeAgent, setShowBecomeAgent] = useState(!user?.isAgent);
  const [commissionRate, setCommissionRate] = useState(0.05);

  useEffect(() => {
    if (user?.isAgent) {
      fetchAgentData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAgentData = async () => {
    try {
      const [statsRes, listingsRes] = await Promise.all([
        axios.get(`${API_URL}/agents/${user.id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/agents/${user.id}/listings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.agent);
      setListings(listingsRes.data);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeAgent = async () => {
    const result = await becomeAgent(commissionRate);
    if (result.success) {
      setShowBecomeAgent(false);
      fetchAgentData();
    } else {
      alert(result.error);
    }
  };

  if (loading) {
    return <div className="agent-loading">Loading...</div>;
  }

  if (showBecomeAgent) {
    return (
      <div className="become-agent">
        <div className="become-agent-card">
          <h1>Become a Virtual Real Estate Agent</h1>
          <p>As an agent, you'll earn a commission on every property transaction you facilitate.</p>
          
          <div className="form-group">
            <label>Commission Rate (0.01 - 0.20)</label>
            <input
              type="number"
              min="0.01"
              max="0.20"
              step="0.01"
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
            />
            <p className="helper-text">
              You'll earn {((commissionRate || 0) * 100).toFixed(1)}% of each sale price
            </p>
          </div>

          <button onClick={handleBecomeAgent} className="btn-become-agent">
            Become an Agent
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <div className="agent-header">
        <h1>Agent Portal</h1>
        <div className="agent-badge-large">
          <span>🏠 Licensed Agent</span>
          <span>License: {stats?.agentLicense}</span>
        </div>
      </div>

      <div className="agent-stats">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-value">${stats?.totalEarnings?.toLocaleString() || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Commission Rate</h3>
          <p className="stat-value">{(stats?.commissionRate * 100).toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <h3>Active Listings</h3>
          <p className="stat-value">{stats?.listedProperties || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Properties Sold</h3>
          <p className="stat-value">{stats?.soldProperties || 0}</p>
        </div>
      </div>

      <div className="agent-listings">
        <h2>Your Listings</h2>
        {listings.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any active listings yet.</p>
            <p>Property owners can assign you as their agent when listing properties.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing._id} className="listing-card">
                <h3>{listing.name}</h3>
                <p className="listing-type">{listing.type}</p>
                <p className="listing-location">📍 {listing.location.district}</p>
                <p className="listing-price">${listing.price.toLocaleString()}</p>
                <p className="listing-commission">
                  Your Commission: ${(listing.price * (stats?.commissionRate || 0)).toLocaleString()}
                </p>
                <p className="listing-owner">Owner: {listing.owner?.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="agent-info">
        <h2>How It Works</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>1. Get Listed</h3>
            <p>Property owners can assign you as their agent when listing properties for sale.</p>
          </div>
          <div className="info-card">
            <h3>2. Facilitate Sales</h3>
            <p>When a property you're representing is sold, you automatically earn your commission.</p>
          </div>
          <div className="info-card">
            <h3>3. Earn Commissions</h3>
            <p>Your commission is calculated based on your set rate and added to your virtual currency.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
