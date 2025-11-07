import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ShoppingCart, MapPin, Coins } from 'lucide-react'
import './Marketplace.css'

interface LandListing {
  id: number
  coordinates: { x: number; z: number }
  price: number
  owner: string
  image?: string
}

export default function Marketplace() {
  const { isConnected } = useAccount()
  const [listings] = useState<LandListing[]>([
    { id: 1, coordinates: { x: 5, z: 3 }, price: 2.5, owner: '0x1234...5678' },
    { id: 2, coordinates: { x: 10, z: 7 }, price: 5.0, owner: '0xabcd...efgh' },
    { id: 3, coordinates: { x: 15, z: 12 }, price: 1.8, owner: '0x9876...5432' },
    { id: 4, coordinates: { x: 8, z: 15 }, price: 3.2, owner: '0xfedc...ba98' },
    { id: 5, coordinates: { x: 20, z: 5 }, price: 7.5, owner: '0x2468...1357' },
    { id: 6, coordinates: { x: 3, z: 18 }, price: 4.0, owner: '0x1357...2468' },
  ])

  const handlePurchase = (landId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    // TODO: Implement purchase logic with smart contract
    console.log('Purchasing land:', landId)
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1>Land Marketplace</h1>
        <p>Browse and purchase NFT land parcels in the metaverse</p>
      </div>

      <div className="listings-grid">
        {listings.map((listing) => (
          <div key={listing.id} className="land-card">
            <div className="land-card-image">
              <div className="land-preview">
                <MapPin size={40} />
              </div>
              {listing.price > 5 && (
                <span className="premium-badge">Premium</span>
              )}
            </div>
            
            <div className="land-card-content">
              <h3>Land Parcel #{listing.id}</h3>
              <div className="land-info">
                <div className="info-row">
                  <span className="info-label">Coordinates:</span>
                  <span className="info-value">
                    ({listing.coordinates.x}, {listing.coordinates.z})
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Owner:</span>
                  <span className="info-value address">
                    {listing.owner}
                  </span>
                </div>
              </div>
              
              <div className="land-price">
                <Coins size={20} />
                <span className="price-value">{listing.price} ETH</span>
              </div>
              
              <button 
                className="purchase-button"
                onClick={() => handlePurchase(listing.id)}
                disabled={!isConnected}
              >
                <ShoppingCart size={18} />
                {isConnected ? 'Purchase' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
