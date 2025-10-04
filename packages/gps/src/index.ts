// GPS package - standalone implementation

// React hooks for GPS functionality
export function useGPSLocation() {
  // This would be implemented with proper React hooks
  // For now, returning a placeholder
  return {
    location: null,
    error: null,
    loading: true
  };
}

export function useNearbyLands(radius: number = 500) {
  // This would integrate with the LandRegistry
  return {
    lands: [],
    loading: false,
    error: null
  };
}