import React, { useMemo } from 'react'
import { useWorldStore } from '../stores/worldStore'
import * as THREE from 'three'

const Buildings = () => {
  const { properties } = useWorldStore()

  // Generate diverse building types
  const buildings = useMemo(() => {
    const buildingTypes = [
      { type: 'residential', color: '#8B7355', height: 10 },
      { type: 'commercial', color: '#4A5568', height: 20 },
      { type: 'skyscraper', color: '#2D3748', height: 40 },
      { type: 'mansion', color: '#C9A961', height: 8 },
      { type: 'modern', color: '#718096', height: 15 },
    ]

    const buildingArray = []
    for (let i = 0; i < 50; i++) {
      const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)]
      const x = (Math.random() - 0.5) * 800
      const z = (Math.random() - 0.5) * 800
      buildingArray.push({
        id: `building-${i}`,
        position: [x, type.height / 2, z],
        type: type.type,
        color: type.color,
        height: type.height,
        width: 5 + Math.random() * 10,
        depth: 5 + Math.random() * 10,
      })
    }
    return buildingArray
  }, [])

  return (
    <group>
      {buildings.map((building) => (
        <Building key={building.id} {...building} />
      ))}
    </group>
  )
}

const Building = ({ position, color, height, width, depth }) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.1}
      />
      {/* Windows */}
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.9, height * 0.9]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#0f3460"
          emissiveIntensity={0.3}
        />
      </mesh>
    </mesh>
  )
}

export default Buildings
