import { useEffect, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Sky, 
  Stars, 
  Environment,
  Loader,
  PerspectiveCamera
} from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping, SSAO, DepthOfField, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import { useGameStore } from './store'
import { LandPlot } from './components/LandPlot'
import { Terrain } from './components/Terrain'

import { CryptoHub } from './components/CryptoHub'
import { CasinoHub } from './components/CasinoHub'
import { EarningHub } from './components/EarningHub'
import { VirtualLife } from './components/VirtualLife'
import './App.css'

// Ultra-Realistic Metaverse Lighting
function Lighting() {
  return (
    <>
      {/* Photorealistic Ambient */}
      <ambientLight intensity={0.08} color="#1a1a2e" />
      
      {/* Volumetric Sun (HDRI-based) */}
      <directionalLight
        position={[180, 150, 100]}
        intensity={3.2}
        color="#fff8dc"
        castShadow
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-near={0.1}
        shadow-camera-far={1200}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
        shadow-bias={-0.00005}
        shadow-normalBias={0.02}
      />
      
      {/* Atmospheric Hemisphere */}
      <hemisphereLight
        args={["#87ceeb", "#2f4f4f", 0.4]}
        position={[0, 200, 0]}
      />
      
      {/* Area Lights for Soft Illumination */}
      <rectAreaLight 
        position={[-120, 60, -120]} 
        width={150} 
        height={100}
        intensity={2.0} 
        color="#4169e1" 
      />
      <rectAreaLight 
        position={[120, 60, 120]} 
        width={150} 
        height={100}
        intensity={2.0} 
        color="#dc143c" 
      />
      
      {/* Volumetric Fog Lights */}
      <pointLight position={[-150, 20, -150]} intensity={1.5} color="#9370db" distance={300} decay={1.8} />
      <pointLight position={[150, 20, 150]} intensity={1.5} color="#20b2aa" distance={300} decay={1.8} />
      <pointLight position={[0, 35, -200]} intensity={2.0} color="#ff6347" distance={400} decay={1.5} />
      <pointLight position={[-150, 20, 150]} intensity={1.2} color="#ffd700" distance={280} decay={2} />
      <pointLight position={[150, 20, -150]} intensity={1.2} color="#00ced1" distance={280} decay={2} />
      
      {/* Cinematic Key Lights */}
      <spotLight
        position={[200, 180, 200]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 5}
        penumbra={0.4}
        intensity={2.8}
        color="#e6e6fa"
        distance={600}
        decay={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.00008}
      />
      
      <spotLight
        position={[-200, 180, -200]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 5}
        penumbra={0.4}
        intensity={2.8}
        color="#e0ffff"
        distance={600}
        decay={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.00008}
      />
      
      {/* Atmospheric Rim Lighting */}
      <rectAreaLight
        position={[0, 80, -300]}
        width={600}
        height={150}
        intensity={1.2}
        color="#4682b4"
      />
    </>
  )
}

// Scene Components
function Scene() {
  const { lands } = useGameStore()

  return (
    <>
      {/* Ultra-Realistic HDRI Environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/kiara_1_dawn_4k.hdr"
        background={true}
        backgroundBlurriness={0.3}
        backgroundIntensity={0.8}
        environmentIntensity={1.2}
        environmentRotation={[0, Math.PI / 6, 0]}
      />
      
      {/* Photorealistic Atmospheric Sky */}
      <Sky 
        distance={800000}
        sunPosition={[180, 150, 100]}
        inclination={0.1}
        azimuth={0.15}
        rayleigh={1.2}
        turbidity={8}
        mieCoefficient={0.012}
        mieDirectionalG={0.85}
      />
      
      {/* Ultra-Dense Star Field */}
      <Stars 
        radius={800} 
        depth={120} 
        count={50000} 
        factor={12} 
        saturation={0.1} 
        fade 
        speed={0.8}
      />

      {/* Volumetric Atmospheric Fog */}
      <fog attach="fog" args={['#1a1a2e', 200, 1500]} />

      {/* Enhanced Lighting */}
      <Lighting />

      {/* Cyber Grid Floor */}
      <Terrain size={400} segments={200} />

      {/* Land Plots with Glow */}
      {lands.map((land) => (
        <LandPlot key={land.id} land={land} />
      ))}

      {/* Ultra-Realistic Post Processing Pipeline */}
      <EffectComposer multisampling={16} stencilBuffer={false} depthBuffer={true}>
        {/* Advanced Bloom with Multiple Passes */}
        <Bloom 
          intensity={0.6}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.9}
          height={800}
          kernelSize={5}
          mipmapBlur={true}
          levels={9}
        />
        
        {/* Cinematic Tone Mapping */}
        <ToneMapping 
          adaptive={true}
          resolution={512}
          middleGrey={0.4}
          maxLuminance={20.0}
          averageLuminance={0.8}
          adaptationRate={2.0}  
        />
        
        {/* Screen Space Ambient Occlusion */}
        <SSAO
          samples={32}
          radius={0.1}
          intensity={1.2}
          bias={0.005}
          distanceThreshold={0.5}
          worldDistanceThreshold={0.5}
          worldDistanceFalloff={0.1}
          worldProximityThreshold={0.02}
          worldProximityFalloff={0.005}
        />
        
        {/* Depth of Field */}
        <DepthOfField 
          focusDistance={50}
          focalLength={0.02}
          bokehScale={2.0}
        />
        
        {/* Film Grain */}
        <Noise 
          premultiply
          blendFunction={BlendFunction.SCREEN}
        />
      </EffectComposer>
    </>
  )
}

