import { expect } from "chai";
import { ethers } from "hardhat";

describe("MetaTheWorldLand", function () {
  let landContract: any;
  let owner: any;
  let buyer: any;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();

    const MetaTheWorldLand = await ethers.getContractFactory("MetaTheWorldLand");
    landContract = await MetaTheWorldLand.deploy(owner.address);
    await landContract.waitForDeployment();
  });

  it("Should deploy successfully", async function () {
    expect(await landContract.getAddress()).to.be.properAddress;
  });

  it("Should allow purchasing land", async function () {
    const price = await landContract.basePrice();
    await expect(
      landContract.connect(buyer).purchaseLand(5, 3, { value: price })
    ).to.emit(landContract, "LandPurchased");
  });

  it("Should prevent purchasing already owned land", async function () {
    const price = await landContract.basePrice();
    await landContract.connect(buyer).purchaseLand(5, 3, { value: price });
    
    await expect(
      landContract.connect(owner).purchaseLand(5, 3, { value: price })
    ).to.be.revertedWith("Land already owned");
  });
});
