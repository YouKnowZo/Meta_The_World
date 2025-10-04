"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gpsEngine = exports.GPSEngine = void 0;
class GPSEngine {
    constructor() {
        this.currentLocation = null;
        this.markers = new Map();
        this.subscribers = [];
        this.startTracking();
    }
    startTracking() {
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
    updateLocation(location) {
        this.currentLocation = location;
        this.subscribers.forEach(callback => callback(location));
    }
    getCurrentLocation() {
        return this.currentLocation;
    }
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }
    addMarker(marker) {
        this.markers.set(marker.id, marker);
    }
    removeMarker(id) {
        this.markers.delete(id);
    }
    getNearbyMarkers(radius = 500) {
        if (!this.currentLocation)
            return [];
        return Array.from(this.markers.values()).filter(marker => {
            const distance = this.calculateDistance(this.currentLocation, marker.position);
            return distance <= radius;
        });
    }
    calculateDistance(pos1, pos2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = pos1.latitude * Math.PI / 180;
        const φ2 = pos2.latitude * Math.PI / 180;
        const Δφ = (pos2.latitude - pos1.latitude) * Math.PI / 180;
        const Δλ = (pos2.longitude - pos1.longitude) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
exports.GPSEngine = GPSEngine;
exports.gpsEngine = new GPSEngine();
//# sourceMappingURL=index.js.map