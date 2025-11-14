import React from 'react';
import { useUserStore } from '../stores/userStore';
import { useRealEstateStore } from '../stores/realEstateStore';
import './PropertyPanel.css';

const PropertyPanel = ({ property, onClose, onPurchase }) => {
  const user = useUserStore((state) => state.user);
  const wallet = useUserStore((state) => state.wallet);
  const role = useUserStore((state) => state.role);
  const updateWallet = useUserStore((state) => state.updateWallet);
  const processTransaction = useRealEstateStore((state) => state.processTransaction);
  const listings = useRealEstateStore((state) => state.listings);
  
  const listing = listings.find(l => l.propertyId === property.id && l.status === 'active');
  const canPurchase = property.status === 'for-sale' || property.status === 'listed';
  const canAfford = wallet.balance >= property.price;
  
  const handlePurchase = () => {
    if (!canAfford) {
      alert('Insufficient funds!');
      return;
    }
    
    if (listing && role === 'realEstateAgent') {
      // Process transaction with commission
      const transaction = processTransaction(
        listing.id,
        user.id,
        property.price,
        listing.agentId
      );
      
      if (transaction) {
        // Update buyer wallet
        updateWallet(-property.price);
        // Agent commission is handled separately
        alert(`Purchase successful! Commission: ${transaction.commission.toLocaleString()} META`);
      }
    } else {
      // Direct purchase
      updateWallet(-property.price);
      useRealEstateStore.getState().properties = useRealEstateStore.getState().properties.map(p =>
        p.id === property.id
          ? { ...p, owner: user.id, status: 'owned' }
          : p
      );
      alert('Purchase successful!');
    }
    
    onPurchase();
    onClose();
  };
  
  const handleListProperty = () => {
    if (role === 'realEstateAgent' && property.owner === user.id) {
      const listing = useRealEstateStore.getState().createListing(
        property.id,
        user.id,
        property.price * 1.2 // 20% markup
      );
      alert(`Property listed! You'll earn commission on sale.`);
    }
  };
  
  return (
    <div className="property-panel">
      <div className="panel-header">
        <h2>{property.name}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="panel-content">
        <div className="property-info">
          <div className="info-row">
            <span className="label">Type:</span>
            <span className="value">{property.type}</span>
          </div>
          <div className="info-row">
            <span className="label">Price:</span>
            <span className="value price">{property.price.toLocaleString()} META</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className={`value status ${property.status}`}>{property.status}</span>
          </div>
          <div className="info-row">
            <span className="label">Size:</span>
            <span className="value">
              {property.size.width} × {property.size.height} × {property.size.depth}
            </span>
          </div>
          
          {property.features && property.features.length > 0 && (
            <div className="features-section">
              <h3>Features</h3>
              <div className="features-list">
                {property.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="panel-actions">
          {canPurchase && (
            <button
              className={`action-button purchase ${!canAfford ? 'disabled' : ''}`}
              onClick={handlePurchase}
              disabled={!canAfford}
            >
              {canAfford ? 'Purchase Property' : 'Insufficient Funds'}
            </button>
          )}
          
          {role === 'realEstateAgent' && property.owner === user.id && property.status !== 'listed' && (
            <button
              className="action-button list"
              onClick={handleListProperty}
            >
              List for Sale (Earn Commission)
            </button>
          )}
          
          {listing && (
            <div className="listing-info">
              <p>Listed by Agent</p>
              <p>Commission: {(property.price * 0.03).toLocaleString()} META</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
