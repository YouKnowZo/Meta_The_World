interface LightingProps {
  timeOfDay: number;
}

export function Lighting({ timeOfDay }: LightingProps) {
  // Calculate lighting based on time of day (0-24)
  const isDaytime = timeOfDay >= 6 && timeOfDay < 18;
  const intensity = isDaytime ? 1.5 : 0.3;
  const ambientIntensity = isDaytime ? 0.8 : 0.2;

  // Sun position calculation
  const sunAngle = ((timeOfDay - 6) / 12) * Math.PI;
  const sunX = Math.cos(sunAngle) * 100;
  const sunY = Math.sin(sunAngle) * 100;

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={ambientIntensity} color={isDaytime ? '#ffffff' : '#4169e1'} />
      
      {/* Main sun/moon light */}
      <directionalLight
        position={[sunX, Math.abs(sunY) + 50, 50]}
        intensity={intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        color={isDaytime ? '#fff9e6' : '#b0c4de'}
      />

      {/* Fill light for softer shadows */}
      <directionalLight
        position={[-50, 30, -50]}
        intensity={0.3}
        color="#87ceeb"
      />

      {/* Hemisphere light for realistic sky-ground color variation */}
      <hemisphereLight
        args={[isDaytime ? '#87ceeb' : '#191970', '#8d6e63', 0.6]}
      />

      {/* Street lights at night */}
      {!isDaytime && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <pointLight
              key={i}
              position={[i * 50 - 250, 5, 0]}
              intensity={2}
              distance={30}
              color="#ffd700"
            />
          ))}
        </>
      )}
    </>
  );
}
