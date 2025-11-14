import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Html } from '@react-three/drei';

function PropertyMarker({ property, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const x = parseFloat(property.location_x) || 0;
  const y = parseFloat(property.location_y) || 0;
  const z = parseFloat(property.location_z) || 0;

  return (
    <group position={[x, y, z]}>
      <Box
        ref={meshRef}
        args={[5, 5, 5]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#ff6b6b' : property.status === 'sold' ? '#95a5a6' : '#3498db'}
          metalness={0.3}
          roughness={0.4}
        />
      </Box>
      
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '5px',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            {property.title}
            <br />
            {property.price} MTC
          </div>
        </Html>
      )}
    </group>
  );
}

export default PropertyMarker;
