import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users } from 'lucide-react';
import axios from 'axios';
import { socket } from '../../utils/socket';
import { useAuthStore } from '../../stores/authStore';

export default function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatType, setChatType] = useState('global');
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadMessages();
    
    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [chatType, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const params = { chatType };
      if (chatType === 'private' && selectedUser) {
        params.receiverId = selectedUser._id || selectedUser;
      }
      const res = await axios.get('/api/chat/messages', { params });
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      chatType,
      content: newMessage,
      receiverId: chatType === 'private' ? (selectedUser?._id || selectedUser) : null
    };

    socket.emit('chat-message', messageData);
    setNewMessage('');
  };

  return (
    <div className="p-6 text-white h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <MessageCircle className="w-8 h-8" />
        Chat
      </h2>

      <div className="flex gap-2 mb-4 border-b border-white/20">
        <button
          onClick={() => setChatType('global')}
          className={`px-4 py-2 font-semibold transition-colors ${
            chatType === 'global'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setChatType('private')}
          className={`px-4 py-2 font-semibold transition-colors ${
            chatType === 'private'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Private
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex gap-2 ${msg.sender?._id === user?.id ? 'justify-end' : ''}`}
          >
            {msg.sender?._id !== user?.id && (
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                {msg.sender?.username?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className={`max-w-[70%] ${msg.sender?._id === user?.id ? 'bg-purple-600' : 'bg-gray-700'} rounded-lg p-3`}>
              {msg.sender?._id !== user?.id && (
                <div className="text-xs text-white/70 mb-1">{msg.sender?.username}</div>
              )}
              <div>{msg.content}</div>
              <div className="text-xs text-white/50 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={chatType === 'private' ? 'Message...' : 'Type a message...'}
          className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send
        </button>
      </form>
    </div>
  );
}
