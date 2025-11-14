import React, { useState } from 'react';
import { useUserStore } from '../stores/userStore';
import './LoginScreen.css';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const login = useUserStore((state) => state.login);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login({
        id: `user-${Date.now()}`,
        username,
        role: selectedRole,
        avatar: null,
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1 className="login-title">Meta The World</h1>
        <p className="login-subtitle">Be who you want to be. Live the life you've always dreamed of.</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Your Name</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Choose Your Path</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="citizen">Citizen - Explore and Live</option>
              <option value="realEstateAgent">Real Estate Agent - Build Your Empire</option>
              <option value="developer">Developer - Create Properties</option>
              <option value="investor">Investor - Grow Your Wealth</option>
              <option value="artist">Artist - Express Yourself</option>
            </select>
          </div>
          
          <button type="submit" className="login-button">
            Enter The World
          </button>
        </form>
        
        <div className="login-features">
          <div className="feature">
            <h3>🌍 Infinite Possibilities</h3>
            <p>Everything the real world has, but better</p>
          </div>
          <div className="feature">
            <h3>🏠 Real Estate Empire</h3>
            <p>Buy, sell, and earn commissions on every transaction</p>
          </div>
          <div className="feature">
            <h3>✨ Hyper Realistic</h3>
            <p>Stunning graphics and immersive experiences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
