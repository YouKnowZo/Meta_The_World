import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, token } = useAuthStore();
  const [myProperties, setMyProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, transactionsRes] = await Promise.all([
          axios.get(`${API_URL}/properties`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/transactions/my-transactions`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const allProperties = propertiesRes.data;
        const myProps = allProperties.filter(p => p.owner?.id === user.id);
        setMyProperties(myProps);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, user]);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Virtual Currency</h3>
            <p className="stat-value">${user?.virtualCurrency?.toLocaleString() || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Properties Owned</h3>
            <p className="stat-value">{myProperties.length}</p>
          </div>
          {user?.isAgent && (
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <p className="stat-value">${user?.totalEarnings?.toLocaleString() || 0}</p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>My Properties</h2>
          {myProperties.length === 0 ? (
            <p className="empty-state">You don't own any properties yet. Visit the marketplace to buy one!</p>
          ) : (
            <div className="properties-grid">
              {myProperties.map((property) => (
                <div key={property._id} className="property-card">
                  <h3>{property.name}</h3>
                  <p className="property-type">{property.type}</p>
                  <p className="property-location">{property.location.district}</p>
                  <p className="property-price">${property.price.toLocaleString()}</p>
                  {!property.isListed && (
                    <button className="btn-list">List for Sale</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="empty-state">No transactions yet.</p>
          ) : (
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="transaction-card">
                  <div className="transaction-info">
                    <h4>{transaction.property?.name}</h4>
                    <p>Price: ${transaction.salePrice.toLocaleString()}</p>
                    <p>Status: {transaction.status}</p>
                    {transaction.agentCommission > 0 && (
                      <p className="commission">Commission: ${transaction.agentCommission.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
