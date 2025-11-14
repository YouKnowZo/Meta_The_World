import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import './UI.css'

export default function UI() {
  const navigate = useNavigate()
  const { user, logout } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="ui-overlay">
      {/* Top Bar */}
      <div className="ui-top-bar">
        <div className="ui-logo">
          <h1>🌍 Meta The World</h1>
        </div>
        <div className="ui-user-info">
          <span className="ui-balance">${user?.balance?.toLocaleString() || 0}</span>
          <div className="ui-avatar" onClick={() => setMenuOpen(!menuOpen)}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          {menuOpen && (
            <div className="ui-dropdown">
              <button onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button onClick={() => navigate('/marketplace')}>Marketplace</button>
              <button onClick={() => navigate('/agent')}>Become Agent</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="ui-quick-actions">
        <button onClick={() => navigate('/marketplace')} className="ui-action-btn">
          🏠 Browse Properties
        </button>
        <button onClick={() => navigate('/agent')} className="ui-action-btn">
          💼 Real Estate Agent
        </button>
      </div>

      {/* Minimap placeholder */}
      <div className="ui-minimap">
        <div className="ui-minimap-title">World Map</div>
      </div>
    </div>
  )
}
