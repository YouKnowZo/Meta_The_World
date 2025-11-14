import React from 'react';
import { Box } from '@react-three/drei';

function Building({ position, size, color, name }) {
  return (
    <group position={position}>
      <Box args={size} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
      </Box>
      {name && (
        <mesh position={[0, size[1] / 2 + 1, 0]}>
          <boxGeometry args={[size[0] + 0.5, 0.5, size[2] + 0.5]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      )}
    </group>
  );
}

function Buildings() {
  const buildings = [
    { position: [20, 0, 20], size: [10, 15, 10], color: "#8B7355", name: "Residential" },
    { position: [-20, 0, 20], size: [12, 20, 12], color: "#6B7A8F", name: "Commercial" },
    { position: [20, 0, -20], size: [15, 25, 15], color: "#D4AF37", name: "Luxury" },
    { position: [-20, 0, -20], size: [8, 12, 8], color: "#7B8D93", name: "Residential" },
    { position: [0, 0, 30], size: [20, 30, 20], color: "#C9A961", name: "Penthouse" },
    { position: [40, 0, 0], size: [25, 35, 25], color: "#B8860B", name: "Mansion" },
  ];

  return (
    <>
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}
    </>
  );
}

export default Buildings;
