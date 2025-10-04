// Shared types for META THE WORLD

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LandNFT {
  tokenId: number;
  latitude: number;
  longitude: number;
  owner: string;
  uri: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

export interface ARMarker {
  id: string;
  position: GPSLocation;
  type: 'land' | 'building' | 'poi';
  data: any;
}

export interface Web3Config {
  rpcUrl: string;
  contractAddress: string;
  networkId: number;
}

export type NFTAsset = LandNFT;
