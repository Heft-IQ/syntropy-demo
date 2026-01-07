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
  Pause,
  Play,
  StepForward,
  BookOpen,
} from 'lucide-react';
import { ComponentType, ComponentCategory } from '@/types';
import { COMPONENT_DEMOS, FLOW_CONNECTIONS } from '@/lib/data';
import { ComponentDemoPanel } from './ComponentDemoPanel';

type FlowType = 'idle' | 'ingest' | 'query' | 'auth';

interface Node {
  x: number;
  y: number;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  id: ComponentType;
  category: ComponentCategory;
}

const getCategoryColor = (category: ComponentCategory): string => {
  const colors: Record<ComponentCategory, string> = {
    'data-source': 'bg-slate-600',
    'etl': 'bg-blue-600',
    'storage': 'bg-amber-600',
    'compute': 'bg-yellow-600',
    'api-gateway': 'bg-indigo-600',
    'control-plane': 'bg-green-600',
    'auth': 'bg-purple-600',
    'frontend': 'bg-pink-600',
  };
  return colors[category] || 'bg-slate-600';
};

const getCategoryLabel = (category: ComponentCategory): string => {
  const labels: Record<ComponentCategory, string> = {
    'data-source': 'Data Source',
    'etl': 'ETL',
    'storage': 'Storage',
    'compute': 'Compute',
    'api-gateway': 'API Gateway',
    'control-plane': 'Control Plane',
    'auth': 'Auth',
    'frontend': 'Frontend',
  };
  return labels[category] || category;
};

const getFlowColor = (flowType: string): string => {
  switch (flowType) {
    case 'ingestion':
      return '#fbbf24'; // amber
    case 'query':
      return '#60a5fa'; // blue
    case 'auth':
      return '#a78bfa'; // purple
    case 'control':
      return '#34d399'; // green
    default:
      return '#64748b'; // slate
  }
};

interface ArchitectureVisProps {
  highlightedComponents?: string[];
}

