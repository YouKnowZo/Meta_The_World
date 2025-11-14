import React, { useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { useRealEstateStore } from '../stores/realEstateStore';
import './RealEstateAgentPanel.css';

const RealEstateAgentPanel = ({ onClose }) => {
  const user = useUserStore((state) => state.user);
  const wallet = useUserStore((state) => state.wallet);
  const updateWallet = useUserStore((state) => state.updateWallet);
  
  const properties = useRealEstateStore((state) => state.properties);
  const listings = useRealEstateStore((state) => state.listings);
  const transactions = useRealEstateStore((state) => state.transactions);
  const createListing = useRealEstateStore((state) => state.createListing);
  const getAgentEarnings = useRealEstateStore((state) => state.getAgentEarnings);
  const selectProperty = useRealEstateStore((state) => state.selectProperty);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [listingPrice, setListingPrice] = useState('');
  const [selectedPropertyForListing, setSelectedPropertyForListing] = useState(null);
  
  const myListings = listings.filter(l => l.agentId === user.id);
  const myTransactions = transactions.filter(t => t.agentId === user.id);
  const totalEarnings = getAgentEarnings(user.id);
  
  // Update wallet with earnings
  React.useEffect(() => {
    const earned = myTransactions.reduce((sum, t) => sum + t.commission, 0);
    if (earned > 0 && wallet.balance < 10000 + earned) {
      // This is a simplified check - in real app, track what's been paid
      updateWallet(earned);
    }
  }, [myTransactions.length]);
  
  const handleCreateListing = () => {
    if (!selectedPropertyForListing) return;
    
    const price = listingPrice ? parseFloat(listingPrice) : null;
    const listing = createListing(selectedPropertyForListing, user.id, price);
    
    if (listing) {
      alert('Property listed successfully! You will earn commission on sale.');
      setSelectedPropertyForListing(null);
      setListingPrice('');
    }
  };
  
  const availableProperties = properties.filter(p => 
    p.status === 'for-sale' || (p.owner === user.id && p.status !== 'listed')
  );
  
  return (
    <div className="agent-panel">
      <div className="panel-header">
        <h2>🏠 Real Estate Agent Dashboard</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="panel-tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          My Listings
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Listing
        </button>
      </div>
      
      <div className="panel-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Earnings</div>
                <div className="stat-value">{totalEarnings.toLocaleString()} META</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Listings</div>
                <div className="stat-value">{myListings.filter(l => l.status === 'active').length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Completed Sales</div>
                <div className="stat-value">{myTransactions.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Commission Rate</div>
                <div className="stat-value">3%</div>
              </div>
            </div>
            
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              {myTransactions.slice(-5).reverse().map(txn => (
                <div key={txn.id} className="activity-item">
                  <span>💰 Commission earned: {txn.commission.toLocaleString()} META</span>
                  <span className="activity-date">
                    {new Date(txn.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {myTransactions.length === 0 && (
                <p className="no-activity">No transactions yet. Start listing properties!</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'listings' && (
          <div className="listings-view">
            <h3>My Active Listings</h3>
            {myListings.filter(l => l.status === 'active').map(listing => {
              const property = properties.find(p => p.id === listing.propertyId);
              if (!property) return null;
              
              return (
                <div key={listing.id} className="listing-item">
                  <div className="listing-info">
                    <h4>{property.name}</h4>
                    <p>Listed Price: {listing.listingPrice.toLocaleString()} META</p>
                    <p>Potential Commission: {(listing.listingPrice * 0.03).toLocaleString()} META</p>
                    <p>Views: {listing.views} | Inquiries: {listing.inquiries}</p>
                  </div>
                  <button
                    className="view-button"
                    onClick={() => selectProperty(property.id)}
                  >
                    View Property
                  </button>
                </div>
              );
            })}
            {myListings.filter(l => l.status === 'active').length === 0 && (
              <p className="no-listings">No active listings. Create one to start earning!</p>
            )}
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div className="transactions-view">
            <h3>Transaction History</h3>
            {myTransactions.map(txn => {
              const property = properties.find(p => p.id === txn.propertyId);
              return (
                <div key={txn.id} className="transaction-item">
                  <div className="transaction-header">
                    <span className="transaction-property">
                      {property?.name || 'Unknown Property'}
                    </span>
                    <span className="transaction-commission">
                      +{txn.commission.toLocaleString()} META
                    </span>
                  </div>
                  <div className="transaction-details">
                    <span>Sale Price: {txn.finalPrice.toLocaleString()} META</span>
                    <span>{new Date(txn.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
            {myTransactions.length === 0 && (
              <p className="no-transactions">No transactions yet.</p>
            )}
          </div>
        )}
        
        {activeTab === 'create' && (
          <div className="create-listing-view">
            <h3>Create New Listing</h3>
            <div className="form-group">
              <label>Select Property</label>
              <select
                value={selectedPropertyForListing || ''}
                onChange={(e) => setSelectedPropertyForListing(e.target.value)}
              >
                <option value="">Choose a property...</option>
                {availableProperties.map(prop => (
                  <option key={prop.id} value={prop.id}>
                    {prop.name} - {prop.price.toLocaleString()} META
                  </option>
                ))}
              </select>
            </div>
            
            {selectedPropertyForListing && (
              <>
                <div className="form-group">
                  <label>Listing Price (optional, defaults to property price)</label>
                  <input
                    type="number"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    placeholder="Enter listing price"
                  />
                </div>
                
                <button
                  className="create-listing-button"
                  onClick={handleCreateListing}
                >
                  Create Listing
                </button>
              </>
            )}
            
            {availableProperties.length === 0 && (
              <p className="no-properties">
                No properties available for listing. Purchase properties first!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateAgentPanel;
