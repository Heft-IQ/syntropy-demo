'use client';

import { useState, useMemo } from 'react';
import { Database, Box, BarChart2, FileText, Search, X, ArrowRight } from 'lucide-react';
import { LineageData, LineageNode, LineageNodeType } from '@/types';
import { LINEAGE_DATA, SEEDED_METRICS } from '@/lib/data';

interface DataLineageViewProps {
  metricId?: string;
  onClose?: () => void;
}

const nodeTypeConfig: Record<LineageNodeType, { color: string; icon: any; bgColor: string }> = {
  source_field: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    icon: Database,
  },
  canonical_field: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/30',
    icon: Box,
  },
  metric: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
    icon: BarChart2,
  },
  usage: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    icon: FileText,
  },
};

export function DataLineageView({ metricId, onClose }: DataLineageViewProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>(metricId || 'm_001');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const lineageData = useMemo(() => {
    return LINEAGE_DATA[selectedMetric] || LINEAGE_DATA['m_001'];
  }, [selectedMetric]);

  const filteredMetrics = useMemo(() => {
    if (!searchQuery) return SEEDED_METRICS;
    return SEEDED_METRICS.filter(
      (m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id === searchQuery.toLowerCase()
    );
  }, [searchQuery]);

  const getNodePosition = (index: number, total: number, level: number) => {
    const spacing = 200;
    const startX = 100;
    const startY = 100 + level * 150;
    const totalWidth = (total - 1) * spacing;
    const x = startX + (index * spacing - totalWidth / 2);
    return { x, y: startY };
  };

  const nodesByLevel = useMemo(() => {
    const levels: Record<number, LineageNode[]> = { 0: [], 1: [], 2: [], 3: [] };
    lineageData.nodes.forEach((node) => {
      if (node.type === 'source_field') levels[0].push(node);
      else if (node.type === 'canonical_field') levels[1].push(node);
      else if (node.type === 'metric') levels[2].push(node);
      else if (node.type === 'usage') levels[3].push(node);
    });
    return levels;
  }, [lineageData]);

  const getEdgePath = (sourceId: string, targetId: string) => {
    const sourceNode = lineageData.nodes.find((n) => n.id === sourceId);
    const targetNode = lineageData.nodes.find((n) => n.id === targetId);
    if (!sourceNode || !targetNode) return '';

    const sourceLevel = sourceNode.type === 'source_field' ? 0 : sourceNode.type === 'canonical_field' ? 1 : sourceNode.type === 'metric' ? 2 : 3;
    const targetLevel = targetNode.type === 'source_field' ? 0 : targetNode.type === 'canonical_field' ? 1 : targetNode.type === 'metric' ? 2 : 3;

    const sourceIndex = nodesByLevel[sourceLevel].findIndex((n) => n.id === sourceId);
    const targetIndex = nodesByLevel[targetLevel].findIndex((n) => n.id === targetId);

    const sourcePos = getNodePosition(sourceIndex, nodesByLevel[sourceLevel].length, sourceLevel);
    const targetPos = getNodePosition(targetIndex, nodesByLevel[targetLevel].length, targetLevel);

    const midX = (sourcePos.x + targetPos.x) / 2;
    return `M ${sourcePos.x + 80} ${sourcePos.y + 40} L ${midX} ${sourcePos.y + 40} L ${midX} ${targetPos.y + 40} L ${targetPos.x + 80} ${targetPos.y + 40}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 p-6 bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Data Lineage</h2>
            <p className="text-slate-400 text-sm">Trace metrics back to their source fields</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search metrics..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {filteredMetrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 relative">
        <div className="relative" style={{ minWidth: '1200px', minHeight: '600px' }}>
          <svg className="absolute inset-0 w-full h-full" style={{ minWidth: '1200px', minHeight: '600px' }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
              </marker>
            </defs>

            {lineageData.edges.map((edge) => {
              const path = getEdgePath(edge.source, edge.target);
              return (
                <g key={edge.id}>
                  <path
                    d={path}
                    stroke="#475569"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="hover:stroke-indigo-500 transition-colors"
                  />
                </g>
              );
            })}
          </svg>

          {Object.entries(nodesByLevel).map(([level, nodes]) => {
            if (nodes.length === 0) return null;
            const levelNum = parseInt(level);
            return (
              <div key={level} className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800"></div>
                <div className="absolute left-0 top-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {levelNum === 0 && 'Source Fields'}
                  {levelNum === 1 && 'Canonical Fields'}
                  {levelNum === 2 && 'Metrics'}
                  {levelNum === 3 && 'Usage'}
                </div>
                <div className="flex gap-4 ml-20" style={{ marginTop: `${100 + levelNum * 150}px` }}>
                  {nodes.map((node, index) => {
                    const config = nodeTypeConfig[node.type];
                    const Icon = config.icon;
                    const isSelected = selectedNode === node.id;
                    const pos = getNodePosition(index, nodes.length, levelNum);

                    return (
                      <div
                        key={node.id}
                        className="absolute cursor-pointer transform transition-all hover:scale-105"
                        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                        onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      >
                        <div
                          className={`w-40 border-2 rounded-xl p-4 transition-all ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                              : config.bgColor
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className={config.color} />
                            <span className="text-xs font-bold text-slate-400 uppercase">{node.type.replace('_', ' ')}</span>
                          </div>
                          <div className="text-sm font-bold text-white mb-1 truncate">{node.label}</div>
                          {node.description && (
                            <div className="text-xs text-slate-400 truncate">{node.description}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedNode && (
          <div className="absolute bottom-6 left-6 right-6 bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Node Details</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {(() => {
              const node = lineageData.nodes.find((n) => n.id === selectedNode);
              if (!node) return null;
              const config = nodeTypeConfig[node.type];
              const Icon = config.icon;

              return (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={20} className={config.color} />
                    <span className="text-sm font-medium text-white">{node.label}</span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">{node.type}</span>
                  </div>
                  {node.description && <p className="text-sm text-slate-300 mb-3">{node.description}</p>}
                  {node.metadata && (
                    <div className="space-y-2">
                      {Object.entries(node.metadata).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500">{key}:</span>
                          <span className="text-slate-300">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-500 mb-2">Connected To:</div>
                    <div className="flex flex-wrap gap-2">
                      {lineageData.edges
                        .filter((e) => e.source === selectedNode || e.target === selectedNode)
                        .map((edge) => {
                          const connectedNode = lineageData.nodes.find(
                            (n) => n.id === (edge.source === selectedNode ? edge.target : edge.source)
                          );
                          if (!connectedNode) return null;
                          return (
                            <div
                              key={edge.id}
                              className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded text-xs text-slate-300"
                            >
                              <ArrowRight size={12} />
                              {connectedNode.label}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

