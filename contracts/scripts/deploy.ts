import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const MetaTheWorldLand = await ethers.getContractFactory("MetaTheWorldLand");
  const landContract = await MetaTheWorldLand.deploy(deployer.address);

  await landContract.waitForDeployment();
  const address = await landContract.getAddress();

  console.log("MetaTheWorldLand deployed to:", address);
  console.log("Deployment transaction hash:", landContract.deploymentTransaction()?.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
