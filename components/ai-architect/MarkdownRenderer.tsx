'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AICodeBlock } from './AICodeBlock';
import { CodeBlock } from '@/types/ai-architect';
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headers with proper hierarchy and enterprise styling
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold text-white mt-6 mb-4 pb-3 border-b-2 border-slate-700/50" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold text-white mt-6 mb-3 tracking-tight" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-semibold text-white mt-5 mb-2.5" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-base font-semibold text-slate-200 mt-4 mb-2" {...props} />
        ),
        h5: ({ node, ...props }) => (
          <h5 className="text-sm font-semibold text-slate-300 mt-3 mb-2" {...props} />
        ),
        h6: ({ node, ...props }) => (
          <h6 className="text-sm font-medium text-slate-400 mt-3 mb-1.5 uppercase tracking-wide" {...props} />
        ),

        // Paragraphs with optimal line height and spacing
        p: ({ node, ...props }) => (
          <p className="text-slate-100 leading-relaxed mb-4 text-[15px]" {...props} />
        ),

        // Lists with proper spacing and indentation
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-outside mb-4 space-y-2 ml-6 text-slate-100 marker:text-slate-400" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-outside mb-4 space-y-2 ml-6 text-slate-100 marker:text-slate-400" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-slate-100 leading-relaxed text-[15px] pl-2" {...props} />
        ),

        // Inline code with professional styling
        code: ({ node, className, children, ...props }: any) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="bg-slate-900/80 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-300 border border-slate-700/50 font-medium"
                {...props}
              >
                {children}
              </code>
            );
          }
          // Code blocks are handled by pre component
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },

        // Code blocks - extract and use AICodeBlock with syntax highlighting
        pre: ({ node, children, ...props }: any) => {
          const codeElement = React.Children.toArray(children).find(
            (child: any) => child?.type === 'code'
          ) as any;
          
          if (codeElement?.props?.className) {
            const language = codeElement.props.className.replace(/^language-/, '') || 'text';
            const code = String(codeElement.props.children || '').trim();
            
            return (
              <div className="my-4">
                <AICodeBlock
                  block={{
                    language,
                    code,
                  }}
                />
              </div>
            );
          }
          
          return (
            <pre className="bg-slate-950 border border-slate-700 rounded-lg p-4 overflow-x-auto my-4 text-xs font-mono text-slate-300" {...props}>
              {children}
            </pre>
          );
        },

        // Links with professional hover effects
        a: ({ node, ...props }) => (
          <a
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-medium"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),

        // Blockquotes with professional styling
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-indigo-500/70 pl-5 py-3 my-4 bg-slate-900/30 rounded-r-lg italic text-slate-300 text-[15px] leading-relaxed"
            {...props}
          />
        ),

        // Tables with professional borders and hover effects
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-5 rounded-lg border border-slate-700">
            <table className="min-w-full border-collapse" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-slate-900/80" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="divide-y divide-slate-700/50" {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr className="hover:bg-slate-800/30 transition-colors" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-700" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="px-4 py-3 text-sm text-slate-200 border-b border-slate-700/50" {...props} />
        ),

        // Horizontal rules with professional styling
        hr: ({ node, ...props }) => (
          <hr className="my-6 border-0 border-t-2 border-slate-700/50" {...props} />
        ),

        // Strong and emphasis with refined styling
        strong: ({ node, ...props }) => (
          <strong className="font-semibold text-white" {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className="italic text-slate-200" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

