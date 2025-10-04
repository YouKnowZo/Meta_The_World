import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
}

interface UseGPSReturn {
  location: GPSLocation | null;
  error: string | null;
  loading: boolean;
}

export function useGPS(): UseGPSReturn {
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Meta The World needs location access for AR features',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const startLocationWatch = async () => {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const watchId = Geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || undefined,
          });
          setError(null);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 10,
        }
      );

      return () => {
        Geolocation.clearWatch(watchId);
      };
    };

    startLocationWatch();
  }, []);

  return { location, error, loading };
}
