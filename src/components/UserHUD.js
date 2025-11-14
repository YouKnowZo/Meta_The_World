import React from 'react';
import { useUserStore } from '../stores/userStore';
import './UserHUD.css';

const UserHUD = () => {
  const user = useUserStore((state) => state.user);
  const wallet = useUserStore((state) => state.wallet);
  const role = useUserStore((state) => state.role);
  
  const getRoleIcon = () => {
    switch (role) {
      case 'realEstateAgent': return '🏠';
      case 'developer': return '🏗️';
      case 'investor': return '💰';
      case 'artist': return '🎨';
      default: return '👤';
    }
  };
  
  return (
    <div className="user-hud">
      <div className="hud-section user-info">
        <div className="user-avatar">{getRoleIcon()}</div>
        <div className="user-details">
          <div className="user-name">{user?.username || 'Guest'}</div>
          <div className="user-role">{role}</div>
        </div>
      </div>
      
      <div className="hud-section wallet">
        <div className="wallet-label">Balance</div>
        <div className="wallet-amount">
          {wallet.balance.toLocaleString()} {wallet.currency}
        </div>
      </div>
    </div>
  );
};

export default UserHUD;
