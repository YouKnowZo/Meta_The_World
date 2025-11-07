import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, ARButton, XR, Controllers, Hands } from '@react-three/xr';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import World from './World/World';
import PlayerController from './World/PlayerController';
import MultiplayerManager from './World/MultiplayerManager';
import UI from './UI/UI';
import Sidebar from './UI/Sidebar';
import LoadingScreen from './LoadingScreen';

function MetaWorld() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* VR/AR Buttons */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, display: 'flex', gap: 2 }}>
        <VRButton />
        <ARButton />
      </Box>

      {/* Menu Button */}
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* UI Overlay */}
      <UI />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
      >
        <XR>
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <hemisphereLight args={['#87ceeb', '#8b4513', 0.6]} />

            {/* World Environment */}
            <World />

            {/* Player Controller */}
            <PlayerController />

            {/* Multiplayer */}
            <MultiplayerManager />

            {/* VR/AR Controllers */}
            <Controllers />
            <Hands />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}

export default MetaWorld;
