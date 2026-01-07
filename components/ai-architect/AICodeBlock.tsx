'use client';

import { CodeBlock } from '@/types/ai-architect';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        <SyntaxHighlighter
          language={block.language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.75rem',
            lineHeight: '1.5',
            background: '#0a0a0a',
            border: 'none',
          }}
          showLineNumbers={false}
        >
          {block.code}
        </SyntaxHighlighter>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-slate-800/90 hover:bg-slate-700 rounded border border-slate-700 transition-colors backdrop-blur-sm"
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

