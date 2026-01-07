'use client';

import { GuideSection } from '@/lib/user-guide-content';
import { CheckCircle, Lightbulb, Code, ArrowRight } from 'lucide-react';

interface UserGuideContentProps {
  section: GuideSection;
}

export function UserGuideContent({ section }: UserGuideContentProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{section.icon}</span>
          <h1 className="text-3xl font-bold text-white">{section.title}</h1>
        </div>
        {section.content.overview && (
          <p className="text-slate-300 text-lg mt-4 leading-relaxed">{section.content.overview}</p>
        )}
      </div>

      {/* Steps */}
      {section.content.steps && section.content.steps.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ArrowRight size={20} className="text-indigo-400" />
            Step-by-Step Guide
          </h2>
          <div className="space-y-4">
            {section.content.steps.map((step, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{step.description}</p>
                    {step.tip && (
                      <div className="mt-3 flex items-start gap-2 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
                        <Lightbulb size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                            Tip
                          </div>
                          <p className="text-sm text-indigo-300">{step.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {section.content.features && section.content.features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-400" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.content.features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
              >
                <h3 className="text-base font-semibold text-white mb-2">{feature.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {section.content.examples && section.content.examples.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Code size={20} className="text-blue-400" />
            Examples
          </h2>
          <div className="space-y-4">
            {section.content.examples.map((example, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-lg p-5"
              >
                <h3 className="text-base font-semibold text-white mb-3">{example.title}</h3>
                <pre className="bg-black rounded-lg p-4 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                  {example.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

