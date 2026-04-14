'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from "@/components/dashboard/sidebar";
import { fetchVehicles } from '@/lib/api-client';

export default function DealershipPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetchVehicles().then(setVehicles);
  }, []);

  return (
    <main className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Modular Vehicle Dealership</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <div key={v.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden p-4 flex flex-col">
              <img src={v.image} alt={v.name} className="w-full h-48 object-cover rounded-lg mb-4 bg-slate-800" />
              <h2 className="text-xl font-semibold">{v.name}</h2>
              <p className="text-blue-400 font-bold mb-4">{v.price}</p>
              <div className="mt-auto">
                <p className="text-xs text-slate-500 mb-2">Modular Parts Supported: Engine, Spoiler, Rims</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                  Purchase NFT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
