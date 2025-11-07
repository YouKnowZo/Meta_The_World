import React, { useMemo } from 'react';
import * as THREE from 'three';

function Terrain() {
  // Generate heightmap for terrain
  const geometry = useMemo(() => {
    const width = 200;
    const height = 200;
    const widthSegments = 100;
    const heightSegments = 100;

    const geo = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );

    // Apply perlin-like noise for terrain height
    const vertices = geo.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Simple height variation
      vertices[i + 2] = 
        Math.sin(x * 0.05) * 2 +
        Math.cos(y * 0.05) * 2 +
        Math.sin(x * 0.1) * Math.cos(y * 0.1) * 1.5;
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // Terrain material with grass texture
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4a7c59',
      roughness: 0.9,
      metalness: 0.1,
      flatShading: false,
    });
  }, []);

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
    </mesh>
  );
}

export default Terrain;
