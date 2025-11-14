import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, PerspectiveCamera, Text } from '@react-three/drei';
// Physics temporarily disabled - requires @react-three/cannon setup
// import { Physics } from '@react-three/cannon';
import Terrain from './Terrain';
import Buildings from './Buildings';
import Avatar from './Avatar';
import PropertyMarkers from './PropertyMarkers';
import { useAuthStore } from '../../store/authStore';
import { io } from 'socket.io-client';
import './World.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function World() {
  const { user, token } = useAuthStore();
  const socketRef = useRef(null);
  const [otherUsers, setOtherUsers] = React.useState([]);
  const [position, setPosition] = React.useState([0, 5, 0]);
  const [rotation, setRotation] = React.useState([0, 0, 0]);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(API_URL);
    socketRef.current.emit('join-world', user.id);

    socketRef.current.on('user-joined', (data) => {
      console.log('User joined:', data);
    });

    socketRef.current.on('user-left', (data) => {
      setOtherUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    socketRef.current.on('user-moved', (data) => {
      setOtherUsers((prev) => {
        const existing = prev.findIndex((u) => u.userId === data.userId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], ...data };
          return updated;
        }
        return [...prev, data];
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, user]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit('update-position', {
        position,
        rotation
      });
    }
  }, [position, rotation]);

  return (
    <div className="world-container">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 20, 20]} fov={75} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />
          
          <Terrain />
          <Buildings />
          <Avatar
            position={position}
            rotation={rotation}
            onPositionChange={setPosition}
            onRotationChange={setRotation}
            userId={user.id}
            username={user.username}
          />
          {otherUsers.map((otherUser) => (
            <Avatar
              key={otherUser.userId}
              position={otherUser.position || [0, 5, 0]}
              rotation={otherUser.rotation || [0, 0, 0]}
              userId={otherUser.userId}
              username={otherUser.username || 'User'}
              isOtherUser
            />
          ))}
          
          <PropertyMarkers />
          
          <OrbitControls
            target={position}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Suspense>
      </Canvas>
      
      <div className="world-ui">
        <div className="world-info">
          <h3>Welcome, {user.username}!</h3>
          <p>Virtual Currency: ${user.virtualCurrency?.toLocaleString() || 0}</p>
          {user.isAgent && (
            <div className="agent-badge">
              <span>🏠 Agent</span>
              <span>Earnings: ${user.totalEarnings?.toLocaleString() || 0}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default World;
