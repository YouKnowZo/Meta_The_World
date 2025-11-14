import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store';

export function Avatar() {
  const user = useGameStore((state) => state.user);
  const avatarRef = useRef<THREE.Group>(null);
  
  const { position } = user.avatar;

  useFrame((state) => {
    if (avatarRef.current) {
      // Gentle bobbing animation
      avatarRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
    }
  });

  return (
    <group ref={avatarRef} position={[position.x, position.y, position.z]}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 16, 32]} />
        <meshStandardMaterial color={user.avatar.appearance.skinTone} />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={user.avatar.appearance.skinTone} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 1.05, 0.25]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={user.avatar.appearance.eyeColor} />
      </mesh>
      <mesh position={[0.1, 1.05, 0.25]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={user.avatar.appearance.eyeColor} />
      </mesh>

      {/* Hair */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={user.avatar.appearance.hairColor} />
      </mesh>

      {/* Arms */}
      <mesh castShadow position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color={user.avatar.appearance.skinTone} />
      </mesh>
      <mesh castShadow position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color={user.avatar.appearance.skinTone} />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[-0.15, -0.8, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>
      <mesh castShadow position={[0.15, -0.8, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>

      {/* Light emanating from avatar */}
      <pointLight intensity={0.5} distance={10} color="#ffffff" />
    </group>
  );
}
