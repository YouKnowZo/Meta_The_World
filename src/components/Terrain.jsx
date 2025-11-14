import React, { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

const Terrain = () => {
  // Create realistic terrain with height variation
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    const vertices = geo.attributes.position.array
    
    // Add realistic height variation
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const z = vertices[i + 2]
      // Create natural terrain variation
      vertices[i + 1] = 
        Math.sin(x * 0.01) * 5 +
        Math.cos(z * 0.01) * 5 +
        Math.sin(x * 0.05 + z * 0.05) * 2 +
        (Math.random() - 0.5) * 1
    }
    
    geo.computeVertexNormals()
    return geo
  }, [])

  // Create realistic grass texture
  const grassColor = useMemo(() => {
    return new THREE.Color(0.2, 0.4, 0.1)
  }, [])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={grassColor}
        roughness={0.8}
        metalness={0.1}
        flatShading={false}
      />
    </mesh>
  )
}

export default Terrain
