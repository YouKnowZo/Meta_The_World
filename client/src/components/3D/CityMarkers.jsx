import { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import axios from 'axios';

export default function CityMarkers() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const res = await axios.get('/api/cities');
      setCities(res.data);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  return (
    <>
      {cities.map((city) => (
        <group key={city._id} position={[city.coordinates.centerX, 5, city.coordinates.centerZ]}>
          <mesh>
            <cylinderGeometry args={[city.coordinates.radius, city.coordinates.radius, 0.5, 32]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
          </mesh>
          <Html center>
            <div className="bg-blue-600/90 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
              {city.name}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}
