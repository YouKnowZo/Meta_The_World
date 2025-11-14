import { useState, useEffect } from 'react';
import { Heart, X, Users, MessageCircle } from 'lucide-react';
import axios from 'axios';

export default function DatingPanel({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [discover, setDiscover] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    loadProfile();
    loadMatches();
    if (activeTab === 'discover') {
      loadDiscover();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      const res = await axios.get('/api/dating/profile');
      setProfile(res.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadDiscover = async () => {
    try {
      const res = await axios.get('/api/dating/discover');
      setDiscover(res.data);
    } catch (error) {
      console.error('Failed to load discover:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const res = await axios.get('/api/dating/matches');
      setMatches(res.data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    }
  };

  const handleLike = async (userId) => {
    try {
      const res = await axios.post(`/api/dating/like/${userId}`);
      if (res.data.matched) {
        alert('🎉 It\'s a match!');
        loadMatches();
      }
      loadDiscover();
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleDislike = async (userId) => {
    try {
      await axios.post(`/api/dating/dislike/${userId}`);
      loadDiscover();
    } catch (error) {
      console.error('Failed to dislike:', error);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Heart className="w-8 h-8 text-pink-500" />
        Dating & Social
      </h2>

      <div className="flex gap-2 mb-6 border-b border-white/20">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'discover'
              ? 'text-pink-400 border-b-2 border-pink-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'matches'
              ? 'text-pink-400 border-b-2 border-pink-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Matches ({matches.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'text-pink-400 border-b-2 border-pink-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          My Profile
        </button>
      </div>

      {activeTab === 'discover' && (
        <div className="space-y-4">
          {discover.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No more profiles to discover. Check back later!
            </div>
          ) : (
            discover.map((person) => (
              <div
                key={person._id}
                className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    {person.user?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {person.user?.username || 'Unknown'}
                    </h3>
                    {person.age && <p className="text-white/60 mb-2">Age: {person.age}</p>}
                    {person.bio && <p className="text-white/80 mb-2">{person.bio}</p>}
                    {person.interests && person.interests.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-3">
                        {person.interests.map((interest, i) => (
                          <span
                            key={i}
                            className="bg-pink-600/30 text-pink-200 px-2 py-1 rounded text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDislike(person.user._id)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Pass
                      </button>
                      <button
                        onClick={() => handleLike(person.user._id)}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Heart className="w-5 h-5" />
                        Like
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No matches yet. Start swiping to find your match!
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match._id}
                className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                    {match.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{match.username}</h3>
                  </div>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'profile' && profile && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Edit Your Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/90 mb-2">Bio</label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
                  placeholder="Tell people about yourself..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
                  min="18"
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    await axios.put('/api/dating/profile', profile);
                    alert('Profile updated!');
                  } catch (error) {
                    alert('Failed to update profile');
                  }
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
