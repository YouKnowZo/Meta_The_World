'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { Property } from '@/store/propertyStore'

interface PropertyMarkerProps {
  property: Property
  isSelected: boolean
  onSelect: () => void
}

export default function PropertyMarker({ property, isSelected, onSelect }: PropertyMarkerProps) {
  const markerRef = useRef<THREE.Group>(null)
  const pulseRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (markerRef.current) {
      // Gentle floating animation
      markerRef.current.position.y = property.location_y + Math.sin(state.clock.elapsedTime) * 0.5
    }
    if (pulseRef.current) {
      // Pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      pulseRef.current.scale.set(scale, scale, scale)
    }
  })

  const color = property.status === 'available' ? '#00ff00' : property.status === 'sold' ? '#ff0000' : '#ffff00'

  return (
    <group
      ref={markerRef}
      position={[property.location_x, property.location_y, property.location_z]}
      onClick={onSelect}
    >
      {/* Pulsing sphere */}
      <mesh ref={pulseRef} castShadow>
        <sphereGeometry args={[isSelected ? 3 : 2, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Billboard text */}
      <Billboard>
        <Text
          position={[0, 4, 0]}
          fontSize={1.5}
          color={isSelected ? '#ffffff' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000000"
        >
          {property.title}
        </Text>
        <Text
          position={[0, 2.5, 0]}
          fontSize={1}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          ${property.price.toLocaleString()}
        </Text>
      </Billboard>

      {/* Property info box */}
      {isSelected && (
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[8, 6, 0.1]} />
          <meshStandardMaterial color="#000000" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}
