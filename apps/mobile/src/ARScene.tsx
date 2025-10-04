import React from 'react';
import { useAR, ARView } from 'react-native-ar';
import { useGPS } from './hooks/useGPS';
import { ThreeDModel } from './components/ThreeDModel';

export default function ARScene() {
  const { location, loading, error } = useGPS();

  if (loading) {
    return (
      <ARView style={{ flex: 1 }}>
        {/* Loading state - could show a loading indicator */}
      </ARView>
    );
  }

  if (error || !location) {
    return (
      <ARView style={{ flex: 1 }}>
        {/* Error state - could show error message */}
      </ARView>
    );
  }

  return (
    <ARView style={{ flex: 1 }}>
      <ThreeDModel lat={location.latitude} lng={location.longitude} />
    </ARView>
  );
}
