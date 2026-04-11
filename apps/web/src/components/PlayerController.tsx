import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import React, { useRef } from 'react'

export const PlayerController: React.FC = () => {
  const ref = useRef<THREE.Group | null>(null)

  useFrame((state) => {
    // simple idle bob on the player to indicate presence
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={ref} position={[0, 1.2, 0]}>
      {/* small invisible helper, can be extended into first-person controls */}
      <mesh visible={false}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  )
}

export default PlayerController