function App() {
  const { 
    generateWorld, 
    setCurrentUser,
    currentUser
  } = useGameStore()

  const [showLanding, setShowLanding] = useState(true)
  const [walletConnecting, setWalletConnecting] = useState(false)
  const [showCryptoHub, setShowCryptoHub] = useState(false)
  const [showCasino, setShowCasino] = useState(true)
  const [showEarningHub, setShowEarningHub] = useState(true)
  const [showVirtualLife, setShowVirtualLife] = useState(false)
  const [achievementNotification, setAchievementNotification] = useState<string | null>(null)

  const [cryptoData, setCryptoData] = useState({
    ethPrice: 3247.82,
    landsSold: 847,
    totalRevenue: 2847291,
    activeUsers: 12847
  })

  useEffect(() => {
    // Initialize the game world
    generateWorld()
    
    // Simulate real-time crypto data updates
    const interval = setInterval(() => {
      setCryptoData(prev => ({
        ethPrice: prev.ethPrice + (Math.random() - 0.5) * 10,
        landsSold: prev.landsSold + Math.floor(Math.random() * 3),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 10000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [generateWorld])

  useEffect(() => {
    // Show achievement notifications periodically for engagement
    const achievementTimer = setInterval(() => {
      if (!showLanding && Math.random() > 0.8) {
        const achievements = [
          { title: 'Land Baron', description: 'Own 5 properties', icon: '🏰', reward: 500 },
          { title: 'Casino Winner', description: 'Win $1000 in games', icon: '🎰', reward: 250 },
          { title: 'Social Star', description: 'Make 50 friends', icon: '⭐', reward: 100 },
          { title: 'Crypto Trader', description: 'Complete 100 trades', icon: '📈', reward: 750 }
        ]
        const selectedAchievement = achievements[Math.floor(Math.random() * achievements.length)]
        setAchievementNotification(`${selectedAchievement.icon} ${selectedAchievement.title}: ${selectedAchievement.description}`)
        setTimeout(() => setAchievementNotification(null), 5000)
      }
    }, 15000)

    return () => clearInterval(achievementTimer)
  }, [showLanding])

  const connectWallet = async () => {
    setWalletConnecting(true)
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('🚀 MetaMask is required to enter the Metaverse!\n\nPlease:\n1. Install MetaMask extension\n2. Create or import a wallet\n3. Return here to connect')
        window.open('https://metamask.io/download/', '_blank')
        return
      }

      // Check if MetaMask is accessible
      if (!window.ethereum.isMetaMask) {
        alert('Please use MetaMask as your wallet provider for the best experience.')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // Request account access
      const accounts = await provider.send("eth_requestAccounts", [])
      
      if (!accounts || accounts.length === 0) {
        alert('No accounts found. Please unlock MetaMask and try again.')
        return
      }

      // Get network information
      const network = await provider.getNetwork()
      
      // Simulate connection process for better UX
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Set user data with real wallet info
      setCurrentUser({
        address: accounts[0],
        balance: Math.floor(Math.random() * 10000), // In a real app, fetch real balance
        ownedLands: [],
        avatar: {
          position: [0, 0, 0],
          color: '#00d4ff'
        },
        achievements: [`Connected to ${network.name}`, 'Metaverse Explorer']
      })
      
      // Show success and enter metaverse
      console.log(`✅ Connected to MetaMask on ${network.name}`)
      console.log(`🎯 Wallet: ${accounts[0]}`)
      
      setShowLanding(false)
      
      // Show achievement notification
      setAchievementNotification('🎉 Welcome to the Metaverse! Your wallet is connected and ready!')
      setTimeout(() => setAchievementNotification(null), 4000)
      
    } catch (error: unknown) {
      console.error('Wallet connection error:', error)
      
      let errorMessage = 'Failed to connect wallet. '
      
      if (error && typeof error === 'object' && 'code' in error) {
        const errorObj = error as { code: number; message?: string }
        if (errorObj.code === 4001) {
          errorMessage += 'You cancelled the connection request.'
        } else if (errorObj.code === -32002) {
          errorMessage += 'Please check MetaMask - there might be a pending connection request.'
        } else if (errorObj.message?.includes('User rejected')) {
          errorMessage += 'Connection was rejected.'
        }
      }
      
      alert(`🚫 ${errorMessage}`)
    } finally {
      setWalletConnecting(false)
    }
  }

  if (showLanding) {
    return (
      <div className="landing-container">
        <div className="cyber-bg"></div>
        <div className="particles"></div>
        
        <motion.div 
          className="landing-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="hero-section">
            <motion.h1 
              className="metaverse-logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              META THE WORLD
            </motion.h1>
            
            <motion.p 
              className="metaverse-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              🚀 THE ULTIMATE METAVERSE EXPERIENCE • 💰 EARN REAL MONEY • 🎰 PLAY & WIN • 🏠 LIVE VIRTUALLY
            </motion.p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">${cryptoData.ethPrice.toFixed(2)}</div>
                <div className="stat-label">ETH Price</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{cryptoData.landsSold.toLocaleString()}</div>
                <div className="stat-label">Lands Sold</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">${cryptoData.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Volume</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{cryptoData.activeUsers.toLocaleString()}</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>

            <motion.button 
              className={`connect-wallet-btn ${walletConnecting ? 'connecting' : ''}`}
              onClick={connectWallet}
              disabled={walletConnecting}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 255, 255, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {walletConnecting ? (
                <>
                  <span className="spinner"></span>
                  Connecting Wallet...
                </>
              ) : (
                <>
                  🔗 Connect Wallet & Enter Metaverse
                  <span className="btn-glow"></span>
                </>
              )}
            </motion.button>

            <div className="trust-indicators">
              <div className="indicator">🔒 Secured by Ethereum</div>
              <div className="indicator">⚡ Lightning Fast Trades</div>
              <div className="indicator">🏆 VIP Rewards System</div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="metaverse-container">
        <Canvas
          shadows="soft"
          camera={{ 
            position: [60, 40, 60], 
            fov: 80,
            near: 0.1,
            far: 2000
          }}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance",
            outputColorSpace: "srgb"
          }}
          dpr={[1, 2]}
        >
          <PerspectiveCamera makeDefault position={[60, 40, 60]} fov={80} near={0.1} far={2000} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={300}
            maxPolarAngle={Math.PI / 2.1}
            enableDamping
            dampingFactor={0.03}
            rotateSpeed={0.5}
            zoomSpeed={1.2}
          />
        </Canvas>
      </div>

      {/* Comprehensive Metaverse Interface */}
      <div className="metaverse-ui">
        {/* Navigation Hub */}
        <div className="metaverse-navigation">
          <h2>🌐 The Meta World</h2>
          <div className="nav-controls">
            <button 
              onClick={() => setShowCryptoHub(true)}
              className={`nav-button ${showCryptoHub ? 'active' : ''}`}
            >
              💰 Crypto Hub
            </button>
            <button 
              onClick={() => setShowCasino(true)}
              className={`nav-button ${showCasino ? 'active' : ''}`}
            >
              🎰 Casino
            </button>
            <button 
              onClick={() => setShowEarningHub(true)}
              className={`nav-button ${showEarningHub ? 'active' : ''}`}
            >
              💎 Earnings
            </button>
            <button 
              onClick={() => setShowVirtualLife(true)}
              className={`nav-button ${showVirtualLife ? 'active' : ''}`}
            >
              🏠 Virtual Life
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="user-profile">
          {currentUser ? (
            <div className="profile-info">
              <div className="avatar">🧑‍💼</div>
              <div className="user-details">
                <h3>User {currentUser.address.slice(-4)}</h3>
                <p>Balance: {currentUser.balance} ETH</p>
                <div className="balance">
                  <span>🏠 {currentUser.ownedLands.length} Lands</span>
                  <span>🏆 {currentUser.achievements.length} achievements</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="wallet-section">
              <button onClick={connectWallet} className="connect-wallet-btn">
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Achievement Notifications */}
        {achievementNotification && (
          <div className="achievement-notification">
            <div className="achievement-content">
              <span className="achievement-icon">🏆</span>
              <div className="achievement-text">
                <h4>Achievement Unlocked!</h4>
                <p>{achievementNotification}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Modals */}
        {showCryptoHub && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                onClick={() => setShowCryptoHub(false)}
                className="close-modal"
              >
                ✕
              </button>
              <CryptoHub 
                isVisible={showCryptoHub} 
                onClose={() => setShowCryptoHub(false)} 
              />
            </div>
          </div>
        )}

        {showCasino && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                onClick={() => setShowCasino(false)}
                className="close-modal"
              >
                ✕
              </button>
              <CasinoHub 
                isVisible={showCasino} 
              />
            </div>
          </div>
        )}

        {showEarningHub && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                onClick={() => setShowEarningHub(false)}
                className="close-modal"
              >
                ✕
              </button>
              <EarningHub 
                isVisible={showEarningHub} 
              />
            </div>
          </div>
        )}

        {showVirtualLife && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                onClick={() => setShowVirtualLife(false)}
                className="close-modal"
              >
                ✕
              </button>
              <VirtualLife 
                isVisible={showVirtualLife} 
              />
            </div>
          </div>
        )}
      </div>

      <Loader />
    </>
  )
}

export default App
