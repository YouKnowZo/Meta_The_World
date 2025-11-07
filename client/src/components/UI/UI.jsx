import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import useStore from '../../store/useStore';

function UI() {
  const { position, userWallet } = useStore();

  return (
    <>
      {/* Position indicator */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          p: 2,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          zIndex: 100,
        }}
      >
        <Typography variant="body2">
          Position: X: {position.x.toFixed(1)}, Y: {position.y.toFixed(1)}, Z: {position.z.toFixed(1)}
        </Typography>
      </Paper>

      {/* Wallet indicator */}
      {userWallet && (
        <Paper
          sx={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            p: 1.5,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            zIndex: 100,
          }}
        >
          <Typography variant="body2">
            {userWallet.slice(0, 6)}...{userWallet.slice(-4)}
          </Typography>
        </Paper>
      )}

      {/* Controls hint */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          p: 2,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          zIndex: 100,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Controls:
        </Typography>
        <Typography variant="caption" component="div">
          WASD - Move
        </Typography>
        <Typography variant="caption" component="div">
          Arrow Keys - Look
        </Typography>
        <Typography variant="caption" component="div">
          Space - Jump
        </Typography>
      </Paper>
    </>
  );
}

export default UI;
