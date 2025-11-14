import { useGameStore } from '../../store';
import { X, Briefcase, TrendingUp, Award, Target, Star } from 'lucide-react';
import type { CareerType } from '../../types';

const careers: { type: CareerType; description: string; icon: string }[] = [
  {
    type: 'RealEstateAgent',
    description: 'Earn commissions by facilitating property sales. Build your reputation and unlock higher commission rates.',
    icon: '🏠'
  },
  {
    type: 'Architect',
    description: 'Design and create stunning buildings. Earn from your creative vision and architectural prowess.',
    icon: '📐'
  },
  {
    type: 'Developer',
    description: 'Build and develop properties. Transform land into profitable real estate ventures.',
    icon: '🏗️'
  },
  {
    type: 'Artist',
    description: 'Create and sell virtual art. Express yourself and monetize your creativity.',
    icon: '🎨'
  },
  {
    type: 'Entrepreneur',
    description: 'Start businesses and build your empire. Unlimited potential for those with vision.',
    icon: '💼'
  },
  {
    type: 'Designer',
    description: 'Design interiors and environments. Help others create their dream spaces.',
    icon: '✨'
  },
  {
    type: 'Investor',
    description: 'Buy low, sell high. Master the market and grow your wealth through smart investments.',
    icon: '📈'
  },
  {
    type: 'ContentCreator',
    description: 'Share your experiences and build an audience. Monetize your Meta World adventures.',
    icon: '📹'
  },
  {
    type: 'EventPlanner',
    description: 'Organize amazing events and gatherings. Bring people together and create memories.',
    icon: '🎉'
  }
];

export function CareerUI() {
  const showCareerUI = useGameStore((state) => state.showCareerUI);
  const setShowCareerUI = useGameStore((state) => state.setShowCareerUI);
  const user = useGameStore((state) => state.user);
  const updateUser = useGameStore((state) => state.updateUser);
  const addNotification = useGameStore((state) => state.addNotification);

  if (!showCareerUI) return null;

  const handleChangeCareer = (careerType: CareerType) => {
    updateUser({
      career: {
        type: careerType,
        level: 1,
        experience: 0,
        earnings: 0,
        commissionRate: 0.03
      }
    });
    addNotification({
      type: 'success',
      title: 'Career Changed!',
      message: `You are now a ${careerType}`
    });
  };

  const experienceToNextLevel = (user.career.level * 100) - user.career.experience;
  const experienceProgress = (user.career.experience % 100) / 100 * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Career Management</h2>
              <p className="text-purple-100">Be who you want to be in Meta World</p>
            </div>
          </div>
          <button
            onClick={() => setShowCareerUI(false)}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Current Career Stats */}
          <div className="p-8 border-b border-white/10">
            <h3 className="text-white text-xl font-bold mb-4">Your Current Career</h3>
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {careers.find(c => c.type === user.career.type)?.icon} {user.career.type}
                  </h4>
                  <p className="text-gray-300">
                    {careers.find(c => c.type === user.career.type)?.description}
                  </p>
                </div>
                <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold">
                  Level {user.career.level}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 text-sm">Total Earnings</span>
                  </div>
                  <div className="text-white font-bold text-xl">{user.career.earnings.toLocaleString()} MC</div>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm">Experience</span>
                  </div>
                  <div className="text-white font-bold text-xl">{user.career.experience} XP</div>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 text-sm">Reputation</span>
                  </div>
                  <div className="text-white font-bold text-xl">{user.reputation}/100</div>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400 text-sm">Commission</span>
                  </div>
                  <div className="text-white font-bold text-xl">{(user.career.commissionRate * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Experience Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Progress to Level {user.career.level + 1}</span>
                  <span className="text-white text-sm font-semibold">{experienceToNextLevel} XP needed</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${experienceProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Available Careers */}
          <div className="p-8">
            <h3 className="text-white text-xl font-bold mb-4">Explore Other Careers</h3>
            <div className="grid grid-cols-3 gap-4">
              {careers.map((career) => {
                const isCurrent = career.type === user.career.type;
                
                return (
                  <div
                    key={career.type}
                    className={`bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-5 border-2 transition-all ${
                      isCurrent
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-4xl mb-3">{career.icon}</div>
                    <h4 className="text-white font-bold text-lg mb-2">{career.type}</h4>
                    <p className="text-gray-400 text-sm mb-4">{career.description}</p>
                    
                    {isCurrent ? (
                      <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-xl text-center font-semibold text-sm">
                        Current Career
                      </div>
                    ) : (
                      <button
                        onClick={() => handleChangeCareer(career.type)}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 rounded-xl transition-all text-sm"
                      >
                        Switch Career
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
