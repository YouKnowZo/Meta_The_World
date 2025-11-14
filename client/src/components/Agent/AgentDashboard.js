import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/api';
import toast from 'react-hot-toast';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [becomingAgent, setBecomingAgent] = useState(false);

  useEffect(() => {
    if (user?.role === 'agent') {
      fetchAgentData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAgentData = async () => {
    try {
      const [statsRes, listingsRes] = await Promise.all([
        api.get(`/agents/${user.id}/stats`),
        api.get(`/agents/${user.id}/listings`)
      ]);
      setStats(statsRes.data);
      setListings(listingsRes.data);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeAgent = async () => {
    setBecomingAgent(true);
    try {
      await api.post(`/agents/become-agent/${user.id}`);
      toast.success('Congratulations! You are now a real estate agent!');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to become agent');
    } finally {
      setBecomingAgent(false);
    }
  };

  if (loading) {
    return <div className="agent-dashboard loading">Loading...</div>;
  }

  if (user?.role !== 'agent') {
    return (
      <div className="agent-dashboard">
        <div className="become-agent-section">
          <Link to="/world" className="btn-back">← Back to World</Link>
          <div className="become-agent-card">
            <h1>Become a Real Estate Agent</h1>
            <p className="description">
              Join the elite ranks of Meta The World real estate agents. 
              Help buyers find their dream properties and earn commissions on every sale!
            </p>
            <div className="benefits">
              <h3>Benefits:</h3>
              <ul>
                <li>Earn 5% commission on every property you help sell</li>
                <li>Access to exclusive agent tools and analytics</li>
                <li>Build your reputation and grow your business</li>
                <li>Help shape the virtual world one property at a time</li>
              </ul>
            </div>
            <button
              className="btn-become-agent"
              onClick={handleBecomeAgent}
              disabled={becomingAgent}
            >
              {becomingAgent ? 'Processing...' : 'Become an Agent'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <div className="agent-header">
        <Link to="/world" className="btn-back">← Back to World</Link>
        <h1>Agent Dashboard</h1>
        <p className="agent-welcome">Welcome, {user.username}!</p>
      </div>

      <div className="agent-content">
        {stats && (
          <div className="agent-stats">
            <div className="stat-card">
              <h3>Total Commission Earned</h3>
              <p className="stat-value highlight">
                {stats.stats.totalCommission.toLocaleString()} MTC
              </p>
            </div>
            <div className="stat-card">
              <h3>Properties Sold</h3>
              <p className="stat-value">{stats.stats.totalSales}</p>
            </div>
            <div className="stat-card">
              <h3>Total Sales Value</h3>
              <p className="stat-value">{stats.stats.totalSalesValue.toLocaleString()} MTC</p>
            </div>
            <div className="stat-card">
              <h3>Active Listings</h3>
              <p className="stat-value">{stats.stats.activeListings}</p>
            </div>
            <div className="stat-card">
              <h3>Average Commission Rate</h3>
              <p className="stat-value">
                {(stats.stats.averageCommissionRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="stat-card">
              <h3>Wallet Balance</h3>
              <p className="stat-value">{stats.agent.wallet.balance.toLocaleString()} MTC</p>
            </div>
          </div>
        )}

        <div className="agent-listings">
          <h2>Your Active Listings</h2>
          {listings.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any active listings yet.</p>
              <p>Start by helping property owners list their properties!</p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div key={listing._id} className="listing-card">
                  <h3>{listing.name}</h3>
                  <p className="listing-type">{listing.type}</p>
                  <p className="listing-price">{listing.price.toLocaleString()} MTC</p>
                  <p className="listing-commission">
                    Commission: {(listing.price * listing.commissionRate).toLocaleString()} MTC
                    ({(listing.commissionRate * 100).toFixed(1)}%)
                  </p>
                  <Link to={`/property/${listing._id}`} className="btn-view">
                    View Property
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

export default AgentDashboard;
