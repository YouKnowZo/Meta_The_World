import React from 'react';
import { Box, Sphere } from '@react-three/drei';

const Buildings = () => {
  // Generate various buildings across the world
  const buildings = [
    { position: [20, 0, 20], size: [10, 30, 10], color: '#8b9dc3' },
    { position: [-30, 0, 25], size: [15, 40, 15], color: '#dfe3ee' },
    { position: [50, 0, -20], size: [12, 25, 12], color: '#f7f7f7' },
    { position: [-50, 0, -30], size: [20, 50, 20], color: '#b0c4de' },
    { position: [0, 0, 50], size: [18, 35, 18], color: '#d3d3d3' },
  ];

  return (
    <>
      {buildings.map((building, index) => (
        <group key={index} position={building.position}>
          <Box args={building.size} castShadow receiveShadow>
            <meshStandardMaterial color={building.color} />
          </Box>
          {/* Windows */}
          {Array.from({ length: Math.floor(building.size[1] / 5) }).map((_, i) => (
            <Box
              key={i}
              args={[1, 1.5, 0.1]}
              position={[building.size[0] / 2 + 0.1, -building.size[1] / 2 + (i + 1) * 5, 0]}
            >
              <meshStandardMaterial
                color={Math.random() > 0.5 ? '#ffd700' : '#1a1a2e'}
                emissive={Math.random() > 0.5 ? '#ffd700' : '#000000'}
                emissiveIntensity={0.3}
              />
            </Box>
          ))}
        </group>
      ))}
    </>
  );
};

export default Buildings;
