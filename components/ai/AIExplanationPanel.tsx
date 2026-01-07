'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, Info, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AIExplanation } from '@/types';
import { CANONICAL_FIELDS } from '@/lib/data';

interface AIExplanationPanelProps {
  explanation: AIExplanation;
  fieldName: string;
  suggestedFieldName: string;
}

export function AIExplanationPanel({ explanation, fieldName, suggestedFieldName }: AIExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfidenceColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-500/10';
    if (value >= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-400" />
          <span className="text-sm font-bold text-blue-400">AI Suggestion Explanation</span>
          <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceBgColor(explanation.confidence)} ${getConfidenceColor(explanation.confidence)}`}>
            {explanation.confidence}% confidence
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <div className="text-sm text-slate-300">{explanation.reasoning}</div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase mb-3">Confidence Breakdown</div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Field Name Similarity</span>
                  <span className={`text-xs font-bold ${getConfidenceColor(explanation.breakdown.fieldNameSimilarity)}`}>
                    {explanation.breakdown.fieldNameSimilarity}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getConfidenceBgColor(explanation.breakdown.fieldNameSimilarity)}`}
                    style={{ width: `${explanation.breakdown.fieldNameSimilarity}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Data Type Match</span>
                  <span className={`text-xs font-bold ${getConfidenceColor(explanation.breakdown.dataTypeMatch)}`}>
                    {explanation.breakdown.dataTypeMatch}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getConfidenceBgColor(explanation.breakdown.dataTypeMatch)}`}
                    style={{ width: `${explanation.breakdown.dataTypeMatch}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Context Clues</span>
                  <span className={`text-xs font-bold ${getConfidenceColor(explanation.breakdown.contextClues)}`}>
                    {explanation.breakdown.contextClues}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getConfidenceBgColor(explanation.breakdown.contextClues)}`}
                    style={{ width: `${explanation.breakdown.contextClues}%` }}
                  ></div>
                </div>
              </div>

              {explanation.breakdown.historicalPatterns && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Historical Patterns</span>
                    <span className={`text-xs font-bold ${getConfidenceColor(explanation.breakdown.historicalPatterns)}`}>
                      {explanation.breakdown.historicalPatterns}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getConfidenceBgColor(explanation.breakdown.historicalPatterns)}`}
                      style={{ width: `${explanation.breakdown.historicalPatterns}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {explanation.alternatives && explanation.alternatives.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase mb-3">Alternative Suggestions</div>
              <div className="space-y-2">
                {explanation.alternatives.map((alt, idx) => {
                  const canonicalField = CANONICAL_FIELDS.find((cf) => cf.id === alt.canonicalFieldId);
                  return (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{canonicalField?.name || 'Unknown'}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceBgColor(alt.confidence)} ${getConfidenceColor(alt.confidence)}`}>
                          {alt.confidence}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{alt.reason}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {explanation.learningIndicator && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-indigo-400" />
                <span className="text-xs font-bold text-indigo-400">AI Learning</span>
              </div>
              <p className="text-xs text-indigo-200">
                Based on {explanation.learningIndicator.basedOnMappings} similar mappings. Confidence improved{' '}
                {explanation.learningIndicator.improvement}% over time.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

