import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/world">Meta The World</Link>
      </div>
      <div className="navbar-links">
        <Link to="/world">World</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/dashboard">Dashboard</Link>
        {user?.isAgent && <Link to="/agent">Agent Portal</Link>}
        <div className="navbar-user">
          <span>{user?.username}</span>
          <span className="currency">${user?.virtualCurrency?.toLocaleString() || 0}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
