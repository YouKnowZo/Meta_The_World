import React from 'react'
import { useWorldStore } from '../stores/worldStore'
import PropertyPanel from './PropertyPanel'
import AgentPanel from './AgentPanel'
import CreatePropertyModal from './CreatePropertyModal'
import MainMenu from './MainMenu'
import './UI.css'

const UI = () => {
  const {
    showPropertyPanel,
    showAgentPanel,
    showCreateProperty,
    isAgent,
    totalEarnings,
    transactions,
    setShowAgentPanel,
    setShowCreateProperty,
    setAgent
  } = useWorldStore()

  return (
    <div className="ui-container">
      <MainMenu />
      
      {showPropertyPanel && <PropertyPanel />}
      {showAgentPanel && <AgentPanel />}
      {showCreateProperty && <CreatePropertyModal />}

      {/* Agent Quick Stats */}
      {isAgent && (
        <div className="agent-stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Earnings:</span>
            <span className="stat-value">${totalEarnings.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Transactions:</span>
            <span className="stat-value">{transactions.length}</span>
          </div>
          <button
            className="agent-button"
            onClick={() => setShowAgentPanel(true)}
          >
            View Details
          </button>
        </div>
      )}

      {/* Become Agent Button */}
      {!isAgent && (
        <div className="become-agent-banner">
          <h3>Become a Virtual Real Estate Agent</h3>
          <p>Earn 5% commission on every transaction you facilitate</p>
          <button
            className="become-agent-button"
            onClick={() => setAgent(true)}
          >
            Become an Agent
          </button>
        </div>
      )}
    </div>
  )
}

export default UI
