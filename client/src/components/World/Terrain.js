import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Terrain = () => {
  const meshRef = useRef();

  // Create realistic terrain with noise
  const generateTerrain = () => {
    const size = 500;
    const segments = 100;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      // Simple noise function for terrain height
      vertices[i + 1] = 
        Math.sin(x * 0.01) * 5 +
        Math.cos(z * 0.01) * 5 +
        Math.sin(x * 0.05 + z * 0.05) * 2;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  };

  const geometry = generateTerrain();

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#4a7c59"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
};

export default Terrain;
