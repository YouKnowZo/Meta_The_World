import { useState } from 'react';
import { useGameStore } from '../../store';
import { MessageCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messages = useGameStore((state) => state.messages);
  const addMessage = useGameStore((state) => state.addMessage);
  const user = useGameStore((state) => state.user);

  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage({
        id: `msg-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        content: message,
        timestamp: Date.now(),
        type: 'global'
      });
      setMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full p-4 shadow-2xl transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50 w-96 h-[500px] bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Global Chat</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          isOwn
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        {!isOwn && (
                          <div className="text-xs font-semibold mb-1 opacity-80">
                            {msg.senderName}
                          </div>
                        )}
                        <div className="text-sm">{msg.content}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white p-2 rounded-xl transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
