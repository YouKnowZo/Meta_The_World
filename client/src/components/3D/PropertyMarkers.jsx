import { useEffect, useState } from 'react';
import { useWorldStore } from '../../stores/worldStore';
import { Html } from '@react-three/drei';
import axios from 'axios';

export default function PropertyMarkers() {
  const { properties, selectProperty } = useWorldStore();
  const [hovered, setHovered] = useState(null);

  return (
    <>
      {properties.map((property) => (
        <group
          key={property._id}
          position={[property.coordinates.x, 2, property.coordinates.z]}
          onPointerOver={() => setHovered(property._id)}
          onPointerOut={() => setHovered(null)}
          onClick={() => selectProperty(property)}
        >
          <mesh>
            <boxGeometry args={[2, 4, 2]} />
            <meshStandardMaterial
              color={property.listed ? '#fbbf24' : '#10b981'}
              emissive={property.listed ? '#fbbf24' : '#10b981'}
              emissiveIntensity={hovered === property._id ? 0.5 : 0.2}
            />
          </mesh>
          {hovered === property._id && (
            <Html center>
              <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                {property.listed ? `$${property.price?.toLocaleString()}` : 'Owned'}
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  );
}
