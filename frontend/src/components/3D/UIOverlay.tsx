import { useAccount } from 'wagmi'
import { X, ShoppingCart } from 'lucide-react'
import './UIOverlay.css'

interface UIOverlayProps {
  selectedLand: number | null
  onClose: () => void
}

export default function UIOverlay({ selectedLand, onClose }: UIOverlayProps) {
  const { address } = useAccount()

  if (selectedLand === null) return null

  // Simulated land data
  const landData = {
    id: selectedLand,
    coordinates: { x: Math.floor(selectedLand / 20), z: selectedLand % 20 },
    owned: Math.random() > 0.7,
    price: Math.floor(Math.random() * 10) + 1,
    owner: address || '0x0000...0000'
  }

  return (
    <div className="ui-overlay">
      <div className="land-info-panel">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2>Land Parcel #{landData.id}</h2>
        
        <div className="land-details">
          <div className="detail-item">
            <span className="detail-label">Coordinates:</span>
            <span className="detail-value">
              ({landData.coordinates.x}, {landData.coordinates.z})
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className={`detail-value ${landData.owned ? 'owned' : 'available'}`}>
              {landData.owned ? 'Owned' : 'Available'}
            </span>
          </div>
          
          {landData.owned && (
            <div className="detail-item">
              <span className="detail-label">Owner:</span>
              <span className="detail-value address">
                {landData.owner.slice(0, 6)}...{landData.owner.slice(-4)}
              </span>
            </div>
          )}
          
          {!landData.owned && (
            <div className="detail-item">
              <span className="detail-label">Price:</span>
              <span className="detail-value price">
                {landData.price} ETH
              </span>
            </div>
          )}
        </div>
        
        {!landData.owned && (
          <button className="purchase-btn">
            <ShoppingCart size={18} />
            Purchase Land
          </button>
        )}
      </div>
    </div>
  )
}
