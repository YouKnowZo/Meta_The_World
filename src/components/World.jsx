import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, PerspectiveCamera, Text, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import PropertyMarker from './PropertyMarker';
import UI from './UI';
import './World.css';

function World() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [worldStats, setWorldStats] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    fetchProperties();
    fetchWorldStats();
    
    // Set up real-time updates via polling (can be upgraded to WebSocket)
    const interval = setInterval(() => {
      fetchProperties();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchWorldStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/world/stats');
      setWorldStats(response.data);
    } catch (error) {
      console.error('Error fetching world stats:', error);
    }
  };

  return (
    <div className="world-container">
      <Canvas shadows>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />

          {/* Environment */}
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <Environment preset="sunset" />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#4a7c59" />
          </mesh>

          {/* Grid helper */}
          <gridHelper args={[1000, 100, '#666', '#333']} />

          {/* Properties */}
          {properties.map((property) => (
            <PropertyMarker
              key={property.id}
              property={property}
              onClick={() => {
                setSelectedProperty(property);
                navigate(`/property/${property.id}`);
              }}
            />
          ))}

          {/* Camera */}
          <PerspectiveCamera makeDefault position={[50, 50, 50]} fov={75} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={500}
          />
        </Suspense>
      </Canvas>

      <UI
        worldStats={worldStats}
        onNavigateToDashboard={() => navigate('/dashboard')}
        onNavigateToAgent={() => navigate('/agent')}
      />

      {selectedProperty && (
        <div className="property-popup">
          <h3>{selectedProperty.title}</h3>
          <p>{selectedProperty.description}</p>
          <p>Price: {selectedProperty.price} MTC</p>
          <button onClick={() => navigate(`/property/${selectedProperty.id}`)}>
            View Details
          </button>
          <button onClick={() => setSelectedProperty(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default World;
