"use strict";
// GPS package - standalone implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGPSLocation = useGPSLocation;
exports.useNearbyLands = useNearbyLands;
// React hooks for GPS functionality
function useGPSLocation() {
    // This would be implemented with proper React hooks
    // For now, returning a placeholder
    return {
        location: null,
        error: null,
        loading: true
    };
}
function useNearbyLands(radius = 500) {
    // This would integrate with the LandRegistry
    return {
        lands: [],
        loading: false,
        error: null
    };
}
//# sourceMappingURL=index.js.map