'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, Lock, CheckCircle, XCircle, Clock, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { AuditLog, AuditLogSeverity, AuditLogStatus } from '@/types';
import { AuditLogDetailView } from './AuditLogDetailView';

interface AuditLogTableProps {
  logs: AuditLog[];
}

type SortField = 'time' | 'actor' | 'action' | 'severity' | 'status';
type SortDirection = 'asc' | 'desc';

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getSeverityColor = (severity: AuditLogSeverity) => {
    const colors = {
      info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      error: 'bg-red-500/10 text-red-400 border-red-500/20',
      critical: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: AuditLogSeverity) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      error: AlertCircle,
      critical: AlertCircle,
    };
    return icons[severity];
  };

  const getStatusIcon = (status: AuditLogStatus) => {
    if (status === 'success') return CheckCircle;
    if (status === 'failed') return XCircle;
    return Clock;
  };

  const getStatusColor = (status: AuditLogStatus) => {
    if (status === 'success') return 'text-green-400';
    if (status === 'failed') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-500/10 text-green-400 border-green-500/20',
      UPDATE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
      APPROVE: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      REJECT: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      QUERY: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      AUTH: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      CONFIG: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      EXPORT: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      OTHER: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[category] || colors.OTHER;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLogs = [...logs].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortField) {
      case 'time':
        aVal = a.timestamp.getTime();
        bVal = b.timestamp.getTime();
        break;
      case 'actor':
        aVal = a.actor.toLowerCase();
        bVal = b.actor.toLowerCase();
        break;
      case 'action':
        aVal = a.action.toLowerCase();
        bVal = b.action.toLowerCase();
        break;
      case 'severity':
        const severityOrder = { critical: 4, error: 3, warning: 2, info: 1 };
        aVal = severityOrder[a.severity];
        bVal = severityOrder[b.severity];
        break;
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 w-12"></th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('time')}
              >
                <div className="flex items-center gap-2">
                  Time
                  <ArrowUpDown size={14} className={sortField === 'time' ? 'text-indigo-400' : ''} />
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('actor')}
              >
                <div className="flex items-center gap-2">
                  Actor
                  <ArrowUpDown size={14} className={sortField === 'actor' ? 'text-indigo-400' : ''} />
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('action')}
              >
                <div className="flex items-center gap-2">
                  Action
                  <ArrowUpDown size={14} className={sortField === 'action' ? 'text-indigo-400' : ''} />
                </div>
              </th>
              <th className="px-6 py-4">Target</th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('severity')}
              >
                <div className="flex items-center gap-2">
                  Severity
                  <ArrowUpDown size={14} className={sortField === 'severity' ? 'text-indigo-400' : ''} />
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown size={14} className={sortField === 'status' ? 'text-indigo-400' : ''} />
                </div>
              </th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedLogs.map((log) => {
              const isExpanded = expandedRows.has(log.id);
              const SeverityIcon = getSeverityIcon(log.severity);
              const StatusIcon = getStatusIcon(log.status);

              return (
                <tr
                  key={log.id}
                  className={`hover:bg-slate-800/30 transition-colors ${
                    log.severity === 'critical' ? 'bg-red-500/5' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRow(log.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-300 font-mono text-xs">{log.time}</span>
                      <span className="text-slate-500 text-[10px]">
                        {log.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{log.actor}</span>
                      {log.ipAddress && (
                        <span className="text-slate-500 text-[10px] font-mono">{log.ipAddress}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                      <span className="text-slate-300 text-xs">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{log.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-semibold ${getSeverityColor(log.severity)}`}>
                      <SeverityIcon size={12} />
                      {log.severity.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 ${getStatusColor(log.status)}`}>
                      <StatusIcon size={14} />
                      <span className="text-xs font-medium">{log.status.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-xs font-mono">{formatDuration(log.duration)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.complianceHash && (
                        <div title="Immutable - Tamper-proof">
                          <Lock size={14} className="text-slate-500" />
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-slate-500 hover:text-indigo-400 transition-colors text-xs"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <AuditLogDetailView
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </>
  );
}

