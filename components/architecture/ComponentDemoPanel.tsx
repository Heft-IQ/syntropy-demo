'use client';

import { X, Code, Activity, BarChart2, GitBranch } from 'lucide-react';
import { ComponentDemo } from '@/types';

interface ComponentDemoPanelProps {
  demo: ComponentDemo | null;
  onClose: () => void;
}

export function ComponentDemoPanel({ demo, onClose }: ComponentDemoPanelProps) {
  if (!demo) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in">
      <div className="bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{demo.name}</h2>
            <p className="text-sm text-slate-400">{demo.responsibility}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-slate-300">{demo.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {demo.examples.data && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Code size={18} className="text-blue-400" />
                  <h3 className="text-sm font-bold text-white">{demo.examples.data.title}</h3>
                </div>
                <pre className="text-xs font-mono text-slate-300 bg-black rounded-lg p-4 overflow-x-auto">
                  {demo.examples.data.content}
                </pre>
              </div>
            )}

            {demo.examples.process && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch size={18} className="text-green-400" />
                  <h3 className="text-sm font-bold text-white">{demo.examples.process.title}</h3>
                </div>
                <div className="space-y-3">
                  {demo.examples.process.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white mb-1">{step.step}</div>
                        <div className="text-xs text-slate-400">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demo.examples.metrics && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={18} className="text-purple-400" />
                  <h3 className="text-sm font-bold text-white">{demo.examples.metrics.title}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {demo.examples.metrics.stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                      <div className="text-xs text-slate-500 uppercase mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                        {stat.unit && <span className="text-sm text-slate-400 ml-1">{stat.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

