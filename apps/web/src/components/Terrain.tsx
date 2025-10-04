import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { createNoise2D } from 'simplex-noise'
import * as THREE from 'three'

interface TerrainProps {
  size: number
  segments: number
}

export const Terrain: React.FC<TerrainProps> = ({ size = 400, segments = 200 }) => {
  const terrainRef = React.useRef<THREE.Mesh>(null)
  
  const { geometry, diffuseTexture, normalTexture, roughnessTexture, displacementTexture } = useMemo(() => {
    const noise2D = createNoise2D()
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    
    const vertices = geo.attributes.position.array as Float32Array
    const heightMap: number[] = []
    
    // Generate realistic terrain with multiple noise octaves
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      
      // Multiple octaves for realistic terrain
      const height1 = noise2D(x * 0.008, y * 0.008) * 12
      const height2 = noise2D(x * 0.02, y * 0.02) * 4
      const height3 = noise2D(x * 0.05, y * 0.05) * 1
      const height4 = noise2D(x * 0.1, y * 0.1) * 0.5
      
      const finalHeight = height1 + height2 + height3 + height4
      vertices[i + 2] = finalHeight
      heightMap.push(finalHeight)
    }
    
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    
    // Create photorealistic diffuse texture
    const diffuseCanvas = document.createElement('canvas')
    diffuseCanvas.width = 1024
    diffuseCanvas.height = 1024
    const diffuseCtx = diffuseCanvas.getContext('2d')!
    
    // Create normal map texture
    const normalCanvas = document.createElement('canvas')
    normalCanvas.width = 1024
    normalCanvas.height = 1024
    const normalCtx = normalCanvas.getContext('2d')!
    
    // Create roughness texture
    const roughnessCanvas = document.createElement('canvas')
    roughnessCanvas.width = 1024
    roughnessCanvas.height = 1024
    const roughnessCtx = roughnessCanvas.getContext('2d')!
    
    // Create displacement texture
    const displacementCanvas = document.createElement('canvas')
    displacementCanvas.width = 1024
    displacementCanvas.height = 1024
    const displacementCtx = displacementCanvas.getContext('2d')!
    
    const diffuseImageData = diffuseCtx.createImageData(1024, 1024)
    const normalImageData = normalCtx.createImageData(1024, 1024)
    const roughnessImageData = roughnessCtx.createImageData(1024, 1024)
    const displacementImageData = displacementCtx.createImageData(1024, 1024)
    
    for (let i = 0; i < diffuseImageData.data.length; i += 4) {
      const pixelIndex = i / 4
      const x = pixelIndex % 1024
      const y = Math.floor(pixelIndex / 1024)
      
      const height = noise2D(x * 0.01, y * 0.01) * 10
      const detail = noise2D(x * 0.05, y * 0.05) * 2
      const microDetail = noise2D(x * 0.2, y * 0.2) * 0.5
      const finalHeight = height + detail + microDetail
      
      // Photorealistic material based on height
      if (finalHeight < -3) {
        // Deep water - darker blue
        diffuseImageData.data[i] = 15
        diffuseImageData.data[i + 1] = 76
        diffuseImageData.data[i + 2] = 129
        roughnessImageData.data[i] = 20  // Very smooth
      } else if (finalHeight < -1) {
        // Shallow water - cyan blue
        diffuseImageData.data[i] = 64
        diffuseImageData.data[i + 1] = 164
        diffuseImageData.data[i + 2] = 223
        roughnessImageData.data[i] = 30
      } else if (finalHeight < 0.5) {
        // Beach sand - warm beige
        diffuseImageData.data[i] = 238
        diffuseImageData.data[i + 1] = 203
        diffuseImageData.data[i + 2] = 173
        roughnessImageData.data[i] = 180
      } else if (finalHeight < 3) {
        // Grass land - rich green with variation
        const grassVariation = noise2D(x * 0.1, y * 0.1) * 30
        diffuseImageData.data[i] = Math.max(0, 34 + grassVariation)
        diffuseImageData.data[i + 1] = Math.max(0, 139 + grassVariation)
        diffuseImageData.data[i + 2] = Math.max(0, 34 + grassVariation / 2)
        roughnessImageData.data[i] = 160
      } else if (finalHeight < 6) {
        // Forest - darker green
        diffuseImageData.data[i] = 21
        diffuseImageData.data[i + 1] = 94
        diffuseImageData.data[i + 2] = 21
        roughnessImageData.data[i] = 200
      } else if (finalHeight < 9) {
        // Rocky terrain - gray brown
        diffuseImageData.data[i] = 101
        diffuseImageData.data[i + 1] = 84
        diffuseImageData.data[i + 2] = 63
        roughnessImageData.data[i] = 240
      } else {
        // Snow peaks - white with blue tint
        diffuseImageData.data[i] = 240
        diffuseImageData.data[i + 1] = 248
        diffuseImageData.data[i + 2] = 255
        roughnessImageData.data[i] = 100
      }
      
      // Alpha
      diffuseImageData.data[i + 3] = 255
      roughnessImageData.data[i + 1] = roughnessImageData.data[i]
      roughnessImageData.data[i + 2] = roughnessImageData.data[i]
      roughnessImageData.data[i + 3] = 255
      
      // Generate normal map from height
      const heightNormalized = (finalHeight + 10) / 20 * 255
      normalImageData.data[i] = 128  // Normal X
      normalImageData.data[i + 1] = 128  // Normal Y  
      normalImageData.data[i + 2] = Math.max(0, Math.min(255, heightNormalized))  // Normal Z
      normalImageData.data[i + 3] = 255
      
      // Displacement map
      displacementImageData.data[i] = heightNormalized
      displacementImageData.data[i + 1] = heightNormalized
      displacementImageData.data[i + 2] = heightNormalized
      displacementImageData.data[i + 3] = 255
    }
    
    diffuseCtx.putImageData(diffuseImageData, 0, 0)
    normalCtx.putImageData(normalImageData, 0, 0)
    roughnessCtx.putImageData(roughnessImageData, 0, 0)
    displacementCtx.putImageData(displacementImageData, 0, 0)
    
    const diffuseTex = new THREE.CanvasTexture(diffuseCanvas)
    const normalTex = new THREE.CanvasTexture(normalCanvas)
    const roughnessTex = new THREE.CanvasTexture(roughnessCanvas)
    const displacementTex = new THREE.CanvasTexture(displacementCanvas)
    
    // Configure textures for realism
    const textures = [diffuseTex, normalTex, roughnessTex, displacementTex]
    textures.forEach((tex: THREE.CanvasTexture) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(8, 8)
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
    })
    
    return { 
      geometry: geo, 
      diffuseTexture: diffuseTex,
      normalTexture: normalTex,
      roughnessTexture: roughnessTex,
      displacementTexture: displacementTex
    }
  }, [size, segments])

  useFrame((state) => {
    if (terrainRef.current) {
      // Subtle animation for realism
      const time = state.clock.elapsedTime
      if (terrainRef.current.material instanceof THREE.MeshStandardMaterial) {
        terrainRef.current.material.displacementScale = 0.5 + Math.sin(time * 0.1) * 0.1
      }
    }
  })

  return (
    <>
      {/* Main terrain mesh */}
      <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]} receiveShadow>
        <primitive object={geometry} />
        <meshStandardMaterial
          map={diffuseTexture}
          normalMap={normalTexture}
          roughnessMap={roughnessTexture}
          displacementMap={displacementTexture}
          displacementScale={0.5}
          roughness={0.9}
          metalness={0.05}
          envMapIntensity={0.3}
        />
      </mesh>
      
      {/* Underwater caustics effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7.8, 0]}>
        <planeGeometry args={[size * 0.8, size * 0.8]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Atmospheric fog plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[size * 2, size * 2]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}