'use client';

import { useState } from 'react';
import {
  GitCompare,
  X,
  Activity,
  Database,
  TrendingDown,
  TrendingUp,
  Calendar,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Metric, SimulationData } from '@/types';
import { SIMULATION_DATA } from '@/lib/data';

interface ImpactReviewModalProps {
  approvalItem: Metric | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function ImpactReviewModal({ approvalItem, onClose, onApprove, onReject }: ImpactReviewModalProps) {
  const [activeTab, setActiveTab] = useState<'impact' | 'code'>('impact');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  if (!approvalItem) return null;

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 2000);
  };

  const calculateVariance = (oldVal: number, newVal: number) => {
    if (!oldVal) return 0;
    return (((newVal - oldVal) / oldVal) * 100).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in font-sans text-slate-100">
      <div className="bg-slate-900 w-full max-w-5xl h-[80vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
              <GitCompare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Review: {approvalItem.name}
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  v2.1 Candidate
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Proposed by {approvalItem.requester || 'Unknown'} • {approvalItem.timestamp || 'Just now'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Analysis Tools</div>
            <button
              onClick={() => setActiveTab('impact')}
              className={`w-full text-left px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${
                activeTab === 'impact'
                  ? 'bg-indigo-500/10 border-indigo-500/50 text-white'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Activity size={18} className={activeTab === 'impact' ? 'text-indigo-400' : 'text-slate-500'} />
              <span className="text-sm font-medium">Data Impact</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`w-full text-left px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${
                activeTab === 'code'
                  ? 'bg-indigo-500/10 border-indigo-500/50 text-white'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Database size={18} className={activeTab === 'code' ? 'text-indigo-400' : 'text-slate-500'} />
              <span className="text-sm font-medium">SQL & Logic</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-900 relative p-8">
            {activeTab === 'impact' && (
              <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Historical Impact Simulation</h3>
                  <p className="text-slate-400 text-sm">
                    Running <span className="text-green-400">Proposed Logic</span> against production snapshot.
                  </p>
                </div>

                {!simulationComplete ? (
                  <div className="h-64 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                    {isSimulating ? (
                      <>
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-indigo-400 text-sm font-mono animate-pulse">
                          Running Queries on Tinybird (3.2TB scanned)...
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-2">
                          <Activity size={32} className="text-slate-500" />
                        </div>
                        <button
                          onClick={runSimulation}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all"
                        >
                          Run Impact Simulation
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs uppercase font-bold mb-1">Total Variance</div>
                        <div className="text-2xl font-bold text-red-400 flex items-center gap-2">
                          <TrendingDown size={20} /> -4.2%
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs uppercase font-bold mb-1">Row Count</div>
                        <div className="text-2xl font-bold text-white">-1,240</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs uppercase font-bold mb-1">Latency</div>
                        <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                          <TrendingUp size={20} /> +15ms
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                      <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500" /> Quarterly Comparison
                      </h4>
                      <div className="space-y-6">
                        {SIMULATION_DATA.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>{item.period}</span>
                              <span className="text-red-400 font-mono">
                                {calculateVariance(item.old, item.new)}%
                              </span>
                            </div>
                            <div className="h-8 flex gap-1">
                              <div className="h-full bg-slate-700 rounded-l-md" style={{ width: '50%' }}></div>
                              <div
                                className="h-full bg-indigo-600 rounded-r-md"
                                style={{ width: `${(item.new / item.old) * 50}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'code' && (
              <div className="p-8 max-w-4xl mx-auto animate-fade-in">
                <div className="bg-black rounded-xl border border-slate-800 overflow-hidden p-4">
                  <pre className="text-xs font-mono leading-relaxed text-blue-300">
                    {approvalItem.code || 'No code available'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-20 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Info size={16} />
            <span>Simulation run on production snapshot (1 hour ago)</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onReject}
              className="px-6 py-2.5 text-slate-300 hover:text-white border border-transparent hover:border-red-500/20 rounded-xl text-sm font-medium transition-all"
            >
              Reject Changes
            </button>
            <button
              onClick={onApprove}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <CheckCircle size={18} /> Approve & Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

