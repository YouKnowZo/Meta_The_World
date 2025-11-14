import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import World from './components/World';
import Dashboard from './components/Dashboard';
import PropertyManager from './components/PropertyManager';
import AgentDashboard from './components/AgentDashboard';
import './App.css';

function App() {
  const { user, token, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={token ? <Navigate to="/world" /> : <Login />} 
          />
          <Route 
            path="/world" 
            element={token ? <World /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/properties" 
            element={token ? <PropertyManager /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/agent" 
            element={token && (user?.role === 'agent' || user?.role === 'admin') ? <AgentDashboard /> : <Navigate to="/world" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={token ? "/world" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
