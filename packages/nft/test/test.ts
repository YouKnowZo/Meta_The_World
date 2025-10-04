import { expect } from "chai";
import { ethers } from "hardhat";

describe("LandNFT", function () {
  it("Should mint and store land coordinates", async function () {
    const LandNFT = await ethers.getContractFactory("LandNFT");
    const landNFT = await LandNFT.deploy();
    await landNFT.waitForDeployment();
    await landNFT.mintLand(37477490, -122419400, "ipfs://Qm...");
    const land = await landNFT.lands(1);
    expect(land.lat).to.equal(37477490);
    expect(land.lng).to.equal(-122419400);
    expect(land.uri).to.equal("ipfs://Qm...");
  });
});
