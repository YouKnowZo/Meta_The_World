'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { interactWithAgent } from '@/lib/api-client';

export function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'agent', text: string }[]>([
    { role: 'agent', text: 'Hello! I am Diamond Dave, your AI Concierge. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await interactWithAgent('agent-1', 'user-123', userMessage);
      setMessages(prev => [...prev, { role: 'agent', text: result.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'agent', text: 'Sorry, I am having trouble connecting to my brain right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-700 w-80 h-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
            <div>
              <h3 className="font-bold text-white text-sm">Diamond Dave</h3>
              <p className="text-[10px] text-green-400 uppercase tracking-tighter">AI Concierge • Online</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-xs ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start italic text-[10px] text-slate-500">
                Dave is typing...
              </div>
            )}
          </div>

          <div className="p-2 bg-slate-800 flex space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Dave anything..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white focus:outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
