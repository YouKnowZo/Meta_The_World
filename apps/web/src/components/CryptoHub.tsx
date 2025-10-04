import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CryptoHubProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  address: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

export const CryptoHub: React.FC<CryptoHubProps> = ({ isVisible }) => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'nft' | 'history'>('send');
  const [balance, setBalance] = useState({ eth: 2.45, usd: 8234.56 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sendForm, setSendForm] = useState({ address: '', amount: '', currency: 'ETH' });
  const [nftForm, setNftForm] = useState({ address: '', tokenId: '', contract: '' });

  const handleSendCrypto = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'send',
      amount: parseFloat(sendForm.amount),
      currency: sendForm.currency,
      address: sendForm.address,
      status: 'pending',
      timestamp: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setSendForm({ address: '', amount: '', currency: 'ETH' });
    
    // Simulate transaction confirmation
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'confirmed' }
            : tx
        )
      );
      setBalance(prev => ({
        ...prev,
        eth: prev.eth - newTransaction.amount,
        usd: prev.usd - (newTransaction.amount * 3360) // ETH price simulation
      }));
    }, 3000);
  };

  const handleSendNFT = () => {
    // NFT transfer logic
    console.log('Sending NFT:', nftForm);
    setNftForm({ address: '', tokenId: '', contract: '' });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="crypto-hub"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="balance-display">
        <div className="balance-amount">{balance.eth.toFixed(3)} ETH</div>
        <div className="balance-usd">${balance.usd.toLocaleString()}</div>
      </div>

      <div className="crypto-tabs">
        {(['send', 'receive', 'nft', 'history'] as const).map(tab => (
          <button
            key={tab}
            className={`crypto-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'send' && (
          <motion.div
            key="send"
            className="transaction-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="form-group">
              <label className="form-label">Recipient Address</label>
              <input
                className="form-input"
                type="text"
                placeholder="0x..."
                value={sendForm.address}
                onChange={(e) => setSendForm(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <div className="flex-gap">
                <input
                  className="form-input"
                  type="number"
                  placeholder="0.00"
                  value={sendForm.amount}
                  onChange={(e) => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                />
                <select
                  className="form-select"
                  value={sendForm.currency}
                  onChange={(e) => setSendForm(prev => ({ ...prev, currency: e.target.value }))}
                  aria-label="Select currency"
                >
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                  <option value="LAND">LAND</option>
                </select>
              </div>
            </div>
            <button className="transaction-btn" onClick={handleSendCrypto}>
              Send Crypto 🚀
            </button>
          </motion.div>
        )}

        {activeTab === 'receive' && (
          <motion.div
            key="receive"
            className="transaction-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="form-group">
              <label className="form-label">Your Wallet Address</label>
              <div className="wallet-address">
                0x742d35Cc6A3A9bC7d1b9b26FD3a5e8C4f8e9D2a1
              </div>
            </div>
            <div className="qr-code-container">
              <div className="large-icon">📱</div>
              <div>QR Code for Mobile Wallets</div>
            </div>
          </motion.div>
        )}

        {activeTab === 'nft' && (
          <motion.div
            key="nft"
            className="transaction-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="form-group">
              <label className="form-label">Recipient Address</label>
              <input
                className="form-input"
                type="text"
                placeholder="0x..."
                value={nftForm.address}
                onChange={(e) => setNftForm(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contract Address</label>
              <input
                className="form-input"
                type="text"
                placeholder="NFT Contract Address"
                value={nftForm.contract}
                onChange={(e) => setNftForm(prev => ({ ...prev, contract: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Token ID</label>
              <input
                className="form-input"
                type="text"
                placeholder="Token ID"
                value={nftForm.tokenId}
                onChange={(e) => setNftForm(prev => ({ ...prev, tokenId: e.target.value }))}
              />
            </div>
            <button className="transaction-btn" onClick={handleSendNFT}>
              Send NFT 🎨
            </button>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {transactions.length === 0 ? (
              <div className="text-center-padding">
                No transactions yet
              </div>
            ) : (
              <div className="progress-bar-container">
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    className="transaction-item"
                    style={{
                      '--status-border-color': 
                        tx.status === 'confirmed' ? 'var(--primary-cyan)' :
                        tx.status === 'pending' ? 'var(--primary-gold)' : 'var(--accent-pink)'
                    } as React.CSSProperties}
                  >
                    <div className="transaction-header">
                      <span className="transaction-amount">
                        {tx.type === 'send' ? '📤' : '📥'} {tx.type.toUpperCase()}
                      </span>
                      <span className="transaction-status" style={{ '--status-color': tx.status === 'confirmed' ? 'var(--primary-cyan)' : 'var(--primary-gold)' } as React.CSSProperties}>
                        {tx.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="transaction-description">
                      <strong>{tx.amount} {tx.currency}</strong>
                    </div>
                    <div className="transaction-address">
                      {tx.address}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};