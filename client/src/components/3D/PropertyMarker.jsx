import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Text, Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function PropertyMarker({ property, position }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/property/${property.id}`)
  }

  const statusColor = {
    available: '#4caf50',
    sold: '#f44336',
    pending: '#ff9800'
  }[property.status] || '#9e9e9e'

  return (
    <group position={position}>
      {/* Property marker */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <boxGeometry args={[2, 0.1, 2]} />
        <meshStandardMaterial
          color={statusColor}
          opacity={0.7}
          transparent
          emissive={statusColor}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Price label */}
      {hovered && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {property.title}
          {'\n'}
          ${property.price?.toLocaleString()}
        </Text>
      )}
    </group>
  )
}
