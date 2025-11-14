import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Capsule } from '@react-three/drei';
import * as THREE from 'three';

function Avatar({ 
  position, 
  rotation, 
  onPositionChange, 
  onRotationChange, 
  userId, 
  username,
  isOtherUser = false 
}) {
  const meshRef = useRef();
  const { camera } = useThree();
  const keysRef = useRef({});

  useEffect(() => {
    if (isOtherUser) return;

    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOtherUser]);

  useFrame((state, delta) => {
    if (!meshRef.current || isOtherUser) {
      if (meshRef.current) {
        meshRef.current.position.set(...position);
        meshRef.current.rotation.set(...rotation);
      }
      return;
    }

    const speed = 5;
    const currentPos = meshRef.current.position.clone();
    let moved = false;

    if (keysRef.current['w'] || keysRef.current['arrowup']) {
      currentPos.z -= speed * delta;
      moved = true;
    }
    if (keysRef.current['s'] || keysRef.current['arrowdown']) {
      currentPos.z += speed * delta;
      moved = true;
    }
    if (keysRef.current['a'] || keysRef.current['arrowleft']) {
      currentPos.x -= speed * delta;
      moved = true;
    }
    if (keysRef.current['d'] || keysRef.current['arrowright']) {
      currentPos.x += speed * delta;
      moved = true;
    }

    if (moved) {
      meshRef.current.position.copy(currentPos);
      const newRotation = [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z];
      onPositionChange([currentPos.x, currentPos.y, currentPos.z]);
      onRotationChange(newRotation);
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      <Capsule args={[0.5, 1.5]} castShadow>
        <meshStandardMaterial color={isOtherUser ? "#4a90e2" : "#e24a4a"} />
      </Capsule>
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {username}
      </Text>
    </group>
  );
}

export default Avatar;
