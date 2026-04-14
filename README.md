# Meta The World

> A hyper-realistic digital twin metaverse with NFT-based land ownership — where the physical world and the digital universe converge.

---

## Overview

**Meta The World** is an open, persistent, and geospatially accurate digital twin of Earth. It fuses photorealistic real-world data (LiDAR, satellite imagery, and GIS) with Unreal Engine 5 rendering, letting users own, build on, and monetise parcels of virtual land represented as NFTs on an EVM-compatible blockchain.

The platform is built around three core pillars:

| Pillar | Description |
|---|---|
| 🌍 **Hyper-Realism** | Nanite geometry, Lumen global illumination, and real-world GIS/LiDAR data produce a 1:1 replica of Earth at cinematic fidelity. |
| 🔗 **Digital Twin** | Live feeds from IoT sensors, weather APIs, and urban datasets keep the virtual world continuously synchronised with its physical counterpart. |
| 🏛️ **Blockchain Ownership** | Every land parcel is a unique ERC-721 NFT on Polygon, providing transparent, permissionless, and interoperable ownership. |
| 🌉 **UE6 Bridge** | High-performance gRPC/WebSocket synchronization layer for real-time spatial state and "Phygital" events. |

---

## Core Features

- **Geospatial Land Registry** — Parcel boundaries derived from real-world coordinates (WGS-84), minted as on-chain NFTs.
- **Spatial Data Streaming** — Adaptive LOD pipeline powered by Cesium for Unreal and OpenStreetMap tiles.
- **AR/VR Interface** — Native support for Meta Quest, Apple Vision Pro, HoloLens 2, and desktop VR headsets.
- **User-Generated Content** — In-world building tools with asset marketplace and royalty engine.
- **Real-Time IoT Sync** — Weather, traffic, and environmental sensor data reflected in the live world state.
- **Economic Layer** — Decentralised land marketplace, rental contracts, and governance via DAO.

---

## Getting Started

> The project is currently in the **Genesis** phase. Infrastructure and smart contracts are under active development. See the [Roadmap](ROADMAP.md) for progress details.

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Unreal Engine 5 | 5.3 |
| Node.js | 20 LTS |
| Go | 1.22 |
| PostgreSQL + PostGIS | 15 / 3.3 |
| Foundry (Solidity) | latest |

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YouKnowZo/Meta_The_World.git
cd Meta_The_World

# Install backend dependencies
cd services && npm install

# Install frontend dependencies
cd ../apps/web && npm install

# Copy environment template
cd ../..
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local

# Start local development stack (Docker required)
docker compose up -d

# Deploy contracts to local Hardhat node
cd contracts && npx hardhat node &
npx hardhat run scripts/deploy.ts --network localhost
```

Full setup instructions will be added to `docs/SETUP.md` as each phase completes.

---

## Documentation

| Document | Description |
|---|---|
| [SPEC.md](SPEC.md) | Full technical specification — architecture, components, data models, and APIs |
| [ROADMAP.md](ROADMAP.md) | Phased development roadmap with milestones and deliverables |

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                      │
│        UE5 Desktop · VR Headsets · AR Mobile         │
└───────────────────────┬─────────────────────────────┘
                        │ WebSocket / gRPC
┌───────────────────────▼─────────────────────────────┐
│                  World Engine (UE5)                  │
│      Nanite · Lumen · Cesium · Chaos Physics         │
└──────────┬────────────────────────┬─────────────────┘
           │ REST / GraphQL          │ Event Stream
┌──────────▼──────────┐  ┌──────────▼──────────────── ┐
│   Spatial Services  │  │   Blockchain Layer          │
│  Node.js · PostGIS  │  │  Solidity · Polygon · IPFS  │
└──────────┬──────────┘  └────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────┐
│              Spatial Data Pipeline                   │
│   Cesium Ion · OSM · LiDAR · Satellite · IoT Feeds  │
└─────────────────────────────────────────────────────┘
```

---

## Contributing

Contributions are welcome once the Genesis phase scaffolding is in place. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[MIT](LICENSE)
