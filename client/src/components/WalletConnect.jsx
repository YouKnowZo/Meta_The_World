import { useState, useEffect } from 'react';
import { Wallet, Coins, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function WalletConnect() {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    loadWallet();
    loadNetworks();
  }, []);

  const loadWallet = async () => {
    try {
      const res = await axios.get('/api/crypto/wallet');
      setWallet(res.data);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  };

  const loadNetworks = async () => {
    try {
      const res = await axios.get('/api/crypto/networks');
      setNetworks(res.data);
    } catch (error) {
      console.error('Failed to load networks:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Detect network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkId = parseInt(chainId, 16);
      
      let network = 'polygon';
      if (networkId === 137) network = 'polygon';
      else if (networkId === 1) network = 'ethereum';
      else if (networkId === 56) network = 'bsc';
      else if (networkId === 42161) network = 'arbitrum';
      else if (networkId === 10) network = 'optimism';

      // Connect to backend
      const res = await axios.post('/api/crypto/connect', {
        address,
        network
      });

      setWallet(res.data);
      alert('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const claimFaucet = async () => {
    if (!wallet?.connected) {
      alert('Please connect your wallet first');
      return;
    }

    setClaiming(true);
    try {
      const res = await axios.post('/api/crypto/faucet/claim');
      alert(res.data.message || 'Faucet claimed successfully!');
      loadWallet();
    } catch (error) {
      alert(`Failed to claim faucet: ${error.response?.data?.error || error.message}`);
    } finally {
      setClaiming(false);
    }
  };

  if (!wallet || !wallet.connected) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gray-900/95 backdrop-blur-lg border border-purple-500/50 rounded-lg p-4 shadow-2xl max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Connect your crypto wallet to earn real cryptocurrency and claim your starting balance!
          </p>
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {connecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          {networks.length > 0 && (
            <p className="text-white/60 text-xs mt-2 text-center">
              Supported: {networks.map(n => n.name).join(', ')}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-lg border border-purple-500/50 rounded-lg p-4 shadow-2xl max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Wallet Connected</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Address:</span>
            <span className="text-white font-mono text-xs">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Network:</span>
            <span className="text-purple-400">{wallet.networkInfo?.name || wallet.network}</span>
          </div>
          {wallet.balances?.native && (
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Balance:</span>
              <span className="text-green-400 font-semibold">
                {parseFloat(wallet.balances.native).toFixed(4)} {wallet.networkInfo?.nativeCurrency}
              </span>
            </div>
          )}
        </div>

        {!wallet.hasClaimedFaucet && (
          <button
            onClick={claimFaucet}
            disabled={claiming}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Coins className="w-5 h-5" />
            {claiming ? 'Claiming...' : `Claim Free ${wallet.networkInfo?.faucetAmount || '10'} ${wallet.networkInfo?.nativeCurrency || 'MATIC'}`}
          </button>
        )}

        {wallet.hasClaimedFaucet && (
          <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-2 text-center">
            <p className="text-green-400 text-sm">✓ Faucet Already Claimed</p>
          </div>
        )}
      </div>
    </div>
  );
}
