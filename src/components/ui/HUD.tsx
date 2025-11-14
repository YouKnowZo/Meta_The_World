import { useEffect } from 'react';
import { useGameStore } from '../../store';
import {
  Wallet,
  Briefcase,
  TrendingUp,
  Clock,
  Cloud,
  Sun,
  CloudRain,
  Users,
  Home
} from 'lucide-react';

export function HUD() {
  const user = useGameStore((state) => state.user);
  const worldState = useGameStore((state) => state.worldState);
  const setShowCareerUI = useGameStore((state) => state.setShowCareerUI);
  const setShowRealEstateUI = useGameStore((state) => state.setShowRealEstateUI);
  const updateWorldState = useGameStore((state) => state.updateWorldState);

  // Time progression
  useEffect(() => {
    const interval = setInterval(() => {
      updateWorldState({
        timeOfDay: (worldState.timeOfDay + 0.1) % 24
      });
    }, 5000); // Time passes every 5 seconds

    return () => clearInterval(interval);
  }, [worldState.timeOfDay, updateWorldState]);

  const getWeatherIcon = () => {
    switch (worldState.weather) {
      case 'sunny': return <Sun className="w-5 h-5" />;
      case 'cloudy': return <Cloud className="w-5 h-5" />;
      case 'rainy': return <CloudRain className="w-5 h-5" />;
      default: return <Sun className="w-5 h-5" />;
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time % 1) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between p-4">
          {/* Left side - User Info */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">{user.name}</div>
                  <div className="text-purple-300 text-sm">Level {user.career.level} {user.career.type}</div>
                </div>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{user.wallet.toLocaleString()}</span>
                <span className="text-yellow-300 text-sm">MC</span>
              </div>
            </div>
          </div>

          {/* Right side - World Info */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">{formatTime(worldState.timeOfDay)}</span>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                {getWeatherIcon()}
                <span className="text-white capitalize">{worldState.weather}</span>
                <span className="text-blue-300">{worldState.temperature}°F</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Quick Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-center pb-8">
          <div className="bg-black/60 backdrop-blur-md rounded-3xl px-8 py-4 border border-white/20 pointer-events-auto">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowRealEstateUI(true)}
                className="flex flex-col items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <Home className="w-6 h-6 text-green-400" />
                <span className="text-white text-sm">Properties</span>
              </button>

              <div className="w-px h-12 bg-white/20" />

              <button
                onClick={() => setShowCareerUI(true)}
                className="flex flex-col items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <Briefcase className="w-6 h-6 text-blue-400" />
                <span className="text-white text-sm">Career</span>
              </button>

              <div className="w-px h-12 bg-white/20" />

              <div className="flex flex-col items-center gap-2 px-4 py-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <span className="text-white text-sm">
                  {user.career.earnings.toLocaleString()} MC Earned
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Stats - Right Side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/20 pointer-events-auto">
          <div className="space-y-3">
            <div className="text-white text-sm font-semibold mb-3">Career Stats</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-300 text-xs">Properties Owned</span>
                <span className="text-white font-bold">{user.properties.length}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-300 text-xs">Commission Rate</span>
                <span className="text-green-400 font-bold">{(user.career.commissionRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-300 text-xs">Reputation</span>
                <span className="text-yellow-400 font-bold">{user.reputation}/100</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-300 text-xs">Experience</span>
                <span className="text-blue-400 font-bold">{user.career.experience} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
