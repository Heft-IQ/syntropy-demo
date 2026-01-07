'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, XCircle, Lightbulb, ChevronRight, Database, Cloud, Settings, HardDrive } from 'lucide-react';
import { ETL_VS_ELT_CONTENT, ELT_IN_DEMO } from '@/lib/etl-vs-elt-content';

interface ETLvsELTExplainerProps {
  onClose?: () => void;
}

export function ETLvsELTExplainer({ onClose }: ETLvsELTExplainerProps) {
  const [activeTab, setActiveTab] = useState<'comparison' | 'why-elt' | 'in-demo'>('comparison');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {onClose && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">ETL vs ELT: Understanding the Paradigm Shift</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'comparison'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Comparison
        </button>
        <button
          onClick={() => setActiveTab('why-elt')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'why-elt'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Why ELT?
        </button>
        <button
          onClick={() => setActiveTab('in-demo')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'in-demo'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ELT in Our Demo
        </button>
      </div>

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ETL */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={20} className="text-red-400" />
                <h3 className="text-lg font-bold text-white">{ETL_VS_ELT_CONTENT.etl.name}</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">{ETL_VS_ELT_CONTENT.etl.description}</p>

              {/* Flow */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Flow</div>
                <div className="space-y-2">
                  {ETL_VS_ELT_CONTENT.etl.flow.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-xs font-bold text-red-400">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Characteristics */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Characteristics</div>
                <ul className="space-y-1">
                  {ETL_VS_ELT_CONTENT.etl.characteristics.map((char, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <div className="text-xs text-red-400 uppercase tracking-wider mb-2">Limitations</div>
                <ul className="space-y-1">
                  {ETL_VS_ELT_CONTENT.etl.cons.map((con, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ELT */}
            <div className="bg-slate-950 border border-indigo-500/50 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={20} className="text-indigo-400" />
                <h3 className="text-lg font-bold text-white">{ETL_VS_ELT_CONTENT.elt.name}</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">{ETL_VS_ELT_CONTENT.elt.description}</p>

              {/* Flow */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Flow</div>
                <div className="space-y-2">
                  {ETL_VS_ELT_CONTENT.elt.flow.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Characteristics */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Characteristics</div>
                <ul className="space-y-1">
                  {ETL_VS_ELT_CONTENT.elt.characteristics.map((char, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros */}
              <div>
                <div className="text-xs text-indigo-400 uppercase tracking-wider mb-2">Benefits</div>
                <ul className="space-y-1">
                  {ETL_VS_ELT_CONTENT.elt.pros.map((pro, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Key Differences Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <h3 className="text-lg font-bold text-white mb-4">Key Differences</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Aspect</th>
                    <th className="text-left py-3 px-4 text-red-400 font-semibold">ETL</th>
                    <th className="text-left py-3 px-4 text-indigo-400 font-semibold">ELT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ETL_VS_ELT_CONTENT.keyDifferences.map((diff, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 text-white font-medium">{diff.aspect}</td>
                      <td className="py-3 px-4 text-slate-300">{diff.etl}</td>
                      <td className="py-3 px-4 text-slate-300">{diff.elt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Why ELT Tab */}
      {activeTab === 'why-elt' && (
        <div className="space-y-4">
          <div className="bg-indigo-600/10 border border-indigo-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Why We Use ELT</h3>
                <p className="text-slate-300 text-sm">
                  ELT is the modern standard for data platforms. It provides flexibility, speed, and cost efficiency that ETL cannot match.
                </p>
              </div>
            </div>
          </div>

          {ETL_VS_ELT_CONTENT.whyELT.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">{item.benefit}</h4>
                  <p className="text-slate-300 text-sm mb-3 leading-relaxed">{item.explanation}</p>
                  {item.example && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <div className="text-xs text-indigo-400 uppercase tracking-wider mb-1">Example</div>
                      <p className="text-sm text-slate-300">{item.example}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ELT in Demo Tab */}
      {activeTab === 'in-demo' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <h3 className="text-lg font-bold text-white mb-2">{ELT_IN_DEMO.title}</h3>
            <p className="text-slate-300 text-sm">{ELT_IN_DEMO.description}</p>
          </div>

          {/* Flow Steps */}
          <div className="space-y-4">
            {ELT_IN_DEMO.flow.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 border-2 border-indigo-500/50 flex items-center justify-center">
                    {idx === 0 && <Cloud size={20} className="text-indigo-400" />}
                    {idx === 1 && <Settings size={20} className="text-indigo-400" />}
                    {idx === 2 && <HardDrive size={20} className="text-indigo-400" />}
                    {idx === 3 && <Database size={20} className="text-indigo-400" />}
                  </div>
                  {idx < ELT_IN_DEMO.flow.length - 1 && (
                    <div className="w-0.5 h-8 bg-indigo-500/30 my-1"></div>
                  )}
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-semibold text-white">{step.component}</h4>
                    <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">
                      {step.dataFormat}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{step.action}</p>
                  <p className="text-xs text-indigo-400 italic">{step.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Points */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <h3 className="text-lg font-bold text-white mb-4">Key Points</h3>
            <ul className="space-y-2">
              {ELT_IN_DEMO.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

