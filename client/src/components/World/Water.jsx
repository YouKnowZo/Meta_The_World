import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Water() {
  const waterRef = useRef();

  // Animate water
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  // Custom water shader
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#1e90ff') },
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Wave animation
        float elevation = sin(pos.x * 0.5 + time * 0.5) * 0.3;
        elevation += sin(pos.y * 0.7 + time * 0.4) * 0.2;
        pos.z += elevation;
        
        vElevation = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vec3 finalColor = color + vElevation * 0.2;
        gl_FragColor = vec4(finalColor, 0.7);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });

  return (
    <mesh
      ref={waterRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      material={waterMaterial}
    >
      <planeGeometry args={[200, 200, 100, 100]} />
    </mesh>
  );
}

export default Water;