export function ArchitectureVis({ highlightedComponents = [] }: ArchitectureVisProps) {
  const [activeFlow, setActiveFlow] = useState<FlowType>('idle');
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<Array<{ message: string; dataFormat?: string; explanation?: string }>>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const nodes: Record<string, Node> = {
    erp: { x: 15, y: 20, label: 'ERP (NetSuite)', icon: Cloud, color: 'text-slate-400', id: 'erp', category: 'data-source' },
    worker: { x: 35, y: 20, label: 'dlt Worker', icon: Settings, color: 'text-blue-400', id: 'worker', category: 'etl' },
    s3: { x: 55, y: 20, label: 'S3 Bronze', icon: HardDrive, color: 'text-amber-500', id: 's3', category: 'storage' },
    tinybird: { x: 80, y: 50, label: 'Tinybird (Silver/Gold)', icon: Database, color: 'text-yellow-500', id: 'tinybird', category: 'compute' },
    user: { x: 15, y: 80, label: 'User / Dashboard', icon: User, color: 'text-white', id: 'user', category: 'frontend' },
    clerk: { x: 35, y: 80, label: 'Clerk Auth', icon: Key, color: 'text-blue-300', id: 'clerk', category: 'auth' },
    cube: { x: 55, y: 80, label: 'Cube Gateway', icon: Box, color: 'text-indigo-400', id: 'cube', category: 'api-gateway' },
    falkordb: { x: 80, y: 80, label: 'FalkorDB Graph', icon: Activity, color: 'text-green-400', id: 'falkordb', category: 'control-plane' },
  };

  const startFlow = (flow: FlowType) => {
    setActiveFlow(flow);
    setStep(0);
    setLogs([]);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStep = () => {
    if (activeFlow === 'idle' || !isPaused) return;
    const flowSteps: Record<FlowType, Array<{ message: string; dataFormat?: string; explanation?: string }>> = {
      idle: [],
      ingest: [
        { message: 'Step 1: Extract raw JSON from ERP API', dataFormat: 'Raw JSON', explanation: 'ERP systems send raw data via REST API. No transformation yet!' },
        { message: 'Step 2: Load & normalize format (dlt Worker)', dataFormat: 'Normalized Parquet', explanation: 'dlt Worker converts JSON to Parquet. Raw data preserved - ELT approach!' },
        { message: 'Step 3: Store in S3 Bronze (data lake)', dataFormat: 'Parquet files', explanation: 'Raw data stored in S3 Bronze - immutable storage layer.' },
        { message: 'Step 4: Auto-ingest into Tinybird', dataFormat: 'Queryable analytics', explanation: 'Tinybird ingests from S3. Transformation happens here - schema-on-read.' },
        { message: 'Step 5: Data ready for analytics', dataFormat: 'Analytics ready', explanation: 'Data is queryable. Transformations happen on-demand.' },
      ],
      query: [
        { message: 'Step 1: User requests metric query', dataFormat: 'Metric request', explanation: 'User requests a business metric through the API.' },
        { message: 'Step 2: Cube Gateway validates permissions', dataFormat: 'JWT token', explanation: 'Cube Gateway checks JWT token with Clerk Auth.' },
        { message: 'Step 3: Resolve metric schema from FalkorDB', dataFormat: 'Canonical mappings', explanation: 'FalkorDB resolves metric definition and mappings.' },
        { message: 'Step 4: Translate to SQL and query Tinybird', dataFormat: 'SQL query', explanation: 'Cube Gateway translates to SQL and queries Tinybird.' },
        { message: 'Step 5: Return results to user', dataFormat: 'JSON response', explanation: 'Results are formatted and returned.' },
      ],
      auth: [
        { message: 'Step 1: User authenticates', dataFormat: 'Credentials', explanation: 'User provides credentials to Clerk Auth.' },
        { message: 'Step 2: Clerk issues JWT token', dataFormat: 'JWT token', explanation: 'Clerk validates and issues JWT token.' },
        { message: 'Step 3: Session validated', dataFormat: 'Session data', explanation: 'JWT token is validated on each request.' },
        { message: 'Step 4: Graph permissions loaded', dataFormat: 'RBAC policies', explanation: 'Access control policies are applied.' },
      ],
    };
    const currentSteps = flowSteps[activeFlow] || [];
    if (step < currentSteps.length) {
      setLogs((prev) => [...prev, currentSteps[step]]);
      setStep((s) => s + 1);
    }
  };

  useEffect(() => {
    if (activeFlow === 'idle') return;

    const flowSteps: Record<FlowType, Array<{ message: string; dataFormat?: string; explanation?: string }>> = {
      idle: [],
      ingest: [
        {
          message: 'Step 1: Extract raw JSON from ERP API',
          dataFormat: 'Raw JSON',
          explanation: 'ERP systems (NetSuite, Salesforce, SAP) send raw transactional data via REST API. No transformation yet - this is the ELT approach!',
        },
        {
          message: 'Step 2: Load & normalize format (dlt Worker)',
          dataFormat: 'Normalized Parquet',
          explanation: 'dlt Worker converts JSON to Parquet format and does minimal normalization. Raw data structure is preserved - this is the "Load" step in ELT.',
        },
        {
          message: 'Step 3: Store in S3 Bronze (data lake)',
          dataFormat: 'Parquet files',
          explanation: 'Raw/normalized data is stored in S3 Bronze. This is immutable storage - the raw data is always preserved for future transformations.',
        },
        {
          message: 'Step 4: Auto-ingest into Tinybird',
          dataFormat: 'Queryable analytics',
          explanation: 'Tinybird automatically ingests from S3. This is where transformation happens (Silver/Gold layer) - schema-on-read approach.',
        },
        {
          message: 'Step 5: Data ready for analytics',
          dataFormat: 'Analytics ready',
          explanation: 'Data is now queryable. Transformations happen on-demand when queries are executed, not during ingestion.',
        },
      ],
      query: [
        {
          message: 'Step 1: User requests metric query',
          dataFormat: 'Metric request',
          explanation: 'User or dashboard requests a business metric (e.g., "Net Revenue") through the API.',
        },
        {
          message: 'Step 2: Cube Gateway validates permissions',
          dataFormat: 'JWT token',
          explanation: 'Cube Gateway checks the JWT token with Clerk Auth to ensure user has permission to access this metric.',
        },
        {
          message: 'Step 3: Resolve metric schema from FalkorDB',
          dataFormat: 'Canonical mappings',
          explanation: 'FalkorDB Graph (knowledge graph) resolves the metric definition, mapping canonical fields to physical ERP columns.',
        },
        {
          message: 'Step 4: Translate to SQL and query Tinybird',
          dataFormat: 'SQL query',
          explanation: 'Cube Gateway translates the metric definition into SQL and executes it against Tinybird (the analytics store).',
        },
        {
          message: 'Step 5: Return results to user',
          dataFormat: 'JSON response',
          explanation: 'Query results are formatted and returned to the user/dashboard. The entire flow is transparent and fast.',
        },
      ],
      auth: [
        {
          message: 'Step 1: User authenticates',
          dataFormat: 'Credentials',
          explanation: 'User provides credentials (username/password, SSO, etc.) to Clerk Auth.',
        },
        {
          message: 'Step 2: Clerk issues JWT token',
          dataFormat: 'JWT token',
          explanation: 'Clerk validates credentials and issues a JWT token with user roles and permissions embedded.',
        },
        {
          message: 'Step 3: Session validated',
          dataFormat: 'Session data',
          explanation: 'JWT token is validated on each request. Session data is cached for performance.',
        },
        {
          message: 'Step 4: Graph permissions loaded',
          dataFormat: 'RBAC policies',
          explanation: 'Access control policies from FalkorDB Graph are applied to determine what data the user can access.',
        },
      ],
    };

    const currentSteps = flowSteps[activeFlow] || [];

    if (isPaused) return;

    const timer = setTimeout(() => {
      if (step < currentSteps.length) {
        const currentStep = currentSteps[step];
        setLogs((prev) => [...prev, currentStep]);
        setStep((s) => s + 1);
      } else {
        setTimeout(() => {
          setActiveFlow('idle');
          setStep(0);
          setIsPaused(false);
        }, 1500);
      }
    }, 2500); // Slower for better readability

    return () => clearTimeout(timer);
  }, [activeFlow, step, isPaused]);

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
        <div className="flex gap-4 items-center" data-tour="flow-simulation">
          <button
            onClick={() => startFlow('ingest')}
            disabled={activeFlow !== 'idle'}
            className="px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/50 rounded-lg text-sm font-medium hover:bg-amber-600/40 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <FileJson size={14} /> Simulate Ingestion (ELT)
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
          {activeFlow !== 'idle' && (
            <>
              <button
                onClick={handlePause}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                onClick={handleStep}
                disabled={!isPaused}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <StepForward size={14} />
              </button>
            </>
          )}
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

          {FLOW_CONNECTIONS.map((flow, idx) => {
            const fromNode = nodes[flow.from];
            const toNode = nodes[flow.to];
            if (!fromNode || !toNode) return null;

            // Convert percentage to SVG coordinates (assuming 1000x500 SVG viewBox)
            const x1 = `${fromNode.x}%`;
            const y1 = `${fromNode.y}%`;
            const x2 = `${toNode.x}%`;
            const y2 = `${toNode.y}%`;
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const flowColor = getFlowColor(flow.flowType);
            const isActive = activeFlow === 'ingest' && flow.flowType === 'ingestion' ||
                            activeFlow === 'query' && flow.flowType === 'query' ||
                            activeFlow === 'auth' && flow.flowType === 'auth';

            return (
              <g key={idx}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isActive ? flowColor : '#334155'}
                  strokeWidth={isActive ? 3 : 2}
                  markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                  opacity={isActive ? 1 : 0.6}
                />
                <text
                  x={`${midX}%`}
                  y={`${midY}%`}
                  textAnchor="middle"
                  className="fill-slate-400 font-medium pointer-events-auto"
                  style={{ fontSize: '10px' }}
                  dy="-8"
                >
                  {flow.label}
                </text>
              </g>
            );
          })}

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
          const isHighlighted = highlightedComponents.includes(node.id);

          return (
                <div
                  key={key}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-500"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    opacity: activeFlow !== 'idle' && !isActive ? 0.3 : 1,
                  }}
                  data-tour="architecture-components"
                >
                  <button
                    onClick={() => setSelectedComponent(node.id)}
                    className="group flex flex-col items-center cursor-pointer"
                  >
                <div
                  className={`w-16 h-16 rounded-xl bg-slate-900 border flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? 'scale-110 border-white shadow-blue-500/50'
                      : isHighlighted
                        ? 'border-yellow-500 shadow-yellow-500/50 scale-110 animate-pulse'
                        : isSelected
                          ? 'border-indigo-500 shadow-indigo-500/50 scale-105'
                          : 'border-slate-700 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/30 group-hover:scale-105'
                  }`}
                >
                  <Icon size={32} className={node.color} />
                </div>
                <div className="mt-3 flex flex-col items-center gap-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider bg-slate-900/90 px-2 py-1 rounded transition-colors ${
                      isActive
                        ? 'text-white'
                        : isSelected
                          ? 'text-indigo-400'
                          : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {node.label}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(node.category)} text-white`}
                  >
                    {getCategoryLabel(node.category)}
                  </span>
                  {!isActive && (
                    <span className="mt-1 text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors">
                      Click to explore
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}

        <div className="absolute left-4 top-4 bg-amber-600/20 border border-amber-500/50 px-3 py-2 rounded-lg">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Ingestion Lane (ELT)</div>
          <div className="text-[10px] text-amber-500/80">Raw data extraction, transformation, and storage</div>
        </div>
        <div className="absolute left-4 bottom-4 bg-indigo-600/20 border border-indigo-500/50 px-3 py-2 rounded-lg">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Serving Lane (API)</div>
          <div className="text-[10px] text-indigo-500/80">Query processing, authentication, and response serving</div>
        </div>
      </div>

          <div className="w-full max-w-6xl mt-6 p-4 bg-black rounded-lg border border-slate-800 min-h-[200px] max-h-[300px] overflow-y-auto font-mono text-xs">
            <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1">System Logs - Flow Details</div>
            {logs.length === 0 ? (
              <div className="text-slate-700 italic">System Idle... Click a simulation button to start</div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      activeFlow === 'ingest'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : activeFlow === 'query'
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{log.message}</div>
                        {log.dataFormat && (
                          <div className="text-xs opacity-75 mb-2">
                            Data Format: <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded">{log.dataFormat}</span>
                          </div>
                        )}
                        {log.explanation && (
                          <div className="text-xs opacity-90 mt-2 leading-relaxed">{log.explanation}</div>
                        )}
                      </div>
                      <div className="text-xs opacity-50 shrink-0">
                        [{new Date().toLocaleTimeString()}]
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

      <ComponentDemoPanel
        demo={selectedComponent ? COMPONENT_DEMOS[selectedComponent] : null}
        onClose={() => setSelectedComponent(null)}
      />
    </div>
  );
}

