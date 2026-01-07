'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface CodeExplanationTooltipProps {
  term: string;
  explanation: string;
  relatedTerms?: string[];
  link?: string;
}

const GLOSSARY: Record<string, { explanation: string; relatedTerms?: string[]; link?: string }> = {
  'Parquet': {
    explanation: 'Parquet is a columnar storage file format optimized for analytics. It provides efficient compression and encoding, making it ideal for data lakes and analytical workloads.',
    relatedTerms: ['Columnar storage', 'Data lake', 'Compression'],
  },
  'JWT': {
    explanation: 'JSON Web Token (JWT) is a compact, URL-safe token format used for authentication and authorization. It contains encoded user information and permissions.',
    relatedTerms: ['Authentication', 'Authorization', 'Token'],
  },
  'Canonical': {
    explanation: 'Canonical fields are standardized business terms that represent concepts consistently across different systems. They map to physical ERP columns but provide semantic meaning.',
    relatedTerms: ['Semantic layer', 'Field mapping', 'Business terms'],
  },
  'ELT': {
    explanation: 'Extract, Load, Transform - Modern data pipeline approach where data is loaded into storage first, then transformed on-demand. This is faster and more flexible than traditional ETL.',
    relatedTerms: ['ETL', 'Data pipeline', 'Schema-on-read'],
    link: '/guide/etl-vs-elt',
  },
  'ETL': {
    explanation: 'Extract, Transform, Load - Traditional data pipeline approach where data is transformed before being loaded into storage. This is slower but can pre-aggregate data.',
    relatedTerms: ['ELT', 'Data pipeline', 'Schema-on-write'],
    link: '/guide/etl-vs-elt',
  },
  'Schema-on-read': {
    explanation: 'Data structure is defined when querying, not when storing. This allows flexibility to handle schema changes and explore data without predefined structures.',
    relatedTerms: ['Schema-on-write', 'ELT', 'Data lake'],
  },
  'Schema-on-write': {
    explanation: 'Data structure is defined before storing. This requires predefined schemas but can provide faster queries on structured data.',
    relatedTerms: ['Schema-on-read', 'ETL', 'Data warehouse'],
  },
  'RBAC': {
    explanation: 'Role-Based Access Control - Security model where access is granted based on user roles. Each role has specific permissions for data and operations.',
    relatedTerms: ['Access control', 'Permissions', 'Security'],
  },
  'Data Lake': {
    explanation: 'A centralized repository that stores raw data in its native format. Data lakes use schema-on-read and are optimized for big data analytics.',
    relatedTerms: ['Data warehouse', 'S3 Bronze', 'Schema-on-read'],
  },
  'Bronze/Silver/Gold': {
    explanation: 'Data lake architecture layers: Bronze (raw data), Silver (cleaned/validated), Gold (aggregated/business-ready). This medallion architecture enables progressive data refinement.',
    relatedTerms: ['Data lake', 'Data quality', 'Medallion architecture'],
  },
};

export function CodeExplanationTooltip({ term, explanation, relatedTerms, link }: CodeExplanationTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors cursor-help"
      >
        <span className="underline decoration-dotted">{term}</span>
        <HelpCircle size={12} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-slate-900 border border-indigo-500/50 rounded-lg p-4 shadow-2xl z-50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-white">{term}</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{explanation}</p>
          {relatedTerms && relatedTerms.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Related Terms</div>
              <div className="flex flex-wrap gap-1">
                {relatedTerms.map((related, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>
          )}
          {link && (
            <a
              href={link}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Learn more →
            </a>
          )}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-500/50"></div>
        </div>
      )}
    </span>
  );
}

export function getTermExplanation(term: string): { explanation: string; relatedTerms?: string[]; link?: string } | null {
  return GLOSSARY[term] || null;
}

export function explainCodeBlock(code: string): string {
  // This would be used to automatically detect terms in code blocks and add explanations
  // For now, it's a placeholder
  return code;
}

