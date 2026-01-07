'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  Settings,
  HardDrive,
  User,
  Key,
  Box,
  Activity,
  Cloud,
  FileJson,
} from 'lucide-react';
import { ComponentType } from '@/types';
import { COMPONENT_DEMOS } from '@/lib/data';
import { ComponentDemoPanel } from './ComponentDemoPanel';

type FlowType = 'idle' | 'ingest' | 'query' | 'auth';

interface Node {
  x: number;
  y: number;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  id: ComponentType;
}

export function ArchitectureVis() {
  const [activeFlow, setActiveFlow] = useState<FlowType>('idle');
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);

  const nodes: Record<string, Node> = {
    erp: { x: 15, y: 20, label: 'ERP (NetSuite)', icon: Cloud, color: 'text-slate-400', id: 'erp' },
    worker: { x: 35, y: 20, label: 'dlt Worker', icon: Settings, color: 'text-blue-400', id: 'worker' },
    s3: { x: 55, y: 20, label: 'S3 Bronze', icon: HardDrive, color: 'text-amber-500', id: 's3' },
    tinybird: { x: 80, y: 50, label: 'Tinybird (Silver/Gold)', icon: Database, color: 'text-yellow-500', id: 'tinybird' },
    user: { x: 15, y: 80, label: 'User / Dashboard', icon: User, color: 'text-white', id: 'user' },
    clerk: { x: 35, y: 80, label: 'Clerk Auth', icon: Key, color: 'text-blue-300', id: 'clerk' },
    cube: { x: 55, y: 80, label: 'Cube Gateway', icon: Box, color: 'text-indigo-400', id: 'cube' },
    falkordb: { x: 80, y: 80, label: 'FalkorDB Graph', icon: Activity, color: 'text-green-400', id: 'falkordb' },
  };

  const startFlow = (flow: FlowType) => {
    setActiveFlow(flow);
    setStep(0);
    setLogs([]);
  };

  useEffect(() => {
    if (activeFlow === 'idle') return;

    const flowSteps: Record<FlowType, string[]> = {
      idle: [],
      ingest: [
        'Extracting from ERP API...',
        'dlt normalizing JSON...',
        'Writing Parquet to S3...',
        'Tinybird Auto-Ingest Triggered.',
        'Data Available (Silver Layer)',
      ],
      query: [
        'User requests Metric...',
        'Cube checks Permissions (Clerk)...',
        'Cube resolves Schema (FalkorDB)...',
        'Query pushed to Tinybird...',
        'Response served.',
      ],
      auth: [
        'User logs in...',
        'Clerk issues JWT...',
        'Session validated...',
        'Graph Permissions loaded.',
      ],
    };

    const currentSteps = flowSteps[activeFlow] || [];

    const timer = setTimeout(() => {
      if (step < currentSteps.length) {
        setLogs((prev) => [...prev, currentSteps[step]]);
        setStep((s) => s + 1);
      } else {
        setTimeout(() => setActiveFlow('idle'), 1500);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [activeFlow, step]);

  const getActivePath = () => {
    switch (activeFlow) {
      case 'ingest':
        return 'M150,80 L350,80 L550,80 L800,200';
      case 'query':
        return 'M150,320 L550,320 L800,320 L800,200';
      case 'auth':
        return 'M150,320 L350,320 L550,320';
      default:
        return '';
    }
  };

  return (
    <div className="h-full bg-slate-900 text-slate-100 p-8 flex flex-col items-center overflow-auto">
      <div className="w-full max-w-6xl mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          System Architecture
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => startFlow('ingest')}
            disabled={activeFlow !== 'idle'}
            className="px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/50 rounded-lg text-sm font-medium hover:bg-amber-600/40 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <FileJson size={14} /> Simulate Ingestion
          </button>
          <button
            onClick={() => startFlow('query')}
            disabled={activeFlow !== 'idle'}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            Simulate Query
          </button>
          <button
            onClick={() => startFlow('auth')}
            disabled={activeFlow !== 'idle'}
            className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            Simulate Auth
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-6xl h-[500px] bg-slate-800/50 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
            <marker id="arrow-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
            </marker>
          </defs>

          <line x1="15%" y1="20%" x2="35%" y2="20%" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="35%" y1="20%" x2="55%" y2="20%" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="55%" y1="20%" x2="80%" y2="50%" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />

          <line x1="15%" y1="80%" x2="35%" y2="80%" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="35%" y1="80%" x2="55%" y2="80%" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="55%" y1="80%" x2="80%" y2="80%" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="55%" y1="80%" x2="80%" y2="50%" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="80%" y1="80%" x2="80%" y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />

          {activeFlow !== 'idle' && (
            <circle r="6" fill={activeFlow === 'ingest' ? '#fbbf24' : '#60a5fa'} className="animate-pulse">
              <animateMotion dur="2s" repeatCount="indefinite" path={getActivePath()} />
            </circle>
          )}
        </svg>

        {Object.entries(nodes).map(([key, node]) => {
          const Icon = node.icon;
          let isActive = false;
          if (activeFlow === 'ingest' && ['erp', 'worker', 's3', 'tinybird'].includes(key))
            isActive = true;
          if (activeFlow === 'query' && ['user', 'cube', 'tinybird', 'falkordb'].includes(key))
            isActive = true;
          if (activeFlow === 'auth' && ['user', 'clerk', 'cube'].includes(key)) isActive = true;

          const isSelected = selectedComponent === node.id;

          return (
            <div
              key={key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-500"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                opacity: activeFlow !== 'idle' && !isActive ? 0.3 : 1,
              }}
            >
              <button
                onClick={() => setSelectedComponent(node.id)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-slate-900 border flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? 'scale-110 border-white shadow-blue-500/50'
                      : isSelected
                        ? 'border-indigo-500 shadow-indigo-500/50 scale-105'
                        : 'border-slate-700 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/30 group-hover:scale-105'
                  }`}
                >
                  <Icon size={32} className={node.color} />
                </div>
                <span
                  className={`mt-3 text-xs font-bold uppercase tracking-wider bg-slate-900/90 px-2 py-1 rounded transition-colors ${
                    isActive
                      ? 'text-white'
                      : isSelected
                        ? 'text-indigo-400'
                        : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {node.label}
                </span>
                {!isActive && (
                  <span className="mt-1 text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors">
                    Click to explore
                  </span>
                )}
              </button>
            </div>
          );
        })}

        <div className="absolute left-4 top-4 text-xs font-mono text-slate-600 uppercase tracking-widest border border-slate-700 px-2 py-1 rounded">
          Ingestion Lane (ELT)
        </div>
        <div className="absolute left-4 bottom-4 text-xs font-mono text-slate-600 uppercase tracking-widest border border-slate-700 px-2 py-1 rounded">
          Serving Lane (API)
        </div>
      </div>

      <div className="w-full max-w-6xl mt-6 p-4 bg-black rounded-lg border border-slate-800 h-32 overflow-y-auto font-mono text-xs">
        <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1">System Logs</div>
        {logs.length === 0 ? (
          <div className="text-slate-700 italic">System Idle...</div>
        ) : (
          logs.map((l, i) => (
            <div
              key={i}
              className={`mb-1 ${activeFlow === 'ingest' ? 'text-amber-400' : 'text-green-400'}`}
            >
              [{new Date().toLocaleTimeString()}] {l}
            </div>
          ))
        )}
      </div>

      <ComponentDemoPanel
        demo={selectedComponent ? COMPONENT_DEMOS[selectedComponent] : null}
        onClose={() => setSelectedComponent(null)}
      />
    </div>
  );
}

