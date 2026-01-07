'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, Search, Sparkles, X, Info } from 'lucide-react';
import { UnmatchedField, CanonicalField } from '@/types';
import { CANONICAL_FIELDS, AI_EXPLANATIONS } from '@/lib/data';
import { AIExplanationPanel } from '@/components/ai/AIExplanationPanel';

interface FieldMappingStepProps {
  unmatchedFields: UnmatchedField[];
  onMappingChange: (fieldId: string, canonicalFieldId: string | null) => void;
  mappings: Record<string, string | null>;
  onContinue: () => void;
}

export function FieldMappingStep({
  unmatchedFields,
  onMappingChange,
  mappings,
  onContinue,
}: FieldMappingStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedField, setExpandedField] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(CANONICAL_FIELDS.map((f) => f.category));
    return Array.from(cats);
  }, []);

  const filteredCanonicalFields = useMemo(() => {
    return CANONICAL_FIELDS.filter((field) => {
      const matchesSearch =
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const mappedCount = Object.values(mappings).filter((m) => m !== null).length;
  const totalFields = unmatchedFields.length;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      revenue: 'bg-green-500/10 text-green-400 border-green-500/20',
      customer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      product: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      location: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      subscription: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      financial: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      sales: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    };
    return colors[category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <div className="w-full max-w-6xl space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Map Unmatched Fields</h2>
        <p className="text-slate-400">
          We found {totalFields} fields that need manual mapping to our canonical model.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
            <div className="text-xs text-slate-500 uppercase mb-1">Progress</div>
            <div className="text-lg font-bold text-white">
              {mappedCount} / {totalFields} mapped
            </div>
          </div>
          <div className="h-12 w-1 bg-slate-800"></div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
            <div className="text-xs text-slate-500 uppercase mb-1">Completion</div>
            <div className="text-lg font-bold text-indigo-400">
              {Math.round((mappedCount / totalFields) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {unmatchedFields.map((field) => {
            const isMapped = mappings[field.id] !== null && mappings[field.id] !== undefined;
            const selectedCanonical = mappings[field.id]
              ? CANONICAL_FIELDS.find((cf) => cf.id === mappings[field.id]!)
              : null;
            const isExpanded = expandedField === field.id;

            return (
              <div
                key={field.id}
                className={`bg-slate-900 border rounded-xl p-4 transition-all ${
                  isMapped
                    ? 'border-green-500/50 bg-green-500/5'
                    : field.suggestedMapping
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{field.sourceField}</span>
                      {isMapped && (
                        <CheckCircle size={16} className="text-green-400" />
                      )}
                      {field.suggestedMapping && !isMapped && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
                          <Sparkles size={12} />
                          <span>AI Suggested</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 space-x-3">
                      <span>Table: {field.sourceTable}</span>
                      <span>•</span>
                      <span>Type: {field.dataType}</span>
                      {field.sampleValue && (
                        <>
                          <span>•</span>
                          <span>Sample: {field.sampleValue}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isMapped && (
                    <button
                      onClick={() => onMappingChange(field.id, null)}
                      className="text-slate-500 hover:text-white transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {field.suggestedMapping && !isMapped && AI_EXPLANATIONS[field.id] && (
                  <div className="mb-3">
                    <AIExplanationPanel
                      explanation={AI_EXPLANATIONS[field.id]}
                      fieldName={field.sourceField}
                      suggestedFieldName={field.suggestedMapping}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {selectedCanonical ? (
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{selectedCanonical.name}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(selectedCanonical.category)}`}
                            >
                              {selectedCanonical.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{selectedCanonical.description}</p>
                        </div>
                        <CheckCircle size={20} className="text-green-400" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setExpandedField(isExpanded ? null : field.id)}
                        className="w-full text-left bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-indigo-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">
                            {field.suggestedMapping
                              ? `Suggested: ${field.suggestedMapping} (${field.confidence}% confidence)`
                              : 'Select canonical field...'}
                          </span>
                          <span className="text-slate-500 text-xs">▼</span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-64 overflow-y-auto">
                          <div className="space-y-2">
                            {filteredCanonicalFields.length === 0 ? (
                              <div className="text-center text-slate-500 text-sm py-4">
                                No fields found. Try a different search.
                              </div>
                            ) : (
                              filteredCanonicalFields.map((canonical) => (
                                <button
                                  key={canonical.id}
                                  onClick={() => {
                                    onMappingChange(field.id, canonical.id);
                                    setExpandedField(null);
                                  }}
                                  className="w-full text-left p-2 rounded hover:bg-slate-900 transition-colors border border-transparent hover:border-indigo-500/50"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white text-sm">
                                          {canonical.name}
                                        </span>
                                        <span
                                          className={`text-xs px-1.5 py-0.5 rounded border ${getCategoryColor(canonical.category)}`}
                                        >
                                          {canonical.category}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500">{canonical.description}</p>
                                    </div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {field.suggestedMapping && !isMapped && (
                  <button
                    onClick={() => {
                      const suggested = CANONICAL_FIELDS.find((cf) => cf.name === field.suggestedMapping);
                      if (suggested) {
                        onMappingChange(field.id, suggested.id);
                      }
                    }}
                    className="mt-2 w-full text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg py-2 transition-colors"
                  >
                    Accept Suggestion: {field.suggestedMapping}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-4">
            <h3 className="text-sm font-bold text-white mb-4">Search Canonical Fields</h3>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fields..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase mb-2">Filter by Category</div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-500 mb-2">Available Fields</div>
              <div className="text-lg font-bold text-white">{filteredCanonicalFields.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            unmatchedFields.forEach((field) => {
              if (field.suggestedMapping) {
                const suggested = CANONICAL_FIELDS.find((cf) => cf.name === field.suggestedMapping);
                if (suggested && !mappings[field.id]) {
                  onMappingChange(field.id, suggested.id);
                }
              }
            });
          }}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-800 hover:border-indigo-500/50 rounded-lg transition-colors"
        >
          Accept All Suggestions
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue ({mappedCount}/{totalFields} mapped)
        </button>
      </div>
    </div>
  );
}

