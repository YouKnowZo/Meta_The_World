import { useMemo } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

export function Ground() {
  const terrain = useMemo(() => {
    const noise2D = createNoise2D();
    const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    const positions = geometry.attributes.position;

    // Create rolling hills with noise
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const noise = noise2D(x * 0.01, y * 0.01) * 3;
      positions.setZ(i, noise);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group>
      {/* Main terrain */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
        geometry={terrain}
      >
        <meshStandardMaterial
          color="#4a7c59"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 1000]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 1000]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[100, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 1000]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
      
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <planeGeometry args={[3, 1000]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.7} />
      </mesh>
    </group>
  );
}
