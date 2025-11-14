import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Box, Text } from '@react-three/drei';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties?listed=true');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      {properties.map((property) => (
        <group
          key={property._id}
          position={[property.location.x, property.location.y, property.location.z]}
          onClick={() => handlePropertyClick(property._id)}
        >
          <Box
            args={[property.size.width, property.size.height, property.size.depth]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={property.listed ? '#ff6b6b' : '#51cf66'}
              opacity={0.7}
              transparent
            />
          </Box>
          {property.listed && (
            <Text
              position={[0, property.size.height / 2 + 2, 0]}
              fontSize={2}
              color="#fff"
              anchorX="center"
              anchorY="middle"
            >
              {property.name}
            </Text>
          )}
        </group>
      ))}
    </>
  );
};

export default Properties;
