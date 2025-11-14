import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldStore } from '../stores/worldStore'
import Terrain from './Terrain'
import Buildings from './Buildings'
import PropertyMarkers from './PropertyMarkers'
import Avatars from './Avatars'

const WorldScene = () => {
  const { initialize, isLoaded } = useWorldStore()
  const sceneRef = useRef()

  useEffect(() => {
    initialize()
  }, [initialize])

  useFrame(() => {
    // Update scene animations
  })

  if (!isLoaded) return null

  return (
    <group ref={sceneRef}>
      <Terrain />
      <Buildings />
      <PropertyMarkers />
      <Avatars />
    </group>
  )
}

export default WorldScene
