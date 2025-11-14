import { useState } from 'react';
import { useWorldStore } from '../stores/worldStore';
import { Building2, Home, Briefcase, Settings, X, Heart, Car, Store, PawPrint } from 'lucide-react';
import RealEstatePanel from './panels/RealEstatePanel';
import PropertyPanel from './panels/PropertyPanel';
import AgentPanel from './panels/AgentPanel';
import DatingPanel from './panels/DatingPanel';
import CarPanel from './panels/CarPanel';
import StorePanel from './panels/StorePanel';
import PetPanel from './panels/PetPanel';

export default function HUD() {
  const [activePanel, setActivePanel] = useState(null);
  const { realEstateMode, agentMode } = useWorldStore();

  const panels = {
    realEstate: <RealEstatePanel onClose={() => setActivePanel(null)} />,
    property: <PropertyPanel onClose={() => setActivePanel(null)} />,
    agent: <AgentPanel onClose={() => setActivePanel(null)} />,
    dating: <DatingPanel onClose={() => setActivePanel(null)} />,
    car: <CarPanel onClose={() => setActivePanel(null)} />,
    store: <StorePanel onClose={() => setActivePanel(null)} />,
    pet: <PetPanel onClose={() => setActivePanel(null)} />
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => setActivePanel(activePanel === 'realEstate' ? null : 'realEstate')}
          className={`p-4 rounded-lg backdrop-blur-md border-2 transition-all ${
            activePanel === 'realEstate' || realEstateMode
              ? 'bg-purple-600/80 border-purple-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          title="Real Estate"
        >
          <Building2 className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setActivePanel(activePanel === 'property' ? null : 'property')}
          className={`p-4 rounded-lg backdrop-blur-md border-2 transition-all ${
            activePanel === 'property'
              ? 'bg-purple-600/80 border-purple-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          title="My Properties"
        >
          <Home className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setActivePanel(activePanel === 'agent' ? null : 'agent')}
          className={`p-4 rounded-lg backdrop-blur-md border-2 transition-all ${
            activePanel === 'agent' || agentMode
              ? 'bg-purple-600/80 border-purple-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          title="Real Estate Agent"
        >
          <Briefcase className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setActivePanel(activePanel === 'dating' ? null : 'dating')}
          className={`p-4 rounded-lg backdrop-blur-md border-2 transition-all ${
            activePanel === 'dating'
              ? 'bg-pink-600/80 border-pink-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          title="Dating & Social"
        >
          <Heart className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setActivePanel(activePanel === 'car' ? null : 'car')}
          className={`p-4 rounded-lg backdrop-blur-md border-2 transition-all ${
            activePanel === 'car'
              ? 'bg-blue-600/80 border-blue-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          title="My Garage"
        >
          <Car className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setActivePanel(activePanel === 'store' ? null : 'store')}
          className={`p-4 rounded-lg backdrop-blur-md border-2 transition-all ${
            activePanel === 'store'
              ? 'bg-green-600/80 border-green-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          title="Stores"
        >
          <Store className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setActivePanel(activePanel === 'pet' ? null : 'pet')}
          className={`p-4 rounded-lg backdrop-blur-md border-2 transition-all ${
            activePanel === 'pet'
              ? 'bg-pink-600/80 border-pink-400 text-white'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
          title="My Pets"
        >
          <PawPrint className="w-6 h-6" />
        </button>
      </div>

      {activePanel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-black/50 backdrop-blur-sm w-full h-full flex items-center justify-center p-4">
            <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-purple-500/50 relative">
              <button
                onClick={() => setActivePanel(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {panels[activePanel]}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
