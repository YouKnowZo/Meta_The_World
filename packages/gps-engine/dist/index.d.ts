interface GPSLocation {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
    timestamp?: number;
}
interface ARMarker {
    id: string;
    position: GPSLocation;
    content: any;
}
export declare class GPSEngine {
    private currentLocation;
    private markers;
    private subscribers;
    constructor();
    private startTracking;
    private updateLocation;
    getCurrentLocation(): GPSLocation | null;
    subscribe(callback: (location: GPSLocation) => void): () => void;
    addMarker(marker: ARMarker): void;
    removeMarker(id: string): void;
    getNearbyMarkers(radius?: number): ARMarker[];
    private calculateDistance;
}
export declare const gpsEngine: GPSEngine;
export {};
//# sourceMappingURL=index.d.ts.map