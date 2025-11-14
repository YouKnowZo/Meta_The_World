import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store';
import { generateProperties } from '../../utils/propertyGenerator';
import type { Property } from '../../types';

function Building({ property }: { property: Property }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const selectedProperty = useGameStore((state) => state.selectedProperty);
  const setSelectedProperty = useGameStore((state) => state.setSelectedProperty);
  const setShowRealEstateUI = useGameStore((state) => state.setShowRealEstateUI);
  
  const isSelected = selectedProperty?.id === property.id;
  const forSale = property.forSale;

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = property.size.height / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    } else if (meshRef.current) {
      meshRef.current.position.y = property.size.height / 2;
    }
  });

  // Building colors based on type and status
  const getBuildingColor = () => {
    if (isSelected) return '#ffeb3b';
    if (forSale) return '#4caf50';
    if (property.ownerId) return '#2196f3';
    return '#9e9e9e';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setShowRealEstateUI(true);
  };

  return (
    <group position={[property.position.x, 0, property.position.z]}>
      {/* Main building */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        position={[0, property.size.height / 2, 0]}
      >
        <boxGeometry args={[property.size.width, property.size.height, property.size.depth]} />
        <meshStandardMaterial
          color={getBuildingColor()}
          roughness={0.3}
          metalness={0.5}
          emissive={isSelected ? '#ffeb3b' : forSale ? '#4caf50' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : forSale ? 0.1 : 0}
        />
      </mesh>

      {/* Windows */}
      {Array.from({ length: Math.floor(property.size.height / 3) }).map((_, floor) =>
        Array.from({ length: 4 }).map((_, side) => {
          const angle = (side * Math.PI) / 2;
          const radius = side % 2 === 0 ? property.size.width / 2 : property.size.depth / 2;
          
          return (
            <group key={`${floor}-${side}`}>
              {Array.from({ length: 3 }).map((_, window) => (
                <mesh
                  key={window}
                  position={[
                    Math.sin(angle) * (radius + 0.1),
                    3 + floor * 3,
                    Math.cos(angle) * (radius + 0.1)
                  ]}
                  rotation={[0, angle, 0]}
                >
                  <boxGeometry args={[1.5, 2, 0.1]} />
                  <meshStandardMaterial
                    color="#87ceeb"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#fff9c4"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              ))}
            </group>
          );
        })
      )}

      {/* For Sale sign */}
      {forSale && (
        <mesh position={[property.size.width / 2 + 2, 3, 0]}>
          <boxGeometry args={[3, 2, 0.2]} />
          <meshStandardMaterial color="#ff5722" emissive="#ff5722" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Property foundation */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[property.size.width + 2, 1, property.size.depth + 2]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Buildings() {
  const allProperties = useGameStore((state) => state.allProperties);
  const setProperties = useGameStore((state) => state.setProperties);

  useEffect(() => {
    if (allProperties.length === 0) {
      setProperties(generateProperties(50));
    }
  }, [allProperties.length, setProperties]);

  return (
    <group>
      {allProperties.map((property) => (
        <Building key={property.id} property={property} />
      ))}
    </group>
  );
}
