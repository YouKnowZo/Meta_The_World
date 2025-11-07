import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { ArrowBack, Edit, Terrain, ShoppingBag } from '@mui/icons-material';
import useStore from '../store/useStore';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const { userWallet } = useStore();
  const [tabValue, setTabValue] = useState(0);
  const [ownedLands, setOwnedLands] = useState([]);
  const [listedLands, setListedLands] = useState([]);

  useEffect(() => {
    if (!userWallet) {
      navigate('/');
      return;
    }

    // Mock data for owned lands
    const mockOwnedLands = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      tokenId: i + 100,
      name: `My Land #${i + 1}`,
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
      z: 0,
      size: 100 + Math.floor(Math.random() * 400),
      landType: ['grass', 'sand', 'stone', 'forest'][Math.floor(Math.random() * 4)],
      purchaseDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    }));
    setOwnedLands(mockOwnedLands);

    // Mock data for listed lands
    const mockListedLands = Array.from({ length: 2 }, (_, i) => ({
      id: i,
      tokenId: i + 200,
      name: `Listed Land #${i + 1}`,
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
      z: 0,
      size: 100 + Math.floor(Math.random() * 400),
      landType: ['grass', 'sand', 'stone', 'forest'][Math.floor(Math.random() * 4)],
      price: (0.5 + Math.random() * 2).toFixed(2),
      listingDate: new Date(Date.now() - Math.random() * 5000000000).toLocaleDateString(),
    }));
    setListedLands(mockListedLands);
  }, [userWallet, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            My Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {userWallet ? userWallet[2].toUpperCase() : '?'}
            </Avatar>
            <Box sx={{ ml: 3, flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                My Account
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {userWallet}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="h6">{ownedLands.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lands Owned
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6">{listedLands.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Listings
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton>
              <Edit />
            </IconButton>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab icon={<Terrain />} label="Owned Lands" iconPosition="start" />
            <Tab icon={<ShoppingBag />} label="Listed Lands" iconPosition="start" />
          </Tabs>
        </Box>

        {/* Owned Lands Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {ownedLands.map((land) => (
              <Grid item xs={12} sm={6} md={4} key={land.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {land.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Type: {land.landType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Size: {land.size} m²
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Coordinates: ({land.x}, {land.y}, {land.z})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Purchased: {land.purchaseDate}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button variant="outlined" size="small" fullWidth>
                        Visit
                      </Button>
                      <Button variant="contained" size="small" fullWidth>
                        List for Sale
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Listed Lands Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {listedLands.map((land) => (
              <Grid item xs={12} sm={6} md={4} key={land.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {land.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Type: {land.landType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Size: {land.size} m²
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Listed: {land.listingDate}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      {land.price} ETH
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button variant="outlined" size="small" fullWidth>
                        Update Price
                      </Button>
                      <Button variant="contained" size="small" fullWidth color="error">
                        Cancel Listing
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
}

export default Profile;
