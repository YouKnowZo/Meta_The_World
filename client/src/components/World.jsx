import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Terrain from './3D/Terrain';
import Buildings from './3D/Buildings';
import Player from './3D/Player';
import PropertyMarkers from './3D/PropertyMarkers';
import { useWorldStore } from '../stores/worldStore';
import { socket } from '../utils/socket';

export default function World() {
  const { loadProperties } = useWorldStore();

  useEffect(() => {
    loadProperties();
    socket.connect();
    socket.emit('join-world', 'user-id');
    
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-screen h-screen">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 50, 100]} fov={75} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />
          
          <Physics gravity={[0, -9.81, 0]}>
            <Terrain />
            <Buildings />
            <Player />
            <PropertyMarkers />
          </Physics>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={500}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
