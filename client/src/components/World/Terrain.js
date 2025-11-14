import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

function Terrain() {
  const meshRef = useRef();

  return (
    <Plane
      ref={meshRef}
      args={[1000, 1000]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#4a7c59"
        roughness={0.8}
        metalness={0.2}
      />
    </Plane>
  );
}

export default Terrain;
