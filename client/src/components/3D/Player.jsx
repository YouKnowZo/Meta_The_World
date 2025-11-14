import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Capsule } from '@react-three/drei';
import { useSphere } from '@react-three/cannon';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

export default function Player() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0]
  }));

  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboardControls();

  useFrame(() => {
    const velocity = [0, 0, 0];
    
    if (moveForward) velocity[2] -= 0.1;
    if (moveBackward) velocity[2] += 0.1;
    if (moveLeft) velocity[0] -= 0.1;
    if (moveRight) velocity[0] += 0.1;
    
    api.velocity.set(velocity[0], 0, velocity[2]);
    
    if (jump) {
      api.velocity.set(0, 5, 0);
    }
  });

  return (
    <Capsule ref={ref} args={[0.5, 1.5]} position={[0, 1, 0]}>
      <meshStandardMaterial color="#8b5cf6" />
    </Capsule>
  );
}
