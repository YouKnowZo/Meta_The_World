import React, { useMemo } from 'react';
import * as THREE from 'three';

function Building({ position, width, depth, height, color }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, height + 0.5, 0]} castShadow>
        <coneGeometry args={[Math.max(width, depth) * 0.7, 1, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Windows */}
      {Array.from({ length: Math.floor(height / 2) }).map((_, i) => (
        <React.Fragment key={i}>
          <mesh position={[width / 2 + 0.01, i * 2 + 1, 0]} castShadow>
            <boxGeometry args={[0.05, 0.8, 0.8]} />
            <meshStandardMaterial color="#87ceeb" emissive="#4a90e2" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[-width / 2 - 0.01, i * 2 + 1, 0]} castShadow>
            <boxGeometry args={[0.05, 0.8, 0.8]} />
            <meshStandardMaterial color="#87ceeb" emissive="#4a90e2" emissiveIntensity={0.3} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

function Buildings() {
  const buildings = useMemo(() => {
    return [
      { position: [20, 0, -30], width: 8, depth: 8, height: 12, color: '#c0c0c0' },
      { position: [-25, 0, -35], width: 10, depth: 10, height: 15, color: '#a8a8a8' },
      { position: [35, 0, 20], width: 6, depth: 6, height: 10, color: '#d3d3d3' },
      { position: [-30, 0, 25], width: 12, depth: 8, height: 18, color: '#bebebe' },
      { position: [15, 0, 40], width: 7, depth: 7, height: 14, color: '#c8c8c8' },
      { position: [-40, 0, -10], width: 9, depth: 9, height: 16, color: '#b8b8b8' },
      { position: [40, 0, -20], width: 8, depth: 12, height: 13, color: '#d0d0d0' },
    ];
  }, []);

  return (
    <group>
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}
    </group>
  );
}

export default Buildings;
