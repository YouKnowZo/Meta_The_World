import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} sx={{ color: 'white' }} />
      <Typography variant="h6" sx={{ mt: 3, color: 'white' }}>
        Loading Meta The World...
      </Typography>
    </Box>
  );
}

export default LoadingScreen;
