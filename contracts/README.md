# Meta The World - Smart Contracts

Solidity smart contracts for NFT land ownership and marketplace.

## Contracts

### MetaWorldLand.sol
ERC-721 NFT contract for virtual land parcels.

**Features:**
- 3D coordinate-based land allocation
- Batch minting support
- Metadata management
- Coordinate uniqueness verification
- Owner-only functions (price, withdraw)

### MetaWorldMarketplace.sol
Decentralized marketplace for trading land NFTs.

**Features:**
- List lands for sale
- Buy listed lands
- Update prices
- Cancel listings
- Marketplace fees (2.5% default)

## Tech Stack

- **Solidity 0.8.20**
- **Hardhat** - Development environment
- **OpenZeppelin** - Contract library
- **Ethers.js** - Ethereum library
- **Chai** - Testing framework

## Getting Started

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node  # Terminal 1
npx hardhat run scripts/deploy.js --network localhost  # Terminal 2

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## Configuration

### hardhat.config.js

```javascript
networks: {
  hardhat: {},
  sepolia: {
    url: "https://sepolia.infura.io/v3/YOUR_KEY",
    accounts: ["YOUR_PRIVATE_KEY"]
  },
  mainnet: {
    url: "https://mainnet.infura.io/v3/YOUR_KEY",
    accounts: ["YOUR_PRIVATE_KEY"]
  }
}
```

### Environment Variables

```env
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Contract Addresses

After deployment, update these addresses in your frontend:

### Mainnet
```
MetaWorldLand: TBD
MetaWorldMarketplace: TBD
```

### Sepolia Testnet
```
MetaWorldLand: TBD
MetaWorldMarketplace: TBD
```

## Usage Examples

### Minting Land

```javascript
const landNFT = await ethers.getContractAt("MetaWorldLand", address);
await landNFT.mintLand(
  10, 20, 0,  // x, y, z coordinates
  100,        // size
  "grass",    // land type
  "ipfs://...", // metadata URI
  { value: ethers.parseEther("0.1") }
);
```

### Batch Minting

```javascript
await landNFT.batchMintLand(
  [0, 1, 2],           // x coordinates
  [0, 0, 0],           // y coordinates
  [0, 0, 0],           // z coordinates
  [100, 100, 100],     // sizes
  ["grass", "sand", "stone"],
  ["ipfs://1", "ipfs://2", "ipfs://3"],
  { value: ethers.parseEther("0.3") }
);
```

### Listing on Marketplace

```javascript
const marketplace = await ethers.getContractAt("MetaWorldMarketplace", address);

// Approve marketplace
await landNFT.approve(marketplace.address, tokenId);

// List for sale
await marketplace.listItem(tokenId, ethers.parseEther("1.0"));
```

### Buying Land

```javascript
await marketplace.buyItem(tokenId, {
  value: ethers.parseEther("1.0")
});
```

## Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/MetaWorldLand.test.js
```

## Security

- OpenZeppelin contracts for security
- Reentrancy guards on marketplace
- Owner-only functions protected
- Coordinate uniqueness enforced
- Payment validation

## Gas Optimization

- Efficient storage usage
- Batch operations supported
- Optimized loops
- Minimal external calls

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## License

MIT
