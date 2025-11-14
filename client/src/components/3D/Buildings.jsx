import { useMemo } from 'react';
import { Box } from '@react-three/drei';

const Building = ({ position, size, color }) => (
  <Box position={position} args={size} castShadow receiveShadow>
    <meshStandardMaterial color={color} />
  </Box>
);

export default function Buildings() {
  const buildings = useMemo(() => {
    const b = [];
    for (let i = -50; i < 50; i += 20) {
      for (let j = -50; j < 50; j += 20) {
        if (Math.random() > 0.7) {
          b.push({
            position: [i, Math.random() * 10 + 5, j],
            size: [
              Math.random() * 8 + 4,
              Math.random() * 20 + 10,
              Math.random() * 8 + 4
            ],
            color: `hsl(${Math.random() * 60 + 180}, 50%, ${Math.random() * 30 + 40}%)`
          });
        }
      }
    }
    return b;
  }, []);

  return (
    <>
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}
    </>
  );
}
