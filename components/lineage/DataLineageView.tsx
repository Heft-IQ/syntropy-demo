'use client';

import { useState, useMemo } from 'react';
import { Database, Box, BarChart2, FileText, Search, X, ArrowRight, ArrowDown } from 'lucide-react';
import { LineageData, LineageNode, LineageNodeType } from '@/types';
import { LINEAGE_DATA, SEEDED_METRICS } from '@/lib/data';

interface DataLineageViewProps {
  metricId?: string;
  onClose?: () => void;
}

const nodeTypeConfig: Record<LineageNodeType, { color: string; icon: any; bgColor: string; borderColor: string }> = {
  source_field: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: Database,
  },
  canonical_field: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    icon: Box,
  },
  metric: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: BarChart2,
  },
  usage: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    icon: FileText,
  },
};

const levelConfig = [
  { label: 'Source Fields', type: 'source_field' as LineageNodeType, spacing: 'gap-6' },
  { label: 'Canonical Fields', type: 'canonical_field' as LineageNodeType, spacing: 'gap-8' },
  { label: 'Metrics', type: 'metric' as LineageNodeType, spacing: 'gap-8' },
  { label: 'Usage', type: 'usage' as LineageNodeType, spacing: 'gap-6' },
];

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

  const getConnectedNodes = (nodeId: string, direction: 'source' | 'target') => {
    return lineageData.edges
      .filter((e) => (direction === 'source' ? e.source === nodeId : e.target === nodeId))
      .map((e) => {
        const connectedId = direction === 'source' ? e.target : e.source;
        const connectedNode = lineageData.nodes.find((n) => n.id === connectedId);
        return connectedNode ? { node: connectedNode, edge: e } : null;
      })
      .filter((item): item is { node: LineageNode; edge: any } => item !== null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 p-6 bg-slate-900/50 shrink-0">
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

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {levelConfig.map((level, levelIndex) => {
            const nodes = nodesByLevel[levelIndex];
            if (nodes.length === 0) return null;

            return (
              <div key={levelIndex} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{level.label}</div>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>

                <div className={`flex flex-wrap items-start justify-center ${level.spacing} min-h-[120px]`}>
                  {nodes.map((node) => {
                    const config = nodeTypeConfig[node.type];
                    const Icon = config.icon;
                    const isSelected = selectedNode === node.id;
                    const sources = getConnectedNodes(node.id, 'source');
                    const targets = getConnectedNodes(node.id, 'target');

                    return (
                      <div key={node.id} className="relative group">
                        <div
                          className={`min-w-[180px] border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 scale-105'
                              : `${config.borderColor} ${config.bgColor} hover:scale-105 hover:shadow-lg`
                          }`}
                          onClick={() => setSelectedNode(isSelected ? null : node.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={18} className={config.color} />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              {node.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-white mb-1 break-words">{node.label}</div>
                          {node.description && (
                            <div className="text-xs text-slate-400 break-words line-clamp-2">{node.description}</div>
                          )}
                          {node.metadata?.table && (
                            <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800">
                              Table: {node.metadata.table}
                            </div>
                          )}
                        </div>

                        {/* Connection indicators */}
                        {sources.length > 0 && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5">
                              <ArrowDown size={10} className="text-slate-500" />
                              <span className="text-[10px] text-slate-400">{sources.length}</span>
                            </div>
                          </div>
                        )}
                        {targets.length > 0 && (
                          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5">
                              <ArrowDown size={10} className="text-slate-500" />
                              <span className="text-[10px] text-slate-400">{targets.length}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Connection lines between levels */}
                {levelIndex < levelConfig.length - 1 && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-8">
                      {nodes.map((node) => {
                        const targets = getConnectedNodes(node.id, 'target');
                        if (targets.length === 0) return null;

                        return (
                          <div key={node.id} className="flex flex-col items-center gap-2">
                            {targets.map(({ node: target, edge }) => {
                              const targetLevel = levelConfig.findIndex((l) => l.type === target.type);
                              if (targetLevel !== levelIndex + 1) return null;

                              return (
                                <div
                                  key={edge.id}
                                  className="flex flex-col items-center gap-1 text-xs text-slate-500"
                                  title={edge.label}
                                >
                                  <ArrowDown size={16} className="text-slate-600" />
                                  <span className="text-[10px] max-w-[100px] text-center truncate">{edge.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedNode && (
        <div className="border-t border-slate-800 bg-slate-900/50 p-6 shrink-0">
          <div className="max-w-7xl mx-auto">
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
              const sources = getConnectedNodes(selectedNode, 'source');
              const targets = getConnectedNodes(selectedNode, 'target');

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  <div className="space-y-4">
                    {sources.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2 font-bold uppercase">Connected From:</div>
                        <div className="space-y-2">
                          {sources.map(({ node: source, edge }) => (
                            <div
                              key={edge.id}
                              className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg"
                            >
                              <ArrowRight size={14} className="text-slate-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white">{source.label}</div>
                                {edge.label && (
                                  <div className="text-xs text-slate-400 mt-0.5">{edge.label}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {targets.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2 font-bold uppercase">Connected To:</div>
                        <div className="space-y-2">
                          {targets.map(({ node: target, edge }) => (
                            <div
                              key={edge.id}
                              className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg"
                            >
                              <ArrowRight size={14} className="text-slate-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white">{target.label}</div>
                                {edge.label && (
                                  <div className="text-xs text-slate-400 mt-0.5">{edge.label}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
