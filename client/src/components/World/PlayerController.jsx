import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';
import useStore from '../../store/useStore';

const MOVEMENT_SPEED = 0.1;
const ROTATION_SPEED = 0.05;

function PlayerController() {
  const { camera } = useThree();
  const { isPresenting } = useXR();
  const playerRef = useRef();
  const keysPressed = useRef({});
  const { position, setPosition } = useStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    // Skip keyboard controls in VR/AR mode
    if (isPresenting) return;

    const keys = keysPressed.current;
    const moveVector = new THREE.Vector3();

    // WASD movement
    if (keys['w']) moveVector.z -= MOVEMENT_SPEED;
    if (keys['s']) moveVector.z += MOVEMENT_SPEED;
    if (keys['a']) moveVector.x -= MOVEMENT_SPEED;
    if (keys['d']) moveVector.x += MOVEMENT_SPEED;

    // Apply camera rotation to movement
    moveVector.applyQuaternion(camera.quaternion);
    moveVector.y = 0; // Keep movement horizontal

    // Update camera position
    camera.position.add(moveVector);

    // Arrow keys for rotation
    if (keys['arrowleft']) {
      camera.rotation.y += ROTATION_SPEED;
    }
    if (keys['arrowright']) {
      camera.rotation.y -= ROTATION_SPEED;
    }

    // Space to jump (simple implementation)
    if (keys[' '] && camera.position.y <= 5) {
      camera.position.y += 0.2;
    } else if (camera.position.y > 5) {
      camera.position.y -= 0.1;
    }

    // Update store position
    setPosition({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    });
  });

  return (
    <group ref={playerRef}>
      {/* Player avatar representation (for multiplayer) */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial color="#667eea" />
      </mesh>
    </group>
  );
}

export default PlayerController;
