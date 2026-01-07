'use client';

import { useState } from 'react';
import { BookOpen, ChevronRight, Code, Lightbulb } from 'lucide-react';
import { USE_CASE_SCENARIOS, UseCaseScenario } from '@/lib/use-case-scenarios';
import { AICodeBlock } from '@/components/ai-architect/AICodeBlock';

interface UseCaseScenariosProps {
  onClose?: () => void;
}

export function UseCaseScenarios({ onClose }: UseCaseScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<UseCaseScenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | UseCaseScenario['category']>('all');

  const filteredScenarios = selectedCategory === 'all'
    ? USE_CASE_SCENARIOS
    : USE_CASE_SCENARIOS.filter(s => s.category === selectedCategory);

  const categoryLabels: Record<UseCaseScenario['category'], string> = {
    elt: 'ELT Workflows',
    troubleshooting: 'Troubleshooting',
    governance: 'Governance',
    integration: 'Integration',
  };

  if (selectedScenario) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedScenario(null)}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Scenarios
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{selectedScenario.title}</h2>
          <p className="text-slate-300 mb-4">{selectedScenario.description}</p>
          <span className="inline-block px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 rounded-full text-xs font-semibold">
            {categoryLabels[selectedScenario.category]}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ChevronRight size={18} className="text-indigo-400" />
            Step-by-Step Workflow
          </h3>
          {selectedScenario.steps.map((step) => (
            <div
              key={step.step}
              className="bg-slate-950 border border-slate-800 rounded-lg p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-semibold text-white">{step.title}</h4>
                    {step.component && (
                      <span className="text-xs px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">
                        {step.component}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{step.description}</p>
                  {step.codeExample && (
                    <div className="mt-3">
                      <AICodeBlock
                        block={{
                          language: step.codeExample.includes('CREATE') ? 'cypher' : 'python',
                          code: step.codeExample,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-600/10 border border-indigo-500/50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Key Takeaways</h3>
          </div>
          <ul className="space-y-2">
            {selectedScenario.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-indigo-400 mt-1">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Related Components</h3>
          <div className="flex flex-wrap gap-2">
            {selectedScenario.relatedComponents.map((component) => (
              <span
                key={component}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300"
              >
                {component}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      {onClose && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-400" />
            Real-World Use Case Scenarios
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Scenarios
        </button>
        {Object.entries(categoryLabels).map(([category, label]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as UseCaseScenario['category'])}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scenarios List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario)}
            className="text-left bg-slate-950 border border-slate-800 rounded-lg p-5 hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{scenario.title}</h3>
              <span className="text-xs px-2 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 rounded">
                {categoryLabels[scenario.category]}
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">{scenario.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {scenario.steps.length} steps
              </span>
              <ChevronRight size={16} className="text-indigo-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

