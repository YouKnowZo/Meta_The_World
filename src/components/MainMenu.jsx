import React, { useState } from 'react'
import { useWorldStore } from '../stores/worldStore'
import './MainMenu.css'

const MainMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAgent, setShowCreateProperty } = useWorldStore()

  return (
    <div className="main-menu">
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ Menu
      </button>
      {isOpen && (
        <div className="menu-dropdown">
          <h3>Meta The World</h3>
          <div className="menu-section">
            <h4>Real Estate</h4>
            <button onClick={() => {
              setShowCreateProperty(true)
              setIsOpen(false)
            }}>
              List Property
            </button>
            <button onClick={() => setIsOpen(false)}>
              Browse Properties
            </button>
          </div>
          {isAgent && (
            <div className="menu-section">
              <h4>Agent Tools</h4>
              <button onClick={() => setIsOpen(false)}>
                My Transactions
              </button>
              <button onClick={() => setIsOpen(false)}>
                Market Analytics
              </button>
            </div>
          )}
          <div className="menu-section">
            <h4>Activities</h4>
            <button onClick={() => setIsOpen(false)}>
              Social Hub
            </button>
            <button onClick={() => setIsOpen(false)}>
              Events
            </button>
            <button onClick={() => setIsOpen(false)}>
              Virtual Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainMenu
