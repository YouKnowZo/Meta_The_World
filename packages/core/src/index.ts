// Entry point for shared types and utilities
export * from '../types';

// Core utilities
export class GPSUtils {
  static calculateDistance(pos1: GPSLocation, pos2: GPSLocation): number {
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

  static isNearby(pos1: GPSLocation, pos2: GPSLocation, maxDistance: number = 100): boolean {
    return this.calculateDistance(pos1, pos2) <= maxDistance;
  }
}

export class LandRegistry {
  private lands: Map<number, LandNFT> = new Map();

  addLand(land: LandNFT): void {
    this.lands.set(land.tokenId, land);
  }

  getLand(tokenId: number): LandNFT | undefined {
    return this.lands.get(tokenId);
  }

  getNearbyLands(position: GPSLocation, radius: number = 500): LandNFT[] {
    return Array.from(this.lands.values()).filter(land => 
      GPSUtils.isNearby(position, { latitude: land.latitude, longitude: land.longitude }, radius)
    );
  }

  getAllLands(): LandNFT[] {
    return Array.from(this.lands.values());
  }
}

import type { GPSLocation, LandNFT } from '../types';
