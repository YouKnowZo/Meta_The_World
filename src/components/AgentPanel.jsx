import React from 'react'
import { useWorldStore } from '../stores/worldStore'
import './AgentPanel.css'

const AgentPanel = () => {
  const {
    setShowAgentPanel,
    totalEarnings,
    transactions,
    agentCommission,
    properties
  } = useWorldStore()

  const availableProperties = properties.filter(p => p.status === 'available').length
  const soldProperties = transactions.length

  return (
    <div className="agent-panel-overlay" onClick={() => setShowAgentPanel(false)}>
      <div className="agent-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => setShowAgentPanel(false)}>
          ×
        </button>

        <div className="agent-header">
          <h2>🏢 Real Estate Agent Dashboard</h2>
          <p className="agent-subtitle">Your Virtual Real Estate Career</p>
        </div>

        <div className="agent-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Earnings</div>
              <div className="stat-amount">${totalEarnings.toFixed(2)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Commission Rate</div>
              <div className="stat-amount">{(agentCommission * 100).toFixed(0)}%</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-label">Transactions</div>
              <div className="stat-amount">{soldProperties}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <div className="stat-label">Available Listings</div>
              <div className="stat-amount">{availableProperties}</div>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet. Start facilitating property sales to earn commissions!</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-id">#{transaction.id.slice(0, 8)}</div>
                    <div className="transaction-details">
                      <div className="transaction-property">Property {transaction.propertyId}</div>
                      <div className="transaction-date">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <div className="transaction-total">${transaction.amount.toLocaleString()}</div>
                    <div className="transaction-commission">
                      +${(transaction.amount * agentCommission).toFixed(2)} commission
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="agent-tips">
          <h4>💡 Agent Tips</h4>
          <ul>
            <li>Help buyers find their perfect virtual property</li>
            <li>List new properties to expand your portfolio</li>
            <li>Build relationships with other users</li>
            <li>Every successful sale earns you 5% commission</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AgentPanel
