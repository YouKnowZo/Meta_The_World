import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Explore,
  ShoppingCart,
  AccountCircle,
  ViewInAr,
  Terrain,
  People,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ViewInAr sx={{ fontSize: 48 }} />,
      title: 'Immersive VR/AR',
      description: 'Experience a fully immersive metaverse with WebXR support for VR and AR devices.',
    },
    {
      icon: <Terrain sx={{ fontSize: 48 }} />,
      title: 'Own Virtual Land',
      description: 'Purchase and own NFT land parcels. Build, create, and monetize your virtual property.',
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 48 }} />,
      title: 'NFT Marketplace',
      description: 'Buy, sell, and trade virtual land parcels in our decentralized marketplace.',
    },
    {
      icon: <People sx={{ fontSize: 48 }} />,
      title: 'Social Metaverse',
      description: 'Meet friends, attend events, and explore the world together in real-time.',
    },
    {
      icon: <Explore sx={{ fontSize: 48 }} />,
      title: 'Infinite Worlds',
      description: 'Explore vast landscapes, from floating islands to underwater cities.',
    },
    {
      icon: <AccountCircle sx={{ fontSize: 48 }} />,
      title: 'Custom Avatars',
      description: 'Create and customize your unique avatar to represent yourself.',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              color: 'white',
              mb: 2,
            }}
          >
            Meta The World
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            The Next Generation AR/VR Metaverse with NFT Land Ownership
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/world')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Enter the Metaverse
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/marketplace')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Explore Marketplace
            </Button>
          </Box>
        </MotionBox>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', color: 'white', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          sx={{
            mt: 8,
            p: 6,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                10K+
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Land Parcels
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                5K+
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Active Users
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                $2M+
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Trading Volume
              </Typography>
            </Grid>
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default LandingPage;
