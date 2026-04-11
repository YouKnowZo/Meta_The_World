import React, { Suspense } from 'react'
import { useGLTF, Html, useProgress } from '@react-three/drei'

interface ModelLoaderProps {
  src: string
  scale?: number
  className?: string
}

function Loader() {
  const { progress } = useProgress()
  return <Html center className="loader-overlay">{progress.toFixed(0)} % loaded</Html>
}

function GltfModel({ src, scale = 1 }: { src: string; scale?: number }) {
  // useGLTF handles loading, caching, and draco automatically
  const { scene } = useGLTF(src)
  return <primitive object={scene} scale={scale} />
}

export const ModelLoader: React.FC<ModelLoaderProps> = ({ src, scale = 1 }) => {
  if (!src) return null

  return (
    <Suspense fallback={<Loader />}>
      <GltfModel src={src} scale={scale} />
    </Suspense>
  )
}

// Preload the main model
useGLTF.preload('/models/astronaut.glb')

export default ModelLoader
