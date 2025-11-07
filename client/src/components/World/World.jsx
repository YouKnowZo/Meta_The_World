import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import Terrain from './Terrain';
import Buildings from './Buildings';
import Water from './Water';
import Trees from './Trees';

function World() {
  const cloudRef = useRef();

  // Animate clouds
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 20;
      cloudRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.1) * 20;
    }
  });

  return (
    <>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
      />

      {/* Stars for night effect */}
      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={7}
        saturation={0}
        fade
      />

      {/* Clouds */}
      <group ref={cloudRef}>
        <Cloud
          position={[10, 15, -20]}
          speed={0.2}
          opacity={0.5}
          segments={20}
        />
        <Cloud
          position={[-15, 12, -10]}
          speed={0.15}
          opacity={0.4}
          segments={15}
        />
      </group>

      {/* Fog */}
      <fog attach="fog" args={['#87ceeb', 50, 200]} />

      {/* Terrain */}
      <Terrain />

      {/* Water */}
      <Water />

      {/* Buildings */}
      <Buildings />

      {/* Trees and vegetation */}
      <Trees />
    </>
  );
}

export default World;
