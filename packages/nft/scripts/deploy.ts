import { ethers } from "hardhat";

async function main() {
  const LandNFT = await ethers.getContractFactory("LandNFT");
  const landNFT = await LandNFT.deploy();

  console.log("Deploying...");
  await landNFT.waitForDeployment();
  console.log("LandNFT deployed to:", await landNFT.getAddress());
}

main().catch(console.error);
