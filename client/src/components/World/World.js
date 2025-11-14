import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, PerspectiveCamera } from '@react-three/drei';
import { useAuthStore } from '../../store/authStore';
import { io } from 'socket.io-client';
import Terrain from './Terrain';
import Buildings from './Buildings';
import Player from './Player';
import UI from './UI';
import Properties from './Properties';
import './World.css';

const World = () => {
  const { user } = useAuthStore();
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket for multiplayer
    socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    
    if (user?.id) {
      socketRef.current.emit('join-world', user.id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  return (
    <div className="world-container">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 50, 100]} fov={75} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[100, 100, 50]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />
          
          <Terrain />
          <Buildings />
          <Properties />
          <Player socket={socketRef.current} />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={500}
          />
        </Suspense>
      </Canvas>
      <UI socket={socketRef.current} />
    </div>
  );
};

export default World;
