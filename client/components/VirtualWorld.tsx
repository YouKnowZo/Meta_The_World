'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, PerspectiveCamera, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { usePropertyStore } from '@/store/propertyStore'
import PropertyMarker from './PropertyMarker'

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 2
    }
  })

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000, 100, 100]} />
        <meshStandardMaterial
          color="#2a5a3a"
          roughness={0.8}
          metalness={0.2}
          displacementScale={5}
        />
      </mesh>
      {/* Roads */}
      {[-200, -100, 0, 100, 200].map((x) => (
        <mesh key={`road-x-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.1, 0]} receiveShadow>
          <planeGeometry args={[20, 1000]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.3} />
        </mesh>
      ))}
      {[-200, -100, 0, 100, 200].map((z) => (
        <mesh key={`road-z-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, z]} receiveShadow>
          <planeGeometry args={[1000, 20]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.3} />
        </mesh>
      ))}
    </>
  )
}

function Buildings() {
  const buildings = []
  const colors = ['#8B7355', '#6B5B4F', '#9B8B7F', '#7B6B5F', '#A0A0A0', '#C0C0C0']
  
  // Generate random buildings with windows
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 800
    const z = (Math.random() - 0.5) * 800
    const height = Math.random() * 30 + 10
    const width = Math.random() * 20 + 10
    const depth = Math.random() * 20 + 10
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    buildings.push(
      <group key={i} position={[x, height / 2, z]}>
        {/* Main building */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Windows */}
        {Array.from({ length: Math.floor(height / 5) }).map((_, floor) => (
          <group key={floor}>
            <mesh position={[width / 2 + 0.1, (floor - Math.floor(height / 5) / 2) * 5, 0]} castShadow>
              <boxGeometry args={[0.2, 2, depth * 0.8]} />
              <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[-width / 2 - 0.1, (floor - Math.floor(height / 5) / 2) * 5, 0]} castShadow>
              <boxGeometry args={[0.2, 2, depth * 0.8]} />
              <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    )
  }
  
  return <>{buildings}</>
}

function Trees() {
  const trees = []
  
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 900
    const z = (Math.random() - 0.5) * 900
    const height = Math.random() * 5 + 3
    
    trees.push(
      <group key={i} position={[x, height / 2, z]}>
        {/* Trunk */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, height * 0.4]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        {/* Foliage */}
        <mesh position={[0, height * 0.4, 0]} castShadow>
          <coneGeometry args={[height * 0.6, height * 0.8, 8]} />
          <meshStandardMaterial color="#2d5016" />
        </mesh>
      </group>
    )
  }
  
  return <>{trees}</>
}

function Lighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  
  useFrame((state) => {
    if (sunRef.current) {
      // Animate sun position for day/night cycle
      const time = state.clock.elapsedTime * 0.1
      sunRef.current.position.x = Math.cos(time) * 100
      sunRef.current.position.y = Math.sin(time) * 50 + 50
      sunRef.current.position.z = Math.sin(time) * 100
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={sunRef}
        position={[50, 100, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
      />
      <pointLight position={[-50, 50, -50]} intensity={0.3} />
      <hemisphereLight intensity={0.3} color="#87CEEB" groundColor="#2a5a3a" />
    </>
  )
}

function CameraController() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(50, 50, 50)
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  return null
}

export default function VirtualWorld() {
  const { properties, fetchProperties } = usePropertyStore()
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [50, 50, 50], fov: 60 }}
      >
        <CameraController />
        <Lighting />
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset="sunset" />
        
        <Terrain />
        <Buildings />
        <Trees />
        
        {/* Water features */}
        {[
          { x: -300, z: -300 },
          { x: 300, z: 300 },
          { x: -300, z: 300 }
        ].map((pos, i) => (
          <mesh
            key={`water-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[pos.x, 0.2, pos.z]}
          >
            <circleGeometry args={[30, 32]} />
            <meshStandardMaterial
              color="#4169E1"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        ))}
        
        {/* Property Markers */}
        {properties.map((property) => (
          <PropertyMarker
            key={property.id}
            property={property}
            isSelected={selectedProperty === property.id}
            onSelect={() => setSelectedProperty(property.id)}
          />
        ))}
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={500}
        />
        
        <fog attach="fog" args={['#87CEEB', 200, 800]} />
      </Canvas>
    </div>
  )
}
