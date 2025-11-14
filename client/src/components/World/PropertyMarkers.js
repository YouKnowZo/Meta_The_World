import React, { useEffect, useState } from 'react';
import { Sphere, Text } from '@react-three/drei';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function PropertyMarker({ property, onClick }) {
  return (
    <group position={[property.location.x, property.location.y + 2, property.location.z]}>
      <Sphere args={[0.5, 16, 16]} onClick={onClick}>
        <meshStandardMaterial 
          color={property.isListed ? "#00ff00" : "#ff0000"} 
          emissive={property.isListed ? "#00ff00" : "#ff0000"}
          emissiveIntensity={0.5}
        />
      </Sphere>
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {property.name}
      </Text>
      {property.isListed && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="#fff"
          anchorX="center"
          anchorY="middle"
        >
          ${property.price.toLocaleString()}
        </Text>
      )}
    </group>
  );
}

function PropertyMarkers() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_URL}/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
    const interval = setInterval(fetchProperties, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePropertyClick = (property) => {
    window.location.href = `/marketplace?property=${property._id}`;
  };

  return (
    <>
      {properties.map((property) => (
        <PropertyMarker
          key={property._id}
          property={property}
          onClick={() => handlePropertyClick(property)}
        />
      ))}
    </>
  );
}

export default PropertyMarkers;
