'use client';

import { AIMessage as AIMessageType } from '@/types/ai-architect';
import { AICodeBlock } from './AICodeBlock';
import { C1Renderer } from './C1Renderer';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AIMessageProps {
  message: AIMessageType;
}

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-xs text-slate-400">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-800 text-slate-100 border border-slate-700'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

        {/* C1 Generative UI Components */}
        {message.c1Components && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2 text-xs text-indigo-400">
              <Sparkles size={12} />
              <span className="font-medium">Interactive Component</span>
            </div>
            <C1Renderer components={message.c1Components} />
          </div>
        )}

        {message.codeBlocks && message.codeBlocks.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.codeBlocks.map((block, idx) => (
              <AICodeBlock key={idx} block={block} />
            ))}
          </div>
        )}

        {message.links && message.links.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
            {message.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink size={12} />
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </div>
          {message.source && (
            <div className="text-[10px] text-slate-600">
              {message.source === 'c1' && (
                <span className="px-1.5 py-0.5 bg-indigo-600/20 text-indigo-400 rounded">
                  C1
                </span>
              )}
              {message.source === 'openai' && (
                <span className="px-1.5 py-0.5 bg-green-600/20 text-green-400 rounded">
                  AI
                </span>
              )}
              {message.source === 'pattern' && (
                <span className="px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
                  Demo
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

