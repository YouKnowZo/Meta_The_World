import { BrowserProvider, Contract } from 'ethers';

let provider = null;
let signer = null;

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

export async function getProvider() {
  if (!provider && window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
  }
  return provider;
}

export async function getSigner() {
  if (!signer) {
    const prov = await getProvider();
    signer = await prov.getSigner();
  }
  return signer;
}

export async function getContract(address, abi) {
  const sign = await getSigner();
  return new Contract(address, abi, sign);
}

export async function switchNetwork(chainId) {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    console.error('Error switching network:', error);
    throw error;
  }
}

export function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(value) {
  const ethers = await import('ethers');
  return ethers.formatEther(value);
}

export function parseEther(value) {
  const ethers = await import('ethers');
  return ethers.parseEther(value);
}
