'use client';

import React, { useState } from 'react';
import { Sidebar } from "@/components/dashboard/sidebar";
import { placeBet } from '@/lib/api-client';

export default function GamblingPage() {
  const [betAmount, setBetAmount] = useState(10);
  const [status, setStatus] = useState('');

  const handleBet = async (gameType: number) => {
    setStatus('Requesting VRF Randomness...');
    try {
      const result = await placeBet(betAmount, gameType, 'p1');
      setStatus(`Bet placed! Request ID: ${result.requestId}. Awaiting resolution from Chainlink VRF...`);
    } catch (e) {
      setStatus('Transaction failed.');
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Diamond District</h1>
        <p className="text-slate-400 mb-8">Provably Fair Games powered by Chainlink VRF v2.5</p>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl">
          <label className="block text-sm font-medium text-slate-400 mb-2">Bet Amount (MTW)</label>
          <div className="flex space-x-4 mb-6">
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              {[10, 50, 100].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => setBetAmount(amt)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 text-xs"
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => handleBet(0)} className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-xl text-center hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
              <span className="block text-3xl mb-2">🎲</span>
              <span className="font-bold">Dice Roll</span>
              <span className="block text-xs opacity-75">2x Payout</span>
            </button>
            <button onClick={() => handleBet(1)} className="bg-gradient-to-br from-yellow-600 to-red-600 p-6 rounded-xl text-center hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20">
              <span className="block text-3xl mb-2">🪙</span>
              <span className="font-bold">Coin Flip</span>
              <span className="block text-xs opacity-75">2x Payout</span>
            </button>
            <button onClick={() => handleBet(2)} className="bg-gradient-to-br from-green-600 to-teal-600 p-6 rounded-xl text-center hover:scale-105 transition-transform shadow-lg shadow-green-500/20">
              <span className="block text-3xl mb-2">🎡</span>
              <span className="font-bold">Roulette</span>
              <span className="block text-xs opacity-75">36x Payout</span>
            </button>
          </div>

          {status && (
            <div className="mt-8 p-4 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-200 animate-pulse">
              {status}
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500">
            <p>House Edge: 3% (Distributed to LAND owners and MTW stakers via micro-royalties)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
