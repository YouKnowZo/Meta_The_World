import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import World from './components/World/World';
import Dashboard from './components/Dashboard/Dashboard';
import PropertyMarketplace from './components/Marketplace/PropertyMarketplace';
import AgentDashboard from './components/Agent/AgentDashboard';
import Navbar from './components/UI/Navbar';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/world" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/world" />} />
          <Route path="/world" element={isAuthenticated ? <World /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/marketplace" element={isAuthenticated ? <PropertyMarketplace /> : <Navigate to="/login" />} />
          <Route path="/agent" element={isAuthenticated ? <AgentDashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/world" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
