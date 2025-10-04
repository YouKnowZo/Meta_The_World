import { ethers } from "ethers";

export async function mintLand(lat: number, lng: number, signer: ethers.Signer, contractAddress: string, abi: any, uri: string) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  await contract.mintLand(
    Math.floor(lat * 1e6),
    Math.floor(lng * 1e6),
    uri
  );
}
