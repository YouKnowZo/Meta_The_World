import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Users, Award } from 'lucide-react';
import './AgentDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AgentDashboard() {
  const [stats, setStats] = useState({
    total_transactions: 0,
    total_commission: 0,
    avg_commission: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [listings, setListings] = useState([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, transactionsRes, listingsRes] = await Promise.all([
        axios.get(`${API_URL}/api/agents/stats`),
        axios.get(`${API_URL}/api/transactions`),
        axios.get(`${API_URL}/api/listings`)
      ]);

      setStats(statsRes.data);
      setTransactions(transactionsRes.data.filter(t => t.agent_id === user.id));
      setListings(listingsRes.data.filter(l => l.agent_id === user.id));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="agent-dashboard-container">
      <div className="agent-dashboard-header">
        <button className="back-button" onClick={() => navigate('/world')}>
          <ArrowLeft />
          Back to World
        </button>
        <div>
          <h1>Real Estate Agent Dashboard</h1>
          <p>Manage your real estate business and track commissions</p>
        </div>
      </div>

      <div className="agent-dashboard-content">
        <div className="agent-stats-grid">
          <div className="agent-stat-card">
            <div className="agent-stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <DollarSign />
            </div>
            <div className="agent-stat-info">
              <div className="agent-stat-label">Total Commission</div>
              <div className="agent-stat-value">${parseFloat(stats.total_commission || 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="agent-stat-card">
            <div className="agent-stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <ShoppingCart />
            </div>
            <div className="agent-stat-info">
              <div className="agent-stat-label">Total Transactions</div>
              <div className="agent-stat-value">{stats.total_transactions || 0}</div>
            </div>
          </div>

          <div className="agent-stat-card">
            <div className="agent-stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <TrendingUp />
            </div>
            <div className="agent-stat-info">
              <div className="agent-stat-label">Average Commission</div>
              <div className="agent-stat-value">${parseFloat(stats.avg_commission || 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="agent-stat-card">
            <div className="agent-stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <Award />
            </div>
            <div className="agent-stat-info">
              <div className="agent-stat-label">Active Listings</div>
              <div className="agent-stat-value">{listings.length}</div>
            </div>
          </div>
        </div>

        <div className="agent-info-box">
          <h3>💰 Commission System</h3>
          <p>As a real estate agent, you earn a <strong>5% commission</strong> on every property transaction you facilitate.</p>
          <p>When a property you've listed is sold, you automatically receive your commission in your wallet.</p>
        </div>

        <div className="agent-transactions-section">
          <h2>My Transactions</h2>
          <div className="agent-transactions-list">
            {transactions.length === 0 ? (
              <div className="empty-state">No transactions yet. Start listing properties to earn commissions!</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="agent-transaction-item">
                  <div className="agent-transaction-main">
                    <div className="agent-transaction-type">
                      <span className="agent-type-badge commission">Commission Earned</span>
                    </div>
                    <div className="agent-transaction-property">
                      {transaction.property_title}
                    </div>
                    <div className="agent-transaction-details">
                      <span>Facilitated sale from {transaction.seller_name} to {transaction.buyer_name}</span>
                    </div>
                  </div>
                  <div className="agent-transaction-amount">
                    <span className="agent-amount commission">
                      +${parseFloat(transaction.commission || 0).toLocaleString()}
                    </span>
                    <div className="transaction-total">
                      (Total: ${parseFloat(transaction.price).toLocaleString()})
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="agent-listings-section">
          <h2>My Active Listings</h2>
          <div className="agent-listings-grid">
            {listings.length === 0 ? (
              <div className="empty-state">No active listings. List properties to start earning!</div>
            ) : (
              listings.map((listing) => (
                <div key={listing.id} className="agent-listing-card">
                  <div className="agent-listing-header">
                    <h3>{listing.title}</h3>
                    <span className="agent-status-badge listed">Active</span>
                  </div>
                  <p className="agent-listing-description">{listing.description || 'No description'}</p>
                  <div className="agent-listing-details">
                    <div className="agent-listing-detail">
                      <strong>Listing Price:</strong> ${listing.listing_price.toLocaleString()}
                    </div>
                    <div className="agent-listing-detail">
                      <strong>Potential Commission:</strong> ${(listing.listing_price * 0.05).toLocaleString()}
                    </div>
                    <div className="agent-listing-detail">
                      <strong>Type:</strong> {listing.property_type}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;
