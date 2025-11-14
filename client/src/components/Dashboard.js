import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ArrowLeft, TrendingUp, DollarSign, Home, ShoppingCart } from 'lucide-react';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, totalEarned: 0, propertiesOwned: 0 });
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, propertiesRes] = await Promise.all([
        axios.get(`${API_URL}/api/transactions`),
        axios.get(`${API_URL}/api/properties`)
      ]);

      const userTransactions = transactionsRes.data;
      setTransactions(userTransactions);

      const userProperties = propertiesRes.data.filter(p => p.owner_id === user.id);
      
      const totalSpent = userTransactions
        .filter(t => t.buyer_id === user.id)
        .reduce((sum, t) => sum + parseFloat(t.price), 0);
      
      const totalEarned = userTransactions
        .filter(t => t.seller_id === user.id)
        .reduce((sum, t) => sum + (parseFloat(t.price) - parseFloat(t.commission || 0)), 0);

      setStats({
        totalSpent,
        totalEarned,
        propertiesOwned: userProperties.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="back-button" onClick={() => navigate('/world')}>
          <ArrowLeft />
          Back to World
        </button>
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <DollarSign />
            </div>
            <div className="stat-info">
              <div className="stat-label">Wallet Balance</div>
              <div className="stat-value">${user?.wallet_balance?.toLocaleString() || '0'}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <Home />
            </div>
            <div className="stat-info">
              <div className="stat-label">Properties Owned</div>
              <div className="stat-value">{stats.propertiesOwned}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <TrendingUp />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Earned</div>
              <div className="stat-value">${stats.totalEarned.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <ShoppingCart />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">${stats.totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <div className="empty-state">No transactions yet</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-main">
                    <div className="transaction-type">
                      {transaction.buyer_id === user.id ? (
                        <span className="type-badge buy">Purchase</span>
                      ) : transaction.seller_id === user.id ? (
                        <span className="type-badge sell">Sale</span>
                      ) : (
                        <span className="type-badge commission">Commission</span>
                      )}
                    </div>
                    <div className="transaction-property">
                      {transaction.property_title}
                    </div>
                    <div className="transaction-details">
                      {transaction.buyer_id === user.id && (
                        <span>Bought from {transaction.seller_name}</span>
                      )}
                      {transaction.seller_id === user.id && (
                        <span>Sold to {transaction.buyer_name}</span>
                      )}
                      {transaction.agent_id === user.id && (
                        <span>Commission from {transaction.buyer_name}'s purchase</span>
                      )}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    {transaction.buyer_id === user.id ? (
                      <span className="amount negative">-${parseFloat(transaction.price).toLocaleString()}</span>
                    ) : transaction.seller_id === user.id ? (
                      <span className="amount positive">
                        +${(parseFloat(transaction.price) - parseFloat(transaction.commission || 0)).toLocaleString()}
                      </span>
                    ) : (
                      <span className="amount commission">
                        +${parseFloat(transaction.commission || 0).toLocaleString()}
                      </span>
                    )}
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

export default Dashboard;
