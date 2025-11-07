import { Link, useLocation } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Map, ShoppingBag, Home, Landmark } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { isConnected, address } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Meta The World</span>
        </Link>

        <div className="navbar-links">
          <Link 
            to="/world" 
            className={`nav-link ${isActive('/world') ? 'active' : ''}`}
          >
            <Map size={18} />
            <span>World</span>
          </Link>
          <Link 
            to="/marketplace" 
            className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>Marketplace</span>
          </Link>
          {isConnected && (
            <Link 
              to="/my-lands" 
              className={`nav-link ${isActive('/my-lands') ? 'active' : ''}`}
            >
              <Landmark size={18} />
              <span>My Lands</span>
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {isConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button onClick={() => disconnect()} className="disconnect-btn">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={() => open()} className="connect-btn">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
