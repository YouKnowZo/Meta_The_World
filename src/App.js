import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorldView from './components/WorldView';
import LoginScreen from './components/LoginScreen';
import { useUserStore } from './stores/userStore';

function App() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <WorldView /> : <LoginScreen />} 
        />
        <Route path="/world" element={<WorldView />} />
      </Routes>
    </Router>
  );
}

export default App;
