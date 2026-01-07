'use client';

import { CodeBlock } from '@/types/ai-architect';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface AICodeBlockProps {
  block: CodeBlock;
}

export function AICodeBlock({ block }: AICodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
      {block.title && (
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-medium text-slate-400">
          {block.title}
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300">
          <code>{block.code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-slate-400" />
          )}
        </button>
      </div>
      <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800">
        <span className="text-[10px] text-slate-500 uppercase">{block.language}</span>
      </div>
    </div>
  );
}

