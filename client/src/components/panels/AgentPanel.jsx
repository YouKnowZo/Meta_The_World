import { useState, useEffect } from 'react';
import { Briefcase, DollarSign, TrendingUp, UserCheck } from 'lucide-react';
import axios from 'axios';

export default function AgentPanel({ onClose }) {
  const [isAgent, setIsAgent] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [license, setLicense] = useState('');
  const [commissionRate, setCommissionRate] = useState('5');

  useEffect(() => {
    checkAgentStatus();
  }, []);

  const checkAgentStatus = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setIsAgent(res.data.isRealEstateAgent);
      if (res.data.isRealEstateAgent) {
        loadTransactions(res.data._id);
      }
    } catch (error) {
      console.error('Failed to check agent status:', error);
    }
  };

  const loadTransactions = async (agentId) => {
    try {
      const res = await axios.get(`/api/transactions/agent/${agentId}`);
      setTransactions(res.data.transactions);
      setTotalCommission(res.data.totalCommission);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const becomeAgent = async () => {
    if (!license.trim()) {
      alert('Please enter a license number');
      return;
    }

    try {
      await axios.post(`/api/users/me/become-agent`, {
        license,
        commissionRate: parseFloat(commissionRate) / 100
      });
      setIsAgent(true);
      alert('Congratulations! You are now a licensed real estate agent!');
      checkAgentStatus();
    } catch (error) {
      alert(`Failed to become agent: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Briefcase className="w-8 h-8" />
        Real Estate Agent Portal
      </h2>

      {!isAgent ? (
        <div className="space-y-6">
          <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Become a Real Estate Agent</h3>
            <p className="text-white/70 mb-6">
              As a real estate agent, you'll earn a commission on every property transaction you facilitate.
              Help buyers find their dream properties and sellers get the best deals!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-white/90 mb-2">License Number</label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your license number"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2">Commission Rate (%)</label>
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  min="1"
                  max="10"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                />
                <p className="text-white/60 text-sm mt-1">
                  Default: 5%. You'll earn this percentage of every sale you facilitate.
                </p>
              </div>

              <button
                onClick={becomeAgent}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Get Licensed
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Total Commission</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400">
                <DollarSign className="w-8 h-8 inline" />
                {totalCommission.toLocaleString()}
              </div>
            </div>

            <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Transactions</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400">
                {transactions.length}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No transactions yet. Start facilitating property sales to earn commissions!
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction._id}
                    className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          Property #{transaction.property?.tokenId}
                        </div>
                        <div className="text-sm text-white/60">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-semibold">
                          +<DollarSign className="w-4 h-4 inline" />
                          {transaction.agentCommission.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/60">
                          Sale: ${transaction.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
