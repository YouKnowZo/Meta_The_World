import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Text } from '@react-three/drei'
import { ethers } from 'ethers'
import './App.css'

// 3D Land component
function Land({ position, color = 'green', landId }: { position: [number, number, number], color?: string, landId: number }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color={hovered ? 'yellow' : color} />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Land #{landId}
      </Text>
    </group>
  )
}

function App() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lands, setLands] = useState<Array<{id: number, position: [number, number, number]}>>([])

  useEffect(() => {
    // Initialize with some demo lands
    const demoLands = [
      { id: 1, position: [0, 0, 0] as [number, number, number] },
      { id: 2, position: [3, 0, 0] as [number, number, number] },
      { id: 3, position: [-3, 0, 0] as [number, number, number] },
      { id: 4, position: [0, 0, 3] as [number, number, number] },
      { id: 5, position: [0, 0, -3] as [number, number, number] },
    ]
    setLands(demoLands)
  }, [])

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", [])
        setWallet(accounts[0])
        setIsConnected(true)
      } else {
        alert('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const mintLand = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }
    
    // This would integrate with the actual NFT contract
    alert('Minting land NFT... (Demo)')
    const newLand = {
      id: lands.length + 1,
      position: [Math.random() * 6 - 3, 0, Math.random() * 6 - 3] as [number, number, number]
    }
    setLands([...lands, newLand])
  }

  return (
    <>
      <div className="ui-overlay">
        <h1>Meta The World</h1>
        <p>Virtual Land Ownership Platform</p>
        
        {!isConnected ? (
          <button className="connect-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div>
            <p>Connected: {wallet?.slice(0, 6)}...{wallet?.slice(-4)}</p>
            <button className="mint-button" onClick={mintLand}>
              Mint Land NFT
            </button>
          </div>
        )}
        
        <p>Total Lands: {lands.length}</p>
      </div>

      <div className="canvas-container">
        <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} />
          
          {lands.map((land) => (
            <Land key={land.id} position={land.position} landId={land.id} />
          ))}
          
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    </>
  )
}

export default App
