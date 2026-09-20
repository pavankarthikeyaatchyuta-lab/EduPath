import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, Trash2, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

interface CopilotDrawerProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ userId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I'm your EduPath Learning Copilot. I'm actively synced with your live skill gaps, test results, and recent roadmap adaptations toward Generative AI Engineer.\n\nAsk me about why your roadmap changed, what you should tackle next, or how to prepare for production RAG.",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "Why did my roadmap change?",
    "What should I learn today?",
    "Why do I need RAG?",
    "Can I skip this topic?",
    "What skills am I still missing?",
    "What should I build for my portfolio?",
    "How am I progressing toward my target role?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: query, timestamp: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askCopilot(userId, query);
      const botMsg: Message = { sender: 'assistant', text: res.response, timestamp: 'Just now' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Copilot error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "Based on your active state: your highest-leverage focus today is completing the Retrieval Evaluation exercise to ground your context before proceeding to vector databases.",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'assistant',
        text: "Conversation refreshed. I'm ready to answer questions about your learning trajectory!",
        timestamp: 'Just now'
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-[#0f1523] border-l border-gray-800 shadow-2xl z-50 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#0b0f1a]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              EduPath AI Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-gray-400">Context-Aware Learning Companion</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            title="Reset conversation"
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2.5 border-b border-gray-800 bg-[#070a14]/60 flex gap-2 overflow-x-auto">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700/80 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white shrink-0 transition-all font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed whitespace-pre-line text-xs ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-md'
                  : 'bg-gray-950 border border-gray-800/90 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-8">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            Copilot is retrieving learner state & synthesizing answer...
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <div className="p-3.5 border-t border-gray-800 bg-[#0b0f1a]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your roadmap, skill gaps, or test..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white shadow-md transition-all flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
