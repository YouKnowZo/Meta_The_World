import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Button,
} from '@mui/material';
import {
  Home,
  ShoppingCart,
  AccountCircle,
  Explore,
  Logout,
  Wallet,
} from '@mui/icons-material';
import useStore from '../../store/useStore';
import { connectWallet } from '../../utils/web3';

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { userWallet, setUserWallet } = useStore();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Explore World', icon: <Explore />, path: '/world' },
    { text: 'Marketplace', icon: <ShoppingCart />, path: '/marketplace' },
    { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
  ];

  const handleConnect = async () => {
    try {
      const wallet = await connectWallet();
      setUserWallet(wallet);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 300,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Meta The World
        </Typography>

        {!userWallet ? (
          <Button
            variant="contained"
            fullWidth
            startIcon={<Wallet />}
            onClick={handleConnect}
            sx={{ mb: 2 }}
          >
            Connect Wallet
          </Button>
        ) : (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(102, 126, 234, 0.1)', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Connected
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {userWallet.slice(0, 6)}...{userWallet.slice(-4)}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {userWallet && (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setUserWallet(null)}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Disconnect" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Drawer>
  );
}

export default Sidebar;
