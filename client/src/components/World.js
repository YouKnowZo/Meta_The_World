import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, PerspectiveCamera, Text, Html } from '@react-three/drei';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyMarker from './PropertyMarker';
import UI from './UI';
import './World.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function World() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showUI, setShowUI] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  return (
    <div className="world-container">
      <Canvas shadows className="world-canvas">
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={75} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <Environment preset="sunset" />
        <Sky sunPosition={[100, 20, 100]} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#4a7c59" />
        </mesh>

        {/* Grid helper */}
        <gridHelper args={[200, 200, '#888', '#444']} />

        {/* City buildings */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 150;
          const z = (Math.random() - 0.5) * 150;
          const height = Math.random() * 10 + 5;
          const width = Math.random() * 3 + 2;
          const depth = Math.random() * 3 + 2;
          
          return (
            <mesh
              key={i}
              position={[x, height / 2, z]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial 
                color={`hsl(${Math.random() * 60 + 180}, 30%, ${Math.random() * 20 + 50}%)`}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
          );
        })}

        {/* Trees and nature */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 150;
          const z = (Math.random() - 0.5) * 150;
          
          return (
            <group key={`tree-${i}`} position={[x, 0, z]}>
              <mesh position={[0, 1, 0]} castShadow>
                <coneGeometry args={[1, 3, 8]} />
                <meshStandardMaterial color="#2d5016" />
              </mesh>
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 1]} />
                <meshStandardMaterial color="#5a3d2b" />
              </mesh>
            </group>
          );
        })}

        {/* Property markers */}
        {properties.map((property) => (
          <PropertyMarker
            key={property.id}
            property={property}
            onSelect={() => setSelectedProperty(property)}
            isSelected={selectedProperty?.id === property.id}
          />
        ))}

        {/* Welcome text */}
        <Text
          position={[0, 15, 0]}
          fontSize={2}
          color="#fff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000"
        >
          Meta The World
        </Text>
      </Canvas>

      {showUI && (
        <UI
          user={user}
          properties={properties}
          selectedProperty={selectedProperty}
          onPropertySelect={setSelectedProperty}
          onNavigate={navigate}
          onRefresh={fetchProperties}
        />
      )}

      <button 
        className="ui-toggle"
        onClick={() => setShowUI(!showUI)}
        title={showUI ? 'Hide UI' : 'Show UI'}
      >
        {showUI ? '◄' : '►'}
      </button>
    </div>
  );
}

export default World;
