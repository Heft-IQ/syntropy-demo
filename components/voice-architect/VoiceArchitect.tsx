'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  X,
  CheckCircle,
  Sparkles,
  TrendingDown,
  TrendingUp,
  BookOpen,
  Activity,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { Metric, Draft, SimulationResult } from '@/types';

interface VoiceArchitectProps {
  onClose: () => void;
  onSubmit: (draft: Draft) => void;
  initialRule?: Metric | null;
}

type Step = 'idle' | 'listening' | 'processing' | 'simulating' | 'diff_view' | 'success';

export function VoiceArchitect({ onClose, onSubmit, initialRule }: VoiceArchitectProps) {
  const [step, setStep] = useState<Step>('idle');
  const [mode, setMode] = useState<'create' | 'revise'>(initialRule ? 'revise' : 'create');
  const [transcript, setTranscript] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [simResults, setSimResults] = useState<SimulationResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialRule) {
      setMode('revise');
    }
  }, [initialRule]);

  useEffect(() => {
    if (step !== 'listening') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = 60;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const center = canvas.height / 2;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const noise = Math.random() * 0.5 + 0.5;
        const wave = Math.sin(i * 0.2 + Date.now() * 0.01) * 20;
        const height = (Math.random() * 30 + 5 + wave) * noise;
        const gradient = ctx.createLinearGradient(0, center - height, 0, center + height);
        gradient.addColorStop(0, mode === 'create' ? '#818cf8' : '#fb923c');
        gradient.addColorStop(1, mode === 'create' ? '#c084fc' : '#f472b6');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(i * barWidth + 2, center - height / 2, barWidth - 2, height, 4);
        } else {
          ctx.fillRect(i * barWidth + 2, center - height / 2, barWidth - 2, height);
        }
        ctx.fill();
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [step, mode]);

  const handleStartListening = () => {
    setStep('listening');
    setTranscript('');

    const phrases =
      mode === 'create'
        ? ['Define', ' Adjusted EBITDA', ' as Operating Income', ' plus Depreciation', ' excluding', ' UK Subsidiaries.']
        : [`Update ${initialRule?.name}`, ' to exclude', ' all orders', ' from the', ' Trial Region.'];

    let currentText = '';
    phrases.forEach((phrase, i) => {
      setTimeout(() => {
        currentText += phrase;
        setTranscript(currentText);
      }, 500 * (i + 1));
    });
  };

  const handleStopListening = () => {
    setStep('processing');

    setTimeout(() => {
      let generatedDraft: Draft;

      if (mode === 'create') {
        generatedDraft = {
          name: 'Adjusted EBITDA',
          logic: 'Operating Income + Depreciation - UK Subsidiaries',
          justification: 'Voice Command: Define new financial KPI',
          code: `measures: {\n  adj_ebitda: {\n    sql: \`\${op_income} + \${depreciation}\`,\n    filters: [{ sql: \`\${subsidiary} != 'UK'\` }]\n  }\n}`,
          diff: null,
        };
      } else {
        generatedDraft = {
          name: initialRule?.name || '',
          logic: `${initialRule?.def} (Excluding Trial Region)`,
          justification: 'User requested update to exclusion logic via Voice.',
          code: `measures: {\n  ${initialRule?.name.toLowerCase().replace(' ', '_')}: {\n    filters: [{ sql: \`\${region} != 'Trial'\` }]\n  }\n}`,
          diff: {
            old: initialRule?.def || '',
            new: `${initialRule?.def} AND Region != 'Trial'`,
          },
        };
      }
      setDraft(generatedDraft);

      setStep('simulating');
      setTimeout(() => {
        setSimResults({
          variance: -4.2,
          rowCountDelta: -1240,
          performance: '+15ms',
          isSignificant: true,
        });
        setStep('diff_view');
      }, 2000);
    }, 2000);
  };

  const handleConfirmSubmit = () => {
    setStep('success');
    setTimeout(() => {
      if (onSubmit && draft) onSubmit(draft);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-fade-in font-sans text-slate-100">
      <div className="bg-slate-900 w-full max-w-5xl h-[700px] rounded-3xl border border-slate-800 shadow-2xl flex overflow-hidden relative">
        <div className="flex-1 flex flex-col relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
          <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${step === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
              ></div>
              <span className="text-slate-400 font-medium text-sm tracking-wide">SYNTROPY VOICE ARCHITECT</span>
            </div>
            <button onClick={onClose}>
              <X size={20} className="text-slate-500 hover:text-white transition-colors" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
            {step === 'idle' && (
              <div className="text-center space-y-8 animate-fade-in-up">
                <button
                  onClick={handleStartListening}
                  className={`group relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    mode === 'create'
                      ? 'hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]'
                      : 'hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]'
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-full border-2 opacity-20 group-hover:scale-110 transition-transform ${
                      mode === 'create' ? 'border-indigo-500' : 'border-orange-500'
                    }`}
                  ></div>
                  <Mic
                    size={40}
                    className={`relative z-10 transition-colors ${
                      mode === 'create' ? 'text-indigo-400 group-hover:text-white' : 'text-orange-400 group-hover:text-white'
                    }`}
                  />
                </button>
                <div>
                  <h2 className="text-3xl font-light text-white mb-2">
                    {mode === 'create' ? 'What would you like to define?' : `Revise "${initialRule?.name}"`}
                  </h2>
                  <p className="text-slate-500">Tap to speak to the Syntropy Agent</p>
                </div>
              </div>
            )}

            {step === 'listening' && (
              <div className="flex flex-col items-center space-y-8 w-full">
                <canvas ref={canvasRef} width={600} height={150} className="w-full max-w-lg opacity-80" />
                <p className="text-2xl text-white font-light text-center px-4">
                  &quot;{transcript}
                  <span className="animate-pulse">_</span>&quot;
                </p>
                <button
                  onClick={handleStopListening}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-medium border border-slate-700 transition-colors"
                >
                  <Square size={12} fill="currentColor" /> Stop Listening
                </button>
              </div>
            )}

            {step === 'processing' && (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="text-center">
                  <h3 className="text-white font-medium text-lg">Processing Intent...</h3>
                  <span className="text-slate-400 text-sm">Mapping to FalkorDB Knowledge Graph</span>
                </div>
              </div>
            )}

            {step === 'simulating' && (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="text-center">
                  <h3 className="text-white font-medium text-lg">Running Impact Simulation...</h3>
                  <span className="text-slate-400 text-sm">Testing logic against 1.2M production rows (Tinybird)</span>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4 animate-scale-up">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-white font-bold text-2xl">Submitted</h3>
                <p className="text-slate-400">Rule draft sent for approval.</p>
              </div>
            )}

            {step === 'diff_view' && draft && (
              <div className="w-full max-w-2xl space-y-6 animate-fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Sparkles size={12} className="text-purple-400" /> AI Generated Logic
                  </div>
                  <div className="text-base text-slate-200">{draft.logic}</div>
                </div>

                {simResults && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Impact</div>
                      <div
                        className={`text-xl font-bold ${
                          simResults.variance < 0 ? 'text-red-400' : 'text-green-400'
                        } flex items-center gap-1`}
                      >
                        {simResults.variance < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                        {Math.abs(simResults.variance)}%
                      </div>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Rows Affected</div>
                      <div className="text-xl font-bold text-white">{simResults.rowCountDelta}</div>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Latency</div>
                      <div className="text-xl font-bold text-green-400">{simResults.performance}</div>
                    </div>
                  </div>
                )}

                {draft.diff && (
                  <div className="bg-black rounded-xl border border-slate-800 text-xs font-mono p-4">
                    <div className="text-red-400 line-through mb-1 flex gap-2">
                      <span className="select-none text-slate-600">-</span> {draft.diff.old}
                    </div>
                    <div className="text-green-400 flex gap-2">
                      <span className="select-none text-slate-600">+</span> {draft.diff.new}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center pt-4">
                  <button
                    onClick={() => setStep('idle')}
                    className="px-6 py-3 text-slate-400 hover:text-white text-sm hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                  >
                    <UserCheck size={18} /> Submit for Approval
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-[350px] bg-slate-950/50 border-l border-slate-800 flex flex-col hidden lg:flex">
          <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} /> {step === 'diff_view' ? 'Review Context' : 'Knowledge Base'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {step === 'diff_view' && simResults ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                    <Activity size={16} /> Simulation Complete
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    We ran this draft against 1.2M rows of production data from Q3.
                  </p>
                </div>

                {simResults.isSignificant && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm mb-2">
                      <AlertTriangle size={16} /> Significant Change
                    </div>
                    <p className="text-xs text-yellow-200 leading-relaxed">
                      This rule changes Revenue by &gt;4%. Approval will require VP-level sign-off.
                    </p>
                  </div>
                )}

                {draft && (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Generated Cube.js</div>
                    <pre className="text-[10px] text-blue-300 font-mono overflow-x-auto">{draft.code}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 text-sm mt-10">
                {step === 'simulating' ? 'Calculating Impact...' : 'Speak to generate draft...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

