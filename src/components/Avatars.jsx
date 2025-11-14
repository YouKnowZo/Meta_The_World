import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Avatars = () => {
  // Generate random avatars representing other users
  const avatars = useMemo(() => {
    const avatarArray = []
    for (let i = 0; i < 20; i++) {
      avatarArray.push({
        id: `avatar-${i}`,
        position: [
          (Math.random() - 0.5) * 500,
          5,
          (Math.random() - 0.5) * 500
        ],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      })
    }
    return avatarArray
  }, [])

  return (
    <group>
      {avatars.map((avatar) => (
        <Avatar key={avatar.id} {...avatar} />
      ))}
    </group>
  )
}

const Avatar = ({ position, color }) => {
  const avatarRef = useRef()

  useFrame(() => {
    if (avatarRef.current) {
      // Subtle floating animation
      avatarRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.2
    }
  })

  return (
    <group ref={avatarRef} position={position}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Name tag */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshStandardMaterial
          color="#000"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default Avatars
