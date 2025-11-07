import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../../store/useStore';
import io from 'socket.io-client';

function OtherPlayer({ id, position, rotation }) {
  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial color="#764ba2" />
      </mesh>
      {/* Name tag */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function MultiplayerManager() {
  const socketRef = useRef();
  const { position, otherPlayers, setOtherPlayers } = useStore();
  const lastUpdateTime = useRef(0);

  useEffect(() => {
    // Connect to server
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    socketRef.current = io(serverUrl);

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('playerUpdate', (data) => {
      setOtherPlayers((prev) => ({
        ...prev,
        [data.id]: { position: data.position, rotation: data.rotation },
      }));
    });

    socketRef.current.on('playerDisconnected', (id) => {
      setOtherPlayers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [setOtherPlayers]);

  useFrame(({ clock }) => {
    // Send position updates every 100ms
    const now = clock.elapsedTime;
    if (socketRef.current && now - lastUpdateTime.current > 0.1) {
      socketRef.current.emit('positionUpdate', { position });
      lastUpdateTime.current = now;
    }
  });

  return (
    <group>
      {Object.entries(otherPlayers).map(([id, player]) => (
        <OtherPlayer key={id} id={id} {...player} />
      ))}
    </group>
  );
}

export default MultiplayerManager;
