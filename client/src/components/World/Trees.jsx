import React, { useMemo } from 'react';
import * as THREE from 'three';

function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      
      {/* Foliage */}
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#3a6b1f" />
      </mesh>
      <mesh position={[0, 5.8, 0]} castShadow>
        <coneGeometry args={[0.9, 2, 8]} />
        <meshStandardMaterial color="#4a7c2a" />
      </mesh>
    </group>
  );
}

function Trees() {
  // Generate random tree positions
  const treePositions = useMemo(() => {
    const positions = [];
    const count = 50;
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      const y = Math.sin(x * 0.05) * 2 + Math.cos(z * 0.05) * 2;
      
      // Don't place trees in water (y < 0)
      if (y > 0.5) {
        positions.push([x, y, z]);
      }
    }
    
    return positions;
  }, []);

  return (
    <group>
      {treePositions.map((position, index) => (
        <Tree key={index} position={position} />
      ))}
    </group>
  );
}

export default Trees;
