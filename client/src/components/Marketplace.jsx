import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import { ArrowBack, Search, Terrain } from '@mui/icons-material';
import useStore from '../store/useStore';

function Marketplace() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { userWallet } = useStore();

  // Mock data for demonstration
  useEffect(() => {
    const mockListings = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      tokenId: i + 1,
      name: `Land Parcel #${i + 1}`,
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
      z: 0,
      size: 100 + Math.floor(Math.random() * 400),
      landType: ['grass', 'sand', 'stone', 'forest'][Math.floor(Math.random() * 4)],
      price: (0.1 + Math.random() * 2).toFixed(2),
      image: `https://picsum.photos/seed/${i}/400/300`,
      seller: '0x' + Math.random().toString(16).substr(2, 40),
    }));
    setListings(mockListings);
  }, []);

  const filteredListings = listings.filter(
    (listing) =>
      listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.landType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Land Marketplace
          </Typography>
          {!userWallet && (
            <Button variant="contained" onClick={() => {}}>
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search by name or land type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={listing.image}
                  alt={listing.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {listing.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<Terrain />}
                      label={listing.landType}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${listing.size} m²`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Coordinates: ({listing.x}, {listing.y}, {listing.z})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {listing.price} ETH
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!userWallet}
                    >
                      Buy Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredListings.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No listings found
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Marketplace;
