import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './UI.css';

const UI = ({ socket }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="world-ui">
      <div className="ui-top-bar">
        <div className="wallet-info">
          <span className="currency-symbol">MTC</span>
          <span className="balance">{user?.wallet?.balance?.toLocaleString() || 0}</span>
        </div>
        <div className="user-info">
          <span className="username">{user?.username}</span>
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
            ☰
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="ui-menu">
          <Link to="/dashboard" onClick={() => setShowMenu(false)}>
            Dashboard
          </Link>
          {user?.role === 'agent' && (
            <Link to="/agent" onClick={() => setShowMenu(false)}>
              Agent Dashboard
            </Link>
          )}
          {user?.role !== 'agent' && (
            <button onClick={() => {
              navigate('/agent');
              setShowMenu(false);
            }}>
              Become an Agent
            </button>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <div className="ui-controls">
        <div className="control-hint">
          <p>WASD - Move</p>
          <p>Mouse - Look Around</p>
        </div>
      </div>
    </div>
  );
};

export default UI;
