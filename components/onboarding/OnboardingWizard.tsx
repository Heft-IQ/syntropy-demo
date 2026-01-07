'use client';

import { useState } from 'react';
import { Database, Layers, CheckCircle, Play } from 'lucide-react';
import { FieldMappingStep } from './FieldMappingStep';
import { UNMATCHED_FIELDS } from '@/lib/data';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<'connect' | 'scanning' | 'mapping' | 'review'>('connect');
  const [progress, setProgress] = useState(0);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string | null>>({});

  const handleConnect = () => {
    setStep('scanning');
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Initialize mappings with null for all unmatched fields
          const initialMappings: Record<string, string | null> = {};
          UNMATCHED_FIELDS.forEach((field) => {
            initialMappings[field.id] = null;
          });
          setFieldMappings(initialMappings);
          setStep('mapping');
        }, 500);
      }
    }, 30);
  };

  const handleMappingChange = (fieldId: string, canonicalFieldId: string | null) => {
    setFieldMappings((prev) => ({
      ...prev,
      [fieldId]: canonicalFieldId,
    }));
  };

  const handleMappingContinue = () => {
    setStep('review');
  };

  return (
    <div className="h-full flex items-center justify-center p-6 text-slate-100 bg-slate-950 overflow-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
              <Layers size={20} />
            </div>
            <span className="font-bold text-lg">Syntropy Setup</span>
          </div>
          <div className="text-sm text-slate-500 font-medium">Day 0: Onboarding</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12 overflow-auto">
          {step === 'connect' && (
            <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Connect Data Source</h2>
                <p className="text-slate-400">Securely scan your ERP schema via dlt pipeline.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['NetSuite', 'Salesforce', 'SAP'].map((erp) => (
                  <button
                    key={erp}
                    onClick={handleConnect}
                    className="p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-indigo-500 hover:bg-slate-900 transition-all group"
                  >
                    <div className="text-2xl font-bold text-slate-600 group-hover:text-white mb-2">
                      {erp.charAt(0)}
                    </div>
                    <div className="text-sm font-bold text-slate-400 group-hover:text-white">{erp}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600">Connectors powered by dlt & Airbyte</p>
            </div>
          )}

          {step === 'scanning' && (
            <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <Database className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={32} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-2">Analyzing Schema...</div>
                <p className="text-slate-400 text-sm">Vectorizing columns for Knowledge Graph</p>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-slate-500 text-xs font-mono">Scanned {Math.floor(progress * 15.4)} tables...</p>
            </div>
          )}

          {step === 'mapping' && (
            <div className="w-full animate-fade-in">
              <FieldMappingStep
                unmatchedFields={UNMATCHED_FIELDS}
                onMappingChange={handleMappingChange}
                mappings={fieldMappings}
                onContinue={handleMappingContinue}
              />
            </div>
          )}

          {step === 'review' && (
            <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-lg shadow-green-500/20">
                <CheckCircle size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Auto-Discovery Complete</h2>
                <p className="text-slate-300">
                  We matched <span className="font-bold text-white">95%</span> of your columns automatically, and you
                  mapped <span className="font-bold text-white">{Object.values(fieldMappings).filter((m) => m !== null).length}</span> additional fields manually.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Total coverage: <span className="font-bold text-white">99%</span> of columns mapped to the Canonical SaaS Model.
                </p>
                <p className="text-slate-500 text-sm mt-2">142 Standard Metrics are ready to deploy.</p>
                {Object.values(fieldMappings).filter((m) => m !== null).length > 0 && (
                  <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg text-left">
                    <div className="text-xs text-slate-500 uppercase mb-2">Manual Mappings</div>
                    <div className="text-sm text-slate-300">
                      You successfully mapped {Object.values(fieldMappings).filter((m) => m !== null).length} field
                      {Object.values(fieldMappings).filter((m) => m !== null).length !== 1 ? 's' : ''} to canonical fields.
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onComplete}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 mx-auto transition-transform hover:scale-105"
              >
                Launch Intelligence Layer <Play size={18} fill="currentColor" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

