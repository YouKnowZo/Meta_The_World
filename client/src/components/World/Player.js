import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Capsule } from '@react-three/drei';
import * as THREE from 'three';

const Player = ({ socket }) => {
  const playerRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          direction.current.z = -1;
          break;
        case 's':
          direction.current.z = 1;
          break;
        case 'a':
          direction.current.x = -1;
          break;
        case 'd':
          direction.current.x = 1;
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
        case 's':
          direction.current.z = 0;
          break;
        case 'a':
        case 'd':
          direction.current.x = 0;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const speed = 10;
    velocity.current.x = direction.current.x * speed;
    velocity.current.z = direction.current.z * speed;

    playerRef.current.position.x += velocity.current.x * delta;
    playerRef.current.position.z += velocity.current.z * delta;

    // Emit position to server
    if (socket) {
      socket.emit('player-move', {
        position: playerRef.current.position,
        rotation: playerRef.current.rotation
      });
    }
  });

  return (
    <group ref={playerRef} position={[0, 2, 0]}>
      <Capsule args={[0.5, 1.5]} castShadow>
        <meshStandardMaterial color="#4a90e2" />
      </Capsule>
    </group>
  );
};

export default Player;
