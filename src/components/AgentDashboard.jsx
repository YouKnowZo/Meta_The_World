import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import './AgentDashboard.css';

function AgentDashboard() {
  const [agentProfile, setAgentProfile] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    checkAgentStatus();
  }, []);

  const checkAgentStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/agents/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgentProfile(response.data);
      fetchCommissions();
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setLoading(false);
      } else {
        console.error('Error fetching agent profile:', error);
        setLoading(false);
      }
    }
  };

  const fetchCommissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/agents/commissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommissions(response.data);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/agents/register',
        { license_number: licenseNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Successfully registered as a real estate agent!');
      checkAgentStatus();
      setRegistering(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  if (loading) return <div className="agent-dashboard">Loading...</div>;

  return (
    <div className="agent-dashboard">
      <div className="agent-header">
        <h1>🏢 Real Estate Agent Dashboard</h1>
        <button onClick={() => navigate('/world')}>🌍 Back to World</button>
      </div>

      {!agentProfile ? (
        <div className="register-section">
          <h2>Become a Real Estate Agent</h2>
          <p>Join the virtual real estate market and earn commissions on every transaction!</p>
          
          {!registering ? (
            <button onClick={() => setRegistering(true)} className="register-button">
              Register as Agent
            </button>
          ) : (
            <div className="register-form">
              <input
                type="text"
                placeholder="License Number (optional)"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
              <div className="form-actions">
                <button onClick={handleRegister} className="submit-button">
                  Submit Registration
                </button>
                <button onClick={() => setRegistering(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="agent-content">
          <div className="agent-stats">
            <div className="stat-card">
              <h3>Total Transactions</h3>
              <p className="stat-value">{agentProfile.total_transactions || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <p className="stat-value">{parseFloat(agentProfile.total_commissions || 0).toFixed(2)} MTC</p>
            </div>
            <div className="stat-card">
              <h3>Rating</h3>
              <p className="stat-value">{parseFloat(agentProfile.rating || 0).toFixed(2)} ⭐</p>
            </div>
          </div>

          <div className="commissions-section">
            <h2>Commission History</h2>
            {commissions.length === 0 ? (
              <p>No commissions yet. Start listing properties to earn!</p>
            ) : (
              <table className="commissions-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Transaction Amount</th>
                    <th>Commission</th>
                    <th>Rate</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission) => (
                    <tr key={commission.id}>
                      <td>{commission.property_title}</td>
                      <td>{parseFloat(commission.transaction_amount).toFixed(2)} MTC</td>
                      <td className="commission-amount">
                        {parseFloat(commission.commission_amount).toFixed(2)} MTC
                      </td>
                      <td>{(parseFloat(commission.commission_rate) * 100).toFixed(2)}%</td>
                      <td>
                        <span className={`status-badge ${commission.status}`}>
                          {commission.status}
                        </span>
                      </td>
                      <td>{new Date(commission.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentDashboard;
