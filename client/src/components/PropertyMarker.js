import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import './PropertyMarker.css';

function PropertyMarker({ property, onSelect, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const statusColor = {
    available: '#4ade80',
    listed: '#fbbf24',
    sold: '#ef4444'
  }[property.status] || '#94a3b8';

  return (
    <group
      ref={meshRef}
      position={[property.location_x, 0, property.location_z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Marker pole */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Status indicator */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : statusColor}
          emissive={isSelected ? '#3b82f6' : statusColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Price label */}
      {(hovered || isSelected) && (
        <Html position={[0, 3, 0]} center>
          <div className="property-label">
            <div className="property-title">{property.title}</div>
            <div className="property-price">${property.price.toLocaleString()}</div>
            <div className="property-status">{property.status}</div>
          </div>
        </Html>
      )}

      {/* Property foundation */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
    </group>
  );
}

export default PropertyMarker;
