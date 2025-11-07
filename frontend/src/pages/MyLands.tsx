import { useAccount } from 'wagmi'
import { MapPin, ExternalLink } from 'lucide-react'
import './MyLands.css'

interface OwnedLand {
  id: number
  coordinates: { x: number; z: number }
  purchaseDate: string
  tokenId: string
}

export default function MyLands() {
  const { address } = useAccount()
  
  // Simulated owned lands - in production, fetch from blockchain
  const ownedLands: OwnedLand[] = address ? [
    { id: 42, coordinates: { x: 7, z: 9 }, purchaseDate: '2024-01-15', tokenId: '0x1234' },
    { id: 88, coordinates: { x: 12, z: 14 }, purchaseDate: '2024-01-20', tokenId: '0x5678' },
  ] : []

  if (!address) {
    return (
      <div className="my-lands-empty">
        <h2>Please connect your wallet to view your lands</h2>
      </div>
    )
  }

  if (ownedLands.length === 0) {
    return (
      <div className="my-lands-empty">
        <h2>You don't own any land yet</h2>
        <p>Visit the marketplace to purchase your first land parcel</p>
      </div>
    )
  }

  return (
    <div className="my-lands">
      <div className="my-lands-header">
        <h1>My Lands</h1>
        <p>Manage your NFT land parcels</p>
      </div>

      <div className="lands-grid">
        {ownedLands.map((land) => (
          <div key={land.id} className="owned-land-card">
            <div className="land-card-header">
              <h3>Land Parcel #{land.id}</h3>
              <span className="token-id">Token: {land.tokenId}</span>
            </div>
            
            <div className="land-details-section">
              <div className="detail-row">
                <MapPin size={18} />
                <span>Coordinates: ({land.coordinates.x}, {land.coordinates.z})</span>
              </div>
              <div className="detail-row">
                <span>Purchased: {land.purchaseDate}</span>
              </div>
            </div>
            
            <div className="land-actions">
              <button className="action-btn primary">
                <ExternalLink size={16} />
                View in World
              </button>
              <button className="action-btn secondary">
                List for Sale
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
