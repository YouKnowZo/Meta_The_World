import { Canvas } from '@react-three/fiber';
import { Sky, Stars, Cloud, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { useGameStore } from '../store';
import { Ground } from './world/Ground';
import { Buildings } from './world/Buildings';
import { Avatar } from './world/Avatar';
import { Lighting } from './world/Lighting';

export function World3D() {
  const worldState = useGameStore((state) => state.worldState);
  
  // Calculate sun position based on time of day
  const sunInclination = ((worldState.timeOfDay / 24) * Math.PI * 2) - Math.PI / 2;
  const sunAzimuth = 0.25;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 50, 100], fov: 60 }}
      style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)' }}
    >
      <Suspense fallback={null}>
        {/* Sky and Atmosphere */}
        <Sky
          distance={450000}
          sunPosition={[
            Math.cos(sunInclination) * Math.cos(sunAzimuth),
            Math.sin(sunInclination),
            Math.cos(sunInclination) * Math.sin(sunAzimuth)
          ]}
          inclination={sunInclination}
          azimuth={sunAzimuth}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Clouds */}
        {worldState.weather === 'cloudy' && (
          <>
            <Cloud position={[-50, 30, -50]} speed={0.2} opacity={0.5} />
            <Cloud position={[50, 35, -30]} speed={0.3} opacity={0.4} />
            <Cloud position={[0, 40, 50]} speed={0.25} opacity={0.6} />
          </>
        )}

        {/* Lighting */}
        <Lighting timeOfDay={worldState.timeOfDay} />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Fog for atmosphere */}
        <fog attach="fog" args={['#e0f6ff', 100, 800]} />

        {/* World Objects */}
        <Ground />
        <Buildings />
        <Avatar />

        {/* Post Processing Effects */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} height={300} opacity={1.5} />
          <SSAO 
            radius={0.4} 
            intensity={50}
            worldDistanceThreshold={0.2}
            worldDistanceFalloff={0.1}
            worldProximityThreshold={0.01}
            worldProximityFalloff={0.005}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
