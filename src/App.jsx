import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Sky, Stars } from '@react-three/drei'
import { useWorldStore } from './stores/worldStore'
import WorldScene from './components/WorldScene'
import UI from './components/UI'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const { isLoaded } = useWorldStore()

  return (
    <div className="app-container">
      {!isLoaded && <LoadingScreen />}
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 50, 100]} fov={60} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 100, 50]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={500}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />
        <pointLight position={[-50, 50, -50]} intensity={0.5} />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
        />
        <Stars radius={300} depth={60} count={20000} factor={7} fade speed={1} />
        <fog attach="fog" args={['#87CEEB', 100, 1000]} />
        <Suspense fallback={null}>
          <WorldScene />
        </Suspense>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={500}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <UI />
    </div>
  )
}

export default App
