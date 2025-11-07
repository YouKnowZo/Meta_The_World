import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

interface LandGridProps {
  gridSize: number
  selectedLand: number | null
  onLandSelect: (id: number | null) => void
}

export default function LandGrid({ gridSize, selectedLand, onLandSelect }: LandGridProps) {
  const lands = useMemo(() => {
    const landArray = []
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        landArray.push({
          id: x * gridSize + z,
          x: x - gridSize / 2,
          z: z - gridSize / 2,
          owned: Math.random() > 0.7, // Simulated ownership
          price: Math.floor(Math.random() * 10) + 1 // Simulated price in ETH
        })
      }
    }
    return landArray
  }, [gridSize])

  return (
    <group>
      {lands.map((land) => (
        <LandTile
          key={land.id}
          land={land}
          isSelected={selectedLand === land.id}
          onSelect={() => onLandSelect(land.id === selectedLand ? null : land.id)}
        />
      ))}
    </group>
  )
}

interface LandTileProps {
  land: {
    id: number
    x: number
    z: number
    owned: boolean
    price: number
  }
  isSelected: boolean
  onSelect: () => void
}

function LandTile({ land, isSelected, onSelect }: LandTileProps) {
  const color = land.owned 
    ? new THREE.Color(0x8b5cf6) // Purple for owned
    : new THREE.Color(0x6366f1) // Blue for available

  return (
    <mesh
      position={[land.x, 0, land.z]}
      onClick={onSelect}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <boxGeometry args={[0.9, 0.1, 0.9]} />
      <meshStandardMaterial
        color={isSelected ? 0xffd700 : color}
        emissive={isSelected ? 0xffd700 : color}
        emissiveIntensity={isSelected ? 0.5 : 0.1}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  )
}
