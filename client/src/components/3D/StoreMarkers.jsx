import { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import axios from 'axios';

export default function StoreMarkers() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const res = await axios.get('/api/stores');
      setStores(res.data);
    } catch (error) {
      console.error('Failed to load stores:', error);
    }
  };

  return (
    <>
      {stores.map((store) => (
        <group key={store._id} position={[store.coordinates.x, 3, store.coordinates.z]}>
          <mesh>
            <boxGeometry args={[2, 4, 2]} />
            <meshStandardMaterial
              color={
                store.storeType === 'food' ? '#10b981' :
                store.storeType === 'clothing' ? '#8b5cf6' :
                store.storeType === 'pet' ? '#f472b6' :
                store.storeType === 'car-dealership' ? '#3b82f6' :
                '#f59e0b'
              }
              emissive={
                store.storeType === 'food' ? '#10b981' :
                store.storeType === 'clothing' ? '#8b5cf6' :
                store.storeType === 'pet' ? '#f472b6' :
                store.storeType === 'car-dealership' ? '#3b82f6' :
                '#f59e0b'
              }
              emissiveIntensity={0.3}
            />
          </mesh>
          <Html center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {store.name}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}
