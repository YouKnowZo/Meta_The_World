import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei'
import { useAccount } from 'wagmi'
import LandGrid from '../components/3D/LandGrid'
import UIOverlay from '../components/3D/UIOverlay'
import './World.css'

export default function World() {
  const { isConnected } = useAccount()
  const [selectedLand, setSelectedLand] = useState<number | null>(null)

  if (!isConnected) {
    return (
      <div className="world-error">
        <h2>Please connect your wallet to enter the world</h2>
      </div>
    )
  }

  return (
    <div className="world-container">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={75} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Environment preset="sunset" />
          
          <LandGrid 
            gridSize={20} 
            selectedLand={selectedLand}
            onLandSelect={setSelectedLand}
          />
          
          <Grid 
            args={[20, 20]} 
            cellColor="#6366f1" 
            sectionColor="#8b5cf6"
            cellThickness={0.5}
            sectionThickness={1}
            fadeDistance={25}
            fadeStrength={1}
          />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Suspense>
      </Canvas>
      
      <UIOverlay 
        selectedLand={selectedLand}
        onClose={() => setSelectedLand(null)}
      />
    </div>
  )
}
