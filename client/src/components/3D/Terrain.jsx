import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlane } from '@react-three/cannon';
import { MeshStandardMaterial } from 'three';

export default function Terrain() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    args: [1000, 1000]
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial
        color="#4ade80"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}
