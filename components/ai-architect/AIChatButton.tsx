'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AIChatPanel } from './AIChatPanel';
import { ChatContext } from '@/types/ai-architect';

interface AIChatButtonProps {
  context?: ChatContext;
  onHighlight?: (componentIds: string[]) => void;
}

export function AIChatButton({ context, onHighlight }: AIChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="Open AI Architect"
        data-tour="ai-chat-button"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>
      <AIChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context={context}
        onHighlight={onHighlight}
      />
    </>
  );
}

