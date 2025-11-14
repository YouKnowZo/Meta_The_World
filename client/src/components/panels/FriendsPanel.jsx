import { useState, useEffect } from 'react';
import { UserPlus, Users, Check, X, UserMinus } from 'lucide-react';
import axios from 'axios';

export default function FriendsPanel({ onClose }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('friends');
  const [searchUsername, setSearchUsername] = useState('');

  useEffect(() => {
    if (activeTab === 'friends') {
      loadFriends();
    } else {
      loadRequests();
    }
  }, [activeTab]);

  const loadFriends = async () => {
    try {
      const res = await axios.get('/api/friends/list');
      setFriends(res.data);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await axios.get('/api/friends/requests');
      setRequests(res.data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const sendFriendRequest = async () => {
    if (!searchUsername.trim()) {
      alert('Please enter a username');
      return;
    }

    try {
      // First find user by username
      const usersRes = await axios.get(`/api/users/search?username=${searchUsername}`);
      if (usersRes.data.length === 0) {
        alert('User not found');
        return;
      }

      const targetUser = usersRes.data[0];
      await axios.post('/api/friends/request', { userId: targetUser._id });
      alert('Friend request sent!');
      setSearchUsername('');
      loadRequests();
    } catch (error) {
      alert(`Failed to send request: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await axios.post('/api/friends/accept', { requestId });
      loadRequests();
      loadFriends();
    } catch (error) {
      alert('Failed to accept request');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await axios.post('/api/friends/reject', { requestId });
      loadRequests();
    } catch (error) {
      alert('Failed to reject request');
    }
  };

  const removeFriend = async (userId) => {
    if (confirm('Remove this friend?')) {
      try {
        await axios.delete('/api/friends/remove', { data: { userId } });
        loadFriends();
      } catch (error) {
        alert('Failed to remove friend');
      }
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Users className="w-8 h-8" />
        Friends
      </h2>

      <div className="flex gap-2 mb-6 border-b border-white/20">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'friends'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'requests'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'add'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Add Friend
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="space-y-3">
          {friends.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No friends yet. Add some friends to get started!
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    friend.isOnline ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {friend.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-semibold">{friend.username}</div>
                    <div className="text-sm text-white/60">
                      {friend.isOnline ? 'Online' : `Last seen: ${new Date(friend.lastSeen).toLocaleString()}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFriend(friend._id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Remove friend"
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No pending friend requests
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-lg font-bold">
                      {request.from?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="font-semibold">{request.from?.username}</div>
                      <div className="text-sm text-white/60">Sent you a friend request</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest(request._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(request._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="space-y-4">
          <div>
            <label className="block text-white/90 mb-2">Search by Username</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter username"
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={sendFriendRequest}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
