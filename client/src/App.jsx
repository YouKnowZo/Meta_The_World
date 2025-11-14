import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './components/Login';
import World from './components/World';
import HUD from './components/HUD';
import WalletConnect from './components/WalletConnect';
import './App.css';

function App() {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<World />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <HUD />
      <WalletConnect />
    </BrowserRouter>
  );
}

export default App;
