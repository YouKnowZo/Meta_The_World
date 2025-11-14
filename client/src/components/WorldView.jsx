import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, PerspectiveCamera } from '@react-three/drei'
import { useStore } from '../store'
import Terrain from './3D/Terrain'
import Player from './3D/Player'
import Properties from './3D/Properties'
import UI from './UI'
import { io } from 'socket.io-client'

export default function WorldView() {
  const { user, token } = useStore()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user || !token) return

    // Connect to socket
    socketRef.current = io('http://localhost:3000', {
      auth: { token }
    })

    socketRef.current.emit('join-world', {
      userId: user.id,
      username: user.username,
      avatar: user.avatar_url
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user, token])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Environment */}
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <Environment preset="sunset" />
          
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 10, 20]} fov={75} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={100}
          />
          
          {/* World Components */}
          <Terrain />
          <Properties />
          <Player socket={socketRef.current} />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <UI />
    </div>
  )
}
