'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { AIMessage } from './AIMessage';
import { AIMessage as AIMessageType, ChatContext } from '@/types/ai-architect';
import { generateResponse } from '@/lib/ai-architect/responder';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: ChatContext;
  onHighlight?: (componentIds: string[]) => void;
}

export function AIChatPanel({ isOpen, onClose, context, onHighlight }: AIChatPanelProps) {
  const [messages, setMessages] = useState<AIMessageType[]>([
    {
      id: '1',
      role: 'system',
      content: 'Hi! I\'m your AI Architect assistant. Ask me anything about the system architecture, data flows, or components. Try asking me to "show me a diagram" or "visualize the data flow" for interactive components!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAIPowered, setIsAIPowered] = useState<boolean | null>(null);
  const [c1Available, setC1Available] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if AI is available on mount
  useEffect(() => {
    if (isOpen) {
      fetch('/api/ai-architect')
        .then((res) => res.json())
        .then((data) => {
          setIsAIPowered(data.openai?.available === true || data.c1?.available === true);
          setC1Available(data.c1?.available === true);
        })
        .catch(() => {
          setIsAIPowered(false);
          setC1Available(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const queryText = input.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Generate response (async - tries OpenAI, falls back to pattern matching)
    try {
      const response = await generateResponse(queryText, context);
      setMessages((prev) => [...prev, response]);

      // Handle highlights if provided
      if (response.highlights && onHighlight) {
        onHighlight(response.highlights);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback error message
      const errorMessage: AIMessageType = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end pointer-events-none">
      <div className="w-full max-w-md h-[600px] bg-slate-900 border-t border-l border-slate-800 rounded-tl-2xl shadow-2xl flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950 rounded-tl-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-white">AI Architect</div>
                {isAIPowered !== null && (
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isAIPowered 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/50' 
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}>
                      {isAIPowered ? 'AI Powered' : 'Demo Mode'}
                    </span>
                    {c1Available && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-600/50">
                        C1
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-[10px] text-slate-400">Ask me anything</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <AIMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                <Loader2 size={16} className="text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-800 p-4 bg-slate-950">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about architecture, data flows, components..."
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg transition-colors"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            Try: "How does data flow from ERP to Tinybird?" or "Show me a diagram of the architecture"
          </div>
        </div>
      </div>
    </div>
  );
}

