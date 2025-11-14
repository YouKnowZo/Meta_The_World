import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldStore } from '../stores/worldStore'
import * as THREE from 'three'

const PropertyMarkers = () => {
  const { properties, setSelectedProperty, setShowPropertyPanel } = useWorldStore()

  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
    setShowPropertyPanel(true)
  }

  return (
    <group>
      {properties.map((property) => (
        <PropertyMarker
          key={property.id}
          property={property}
          onClick={() => handlePropertyClick(property)}
        />
      ))}
    </group>
  )
}

const PropertyMarker = ({ property, onClick }) => {
  const markerRef = useRef()
  const { position, price, status } = property

  useFrame((state) => {
    if (markerRef.current) {
      // Floating animation
      markerRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5
      // Rotation
      markerRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const color = status === 'available' ? '#00ff00' : status === 'sold' ? '#ff0000' : '#ffff00'

  return (
    <group
      ref={markerRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Marker pole */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      {/* Marker flag */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Price label */}
      <mesh position={[0, 5.5, 0]}>
        <planeGeometry args={[2, 0.8]} />
        <meshStandardMaterial
          color="#000"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glow effect */}
      <pointLight
        position={[0, 4.5, 0]}
        color={color}
        intensity={0.5}
        distance={10}
      />
    </group>
  )
}

export default PropertyMarkers
