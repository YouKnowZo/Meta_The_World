import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import World from './components/World/World';
import Dashboard from './components/Dashboard/Dashboard';
import PropertyView from './components/Property/PropertyView';
import AgentDashboard from './components/Agent/AgentDashboard';
import './App.css';

function App() {
  const { user, token } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/world" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/world" />} />
          <Route path="/world" element={token ? <World /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/property/:id" element={token ? <PropertyView /> : <Navigate to="/login" />} />
          <Route path="/agent" element={token ? <AgentDashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/world" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
