import { useState } from 'react';
import { useGameStore } from '../../store';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Welcome() {
  const [name, setName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const updateUser = useGameStore((state) => state.updateUser);
  const addNotification = useGameStore((state) => state.addNotification);

  const handleStart = () => {
    if (name.trim()) {
      updateUser({ name: name.trim() });
      addNotification({
        type: 'success',
        title: 'Welcome to Meta World!',
        message: `Hello ${name}! Your journey begins now.`
      });
      setShowWelcome(false);
    }
  };

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-4"
      >
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to Meta World
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              A place where you can be anything you want to be
            </p>
            <p className="text-gray-400">
              Everything you dreamed of, but better. Your second chance at life awaits.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                placeholder="Enter your name..."
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                autoFocus
              />
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">What You Can Do:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Become a Real Estate Agent and earn commissions on every sale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Own properties and build your real estate empire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Choose from 9 different careers and live the life you always wanted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Explore a hyper-realistic world with dynamic weather and day/night cycles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Build relationships, chat with others, and create your story</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            Starting with 50,000 MetaCoins
          </div>
        </div>
      </motion.div>
    </div>
  );
}
