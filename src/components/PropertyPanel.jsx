import React from 'react'
import { useWorldStore } from '../stores/worldStore'
import './PropertyPanel.css'

const PropertyPanel = () => {
  const {
    selectedProperty,
    setShowPropertyPanel,
    isAgent,
    socket,
    user
  } = useWorldStore()

  if (!selectedProperty) return null

  const handlePurchase = () => {
    if (selectedProperty.status === 'available') {
      socket.emit('purchaseProperty', {
        propertyId: selectedProperty.id,
        buyerId: user?.id || 'guest',
        agentId: isAgent ? user?.id : null
      })
      setShowPropertyPanel(false)
    }
  }

  const handleListForSale = () => {
    socket.emit('listProperty', {
      propertyId: selectedProperty.id,
      price: selectedProperty.price,
      agentId: isAgent ? user?.id : null
    })
  }

  return (
    <div className="property-panel-overlay" onClick={() => setShowPropertyPanel(false)}>
      <div className="property-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => setShowPropertyPanel(false)}>
          ×
        </button>
        
        <div className="property-header">
          <h2>{selectedProperty.name || `Property ${selectedProperty.id}`}</h2>
          <span className={`status-badge status-${selectedProperty.status}`}>
            {selectedProperty.status}
          </span>
        </div>

        <div className="property-image-placeholder">
          <div className="image-placeholder-content">
            <span>🏠</span>
            <p>3D Property View</p>
          </div>
        </div>

        <div className="property-details">
          <div className="detail-row">
            <span className="detail-label">Price:</span>
            <span className="detail-value">${selectedProperty.price.toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{selectedProperty.type || 'Residential'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Size:</span>
            <span className="detail-value">{selectedProperty.size || '2000 sq ft'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">
              {selectedProperty.position.map(p => p.toFixed(1)).join(', ')}
            </span>
          </div>
        </div>

        <div className="property-description">
          <p>
            {selectedProperty.description || 
              'A beautiful property in the virtual world. Perfect for your digital life. ' +
              'This hyper-realistic virtual property offers everything you need and more.'}
          </p>
        </div>

        <div className="property-actions">
          {selectedProperty.status === 'available' && (
            <button className="action-button purchase-button" onClick={handlePurchase}>
              Purchase Property
            </button>
          )}
          {isAgent && selectedProperty.status !== 'available' && (
            <button className="action-button list-button" onClick={handleListForSale}>
              List for Sale
            </button>
          )}
          {isAgent && (
            <div className="agent-note">
              <p>💼 As an agent, you'll earn 5% commission on this sale</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyPanel
