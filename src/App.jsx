import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import World from './components/World';
import Dashboard from './components/Dashboard';
import PropertyView from './components/PropertyView';
import AgentDashboard from './components/AgentDashboard';
import './App.css';

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/world" />} />
        <Route path="/world" element={token ? <World /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/property/:id" element={token ? <PropertyView /> : <Navigate to="/login" />} />
        <Route path="/agent" element={token ? <AgentDashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/world" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
