import { expect } from "chai";
import { ethers } from "hardhat";

describe("MetaWorldLand", function () {
  let metaWorldLand;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MetaWorldLand = await ethers.getContractFactory("MetaWorldLand");
    metaWorldLand = await MetaWorldLand.deploy();
    await metaWorldLand.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await metaWorldLand.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await metaWorldLand.name()).to.equal("Meta World Land");
      expect(await metaWorldLand.symbol()).to.equal("MWL");
    });

    it("Should have correct base price", async function () {
      expect(await metaWorldLand.basePrice()).to.equal(ethers.parseEther("0.1"));
    });
  });

  describe("Minting", function () {
    it("Should mint a land parcel", async function () {
      const mintPrice = await metaWorldLand.basePrice();
      
      await expect(
        metaWorldLand.connect(addr1).mintLand(
          10, 20, 0, // x, y, z
          100, // size
          "grass",
          "ipfs://test-uri",
          { value: mintPrice }
        )
      ).to.emit(metaWorldLand, "LandMinted");

      expect(await metaWorldLand.ownerOf(0)).to.equal(addr1.address);
      expect(await metaWorldLand.totalSupply()).to.equal(1);
    });

    it("Should fail if payment is insufficient", async function () {
      await expect(
        metaWorldLand.connect(addr1).mintLand(
          10, 20, 0,
          100,
          "grass",
          "ipfs://test-uri",
          { value: ethers.parseEther("0.01") }
        )
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should prevent minting at same coordinates", async function () {
      const mintPrice = await metaWorldLand.basePrice();
      
      await metaWorldLand.connect(addr1).mintLand(
        10, 20, 0,
        100,
        "grass",
        "ipfs://test-uri",
        { value: mintPrice }
      );

      await expect(
        metaWorldLand.connect(addr2).mintLand(
          10, 20, 0,
          100,
          "grass",
          "ipfs://test-uri-2",
          { value: mintPrice }
        )
      ).to.be.revertedWith("Land already minted");
    });

    it("Should batch mint multiple parcels", async function () {
      const mintPrice = await metaWorldLand.basePrice();
      const count = 3;
      
      await metaWorldLand.connect(addr1).batchMintLand(
        [0, 1, 2], // x coordinates
        [0, 0, 0], // y coordinates
        [0, 0, 0], // z coordinates
        [100, 100, 100], // sizes
        ["grass", "sand", "water"],
        ["ipfs://1", "ipfs://2", "ipfs://3"],
        { value: mintPrice * BigInt(count) }
      );

      expect(await metaWorldLand.totalSupply()).to.equal(count);
      expect(await metaWorldLand.ownerOf(0)).to.equal(addr1.address);
      expect(await metaWorldLand.ownerOf(2)).to.equal(addr1.address);
    });
  });

  describe("Land Queries", function () {
    beforeEach(async function () {
      const mintPrice = await metaWorldLand.basePrice();
      await metaWorldLand.connect(addr1).mintLand(
        5, 10, 0,
        100,
        "grass",
        "ipfs://test-uri",
        { value: mintPrice }
      );
    });

    it("Should return land parcel details", async function () {
      const land = await metaWorldLand.getLandParcel(0);
      expect(land.x).to.equal(5);
      expect(land.y).to.equal(10);
      expect(land.z).to.equal(0);
      expect(land.size).to.equal(100);
      expect(land.landType).to.equal("grass");
    });

    it("Should check coordinate availability", async function () {
      expect(await metaWorldLand.isCoordinateAvailable(5, 10, 0)).to.be.false;
      expect(await metaWorldLand.isCoordinateAvailable(100, 100, 0)).to.be.true;
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to change base price", async function () {
      const newPrice = ethers.parseEther("0.2");
      await metaWorldLand.setBasePrice(newPrice);
      expect(await metaWorldLand.basePrice()).to.equal(newPrice);
    });

    it("Should prevent non-owner from changing base price", async function () {
      await expect(
        metaWorldLand.connect(addr1).setBasePrice(ethers.parseEther("0.2"))
      ).to.be.reverted;
    });

    it("Should allow owner to withdraw funds", async function () {
      const mintPrice = await metaWorldLand.basePrice();
      await metaWorldLand.connect(addr1).mintLand(
        10, 20, 0,
        100,
        "grass",
        "ipfs://test-uri",
        { value: mintPrice }
      );

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      await metaWorldLand.withdraw();
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });
});
