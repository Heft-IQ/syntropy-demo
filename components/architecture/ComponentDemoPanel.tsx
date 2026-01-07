'use client';

import { X, Code, Activity, BarChart2, GitBranch, Network, Link2 } from 'lucide-react';
import { ComponentDemo, ComponentType } from '@/types';
import { COMPONENT_DEMOS } from '@/lib/data';

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
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{demo.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  demo.category === 'data-source' ? 'bg-slate-600' :
                  demo.category === 'etl' ? 'bg-blue-600' :
                  demo.category === 'storage' ? 'bg-amber-600' :
                  demo.category === 'compute' ? 'bg-yellow-600' :
                  demo.category === 'api-gateway' ? 'bg-indigo-600' :
                  demo.category === 'control-plane' ? 'bg-green-600' :
                  demo.category === 'auth' ? 'bg-purple-600' :
                  'bg-pink-600'
                } text-white`}>
                  {demo.category === 'data-source' ? 'Data Source' :
                   demo.category === 'etl' ? 'ETL' :
                   demo.category === 'storage' ? 'Storage' :
                   demo.category === 'compute' ? 'Compute' :
                   demo.category === 'api-gateway' ? 'API Gateway' :
                   demo.category === 'control-plane' ? 'Control Plane' :
                   demo.category === 'auth' ? 'Auth' :
                   'Frontend'}
                </span>
              </div>
              <p className="text-sm text-slate-400">{demo.responsibility}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-slate-300">{demo.description}</p>
          </div>

          {demo.architectureContext && (
            <div className="mb-6 bg-slate-950 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Network size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">How This Component Fits</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Position</div>
                  <div className="text-sm text-slate-300">{demo.architectureContext.position}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-1">Interacts With</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {demo.architectureContext.interactions.map((compId) => {
                      const comp = COMPONENT_DEMOS[compId];
                      return comp ? (
                        <span key={compId} className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300">
                          {comp.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase mb-1">Data Flow In</div>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {demo.architectureContext.dataFlowIn.map((flow, idx) => (
                        <li key={idx}>• {flow}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase mb-1">Data Flow Out</div>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {demo.architectureContext.dataFlowOut.map((flow, idx) => (
                        <li key={idx}>• {flow}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {demo.dependencies && (
            <div className="mb-6 bg-slate-950 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Link2 size={18} className="text-orange-400" />
                <h3 className="text-sm font-bold text-white">Dependencies</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-2">Depends On</div>
                  <div className="flex flex-wrap gap-2">
                    {demo.dependencies.dependsOn.length > 0 ? (
                      demo.dependencies.dependsOn.map((compId) => {
                        const comp = COMPONENT_DEMOS[compId];
                        return comp ? (
                          <span key={compId} className="text-xs px-2 py-1 bg-blue-600/20 border border-blue-600/50 rounded text-blue-300">
                            {comp.name}
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-xs text-slate-600 italic">None</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase mb-2">Depended By</div>
                  <div className="flex flex-wrap gap-2">
                    {demo.dependencies.dependedBy.length > 0 ? (
                      demo.dependencies.dependedBy.map((compId) => {
                        const comp = COMPONENT_DEMOS[compId];
                        return comp ? (
                          <span key={compId} className="text-xs px-2 py-1 bg-green-600/20 border border-green-600/50 rounded text-green-300">
                            {comp.name}
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-xs text-slate-600 italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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

