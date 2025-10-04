import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LandNFTModule = buildModule("LandNFTModule", (m) => {
  const landNFT = m.contract("LandNFT");
  
  return { landNFT };
});

export default LandNFTModule;