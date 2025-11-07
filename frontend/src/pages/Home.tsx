import { Link } from 'react-router-dom'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { ArrowRight, Globe, Cube, Zap } from 'lucide-react'
import './Home.css'

export default function Home() {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Meta The World</span>
          </h1>
          <p className="hero-subtitle">
            Own, build, and explore in the ultimate AR/VR metaverse experience.
            Purchase NFT land parcels and create your digital empire.
          </p>
          <div className="hero-actions">
            {isConnected ? (
              <Link to="/world" className="primary-btn">
                Enter World
                <ArrowRight size={20} />
              </Link>
            ) : (
              <button onClick={() => open()} className="primary-btn">
                Connect Wallet to Start
                <ArrowRight size={20} />
              </button>
            )}
            <Link to="/marketplace" className="secondary-btn">
              Browse Marketplace
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cube">
            <Cube size={200} strokeWidth={1} />
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Globe size={40} />
            </div>
            <h3>3D Virtual World</h3>
            <p>Explore a vast, immersive 3D metaverse built with cutting-edge WebXR technology</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Cube size={40} />
            </div>
            <h3>NFT Land Ownership</h3>
            <p>Own virtual land parcels as NFTs on the blockchain. True digital property rights</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={40} />
            </div>
            <h3>AR/VR Ready</h3>
            <p>Experience the metaverse in augmented and virtual reality with full WebXR support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
