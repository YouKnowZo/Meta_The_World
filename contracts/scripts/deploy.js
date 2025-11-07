import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Meta The World contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy MetaWorldLand NFT contract
  console.log("\nDeploying MetaWorldLand...");
  const MetaWorldLand = await ethers.getContractFactory("MetaWorldLand");
  const landNFT = await MetaWorldLand.deploy();
  await landNFT.waitForDeployment();
  const landNFTAddress = await landNFT.getAddress();
  console.log("MetaWorldLand deployed to:", landNFTAddress);

  // Deploy MetaWorldMarketplace contract
  console.log("\nDeploying MetaWorldMarketplace...");
  const MetaWorldMarketplace = await ethers.getContractFactory("MetaWorldMarketplace");
  const marketplace = await MetaWorldMarketplace.deploy(landNFTAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("MetaWorldMarketplace deployed to:", marketplaceAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("MetaWorldLand NFT:", landNFTAddress);
  console.log("MetaWorldMarketplace:", marketplaceAddress);
  console.log("\nAdd these addresses to your .env file:");
  console.log(`LAND_NFT_CONTRACT_ADDRESS=${landNFTAddress}`);
  console.log(`MARKETPLACE_CONTRACT_ADDRESS=${marketplaceAddress}`);

  // Verify contracts if on a public network
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await landNFT.deploymentTransaction().wait(6);
    await marketplace.deploymentTransaction().wait(6);

    console.log("\nVerifying contracts on Etherscan...");
    try {
      await run("verify:verify", {
        address: landNFTAddress,
        constructorArguments: [],
      });
      console.log("MetaWorldLand verified!");
    } catch (error) {
      console.log("Error verifying MetaWorldLand:", error.message);
    }

    try {
      await run("verify:verify", {
        address: marketplaceAddress,
        constructorArguments: [landNFTAddress],
      });
      console.log("MetaWorldMarketplace verified!");
    } catch (error) {
      console.log("Error verifying MetaWorldMarketplace:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
