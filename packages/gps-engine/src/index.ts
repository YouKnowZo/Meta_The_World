import type { GPSLocation, ARMarker } from '@meta-the-world/core';

export class GPSEngine {
  private currentLocation: GPSLocation | null = null;
  private markers: Map<string, ARMarker> = new Map();
  private subscribers: Array<(location: GPSLocation) => void> = [];

  constructor() {
    this.startTracking();
  }

  private startTracking(): void {
    // This would be implemented differently for web vs React Native
    // For now, simulate GPS updates
    setInterval(() => {
      this.updateLocation({
        latitude: 40.7128 + (Math.random() - 0.5) * 0.001,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.001,
        timestamp: Date.now(),
        accuracy: 10
      });
    }, 5000);
  }

  private updateLocation(location: GPSLocation): void {
    this.currentLocation = location;
    this.subscribers.forEach(callback => callback(location));
  }

  getCurrentLocation(): GPSLocation | null {
    return this.currentLocation;
  }

  subscribe(callback: (location: GPSLocation) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  addMarker(marker: ARMarker): void {
    this.markers.set(marker.id, marker);
  }

  removeMarker(id: string): void {
    this.markers.delete(id);
  }

  getNearbyMarkers(radius: number = 500): ARMarker[] {
    if (!this.currentLocation) return [];
    
    return Array.from(this.markers.values()).filter(marker => {
      const distance = this.calculateDistance(this.currentLocation!, marker.position);
      return distance <= radius;
    });
  }

  private calculateDistance(pos1: GPSLocation, pos2: GPSLocation): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1.latitude * Math.PI/180;
    const φ2 = pos2.latitude * Math.PI/180;
    const Δφ = (pos2.latitude-pos1.latitude) * Math.PI/180;
    const Δλ = (pos2.longitude-pos1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
}

export const gpsEngine = new GPSEngine();