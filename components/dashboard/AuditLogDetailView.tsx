'use client';

import { X, Lock, CheckCircle, XCircle, Clock, Copy, Check } from 'lucide-react';
import { AuditLog } from '@/types';
import { useState } from 'react';

interface AuditLogDetailViewProps {
  log: AuditLog;
  onClose: () => void;
}

export function AuditLogDetailView({ log, onClose }: AuditLogDetailViewProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return CheckCircle;
    if (status === 'failed') return XCircle;
    return Clock;
  };

  const StatusIcon = getStatusIcon(log.status);

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'text-green-400';
    if (status === 'failed') return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Audit Log Details</h2>
            {log.complianceHash && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-600/20 border border-indigo-500/50 rounded text-xs text-indigo-400">
                <Lock size={12} />
                Immutable
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Action</div>
              <div className="text-white font-semibold">{log.action}</div>
              <div className="text-sm text-slate-400 mt-1">{log.category}</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Target</div>
              <div className="text-white font-semibold">{log.target}</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Actor</div>
              <div className="text-white font-semibold">{log.actor}</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Timestamp</div>
              <div className="text-white font-semibold">{log.timestamp.toLocaleString()}</div>
              <div className="text-sm text-slate-400 mt-1">{log.time}</div>
            </div>
          </div>

          {/* Status & Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Status</div>
              <div className={`flex items-center gap-2 ${getStatusColor(log.status)}`}>
                <StatusIcon size={18} />
                <span className="font-semibold">{log.status.toUpperCase()}</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Severity</div>
              <div className="text-white font-semibold">{log.severity.toUpperCase()}</div>
            </div>
          </div>

          {/* Performance */}
          {log.duration && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Performance</div>
              <div className="text-white font-mono">{log.duration}ms</div>
            </div>
          )}

          {/* Network & Session Info */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Network & Session</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {log.ipAddress && (
                <div>
                  <div className="text-slate-400 mb-1">IP Address</div>
                  <div className="text-white font-mono flex items-center gap-2">
                    {log.ipAddress}
                    <button
                      onClick={() => copyToClipboard(log.ipAddress!, 'ip')}
                      className="text-slate-500 hover:text-white"
                    >
                      {copied === 'ip' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
              {log.userAgent && (
                <div>
                  <div className="text-slate-400 mb-1">User Agent</div>
                  <div className="text-white font-mono text-xs">{log.userAgent}</div>
                </div>
              )}
              {log.sessionId && (
                <div>
                  <div className="text-slate-400 mb-1">Session ID</div>
                  <div className="text-white font-mono text-xs flex items-center gap-2">
                    {log.sessionId}
                    <button
                      onClick={() => copyToClipboard(log.sessionId!, 'session')}
                      className="text-slate-500 hover:text-white"
                    >
                      {copied === 'session' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
              {log.requestId && (
                <div>
                  <div className="text-slate-400 mb-1">Request ID</div>
                  <div className="text-white font-mono text-xs flex items-center gap-2">
                    {log.requestId}
                    <button
                      onClick={() => copyToClipboard(log.requestId!, 'request')}
                      className="text-slate-500 hover:text-white"
                    >
                      {copied === 'request' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
              {log.correlationId && (
                <div>
                  <div className="text-slate-400 mb-1">Correlation ID</div>
                  <div className="text-white font-mono text-xs flex items-center gap-2">
                    {log.correlationId}
                    <button
                      onClick={() => copyToClipboard(log.correlationId!, 'correlation')}
                      className="text-slate-500 hover:text-white"
                    >
                      {copied === 'correlation' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Before/After Changes */}
          {(log.before || log.after) && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Change Tracking</div>
              <div className="grid grid-cols-2 gap-4">
                {log.before && (
                  <div>
                    <div className="text-red-400 text-xs font-semibold mb-2">Before</div>
                    <pre className="bg-black rounded p-3 text-xs text-slate-300 overflow-x-auto">
                      {JSON.stringify(log.before, null, 2)}
                    </pre>
                  </div>
                )}
                {log.after && (
                  <div>
                    <div className="text-green-400 text-xs font-semibold mb-2">After</div>
                    <pre className="bg-black rounded p-3 text-xs text-slate-300 overflow-x-auto">
                      {JSON.stringify(log.after, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              {log.diff && (
                <div className="mt-4">
                  <div className="text-slate-400 text-xs font-semibold mb-2">Diff Summary</div>
                  <div className="bg-slate-900 rounded p-3 text-sm text-slate-300 font-mono">
                    {log.diff}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Metadata</div>
              <pre className="bg-black rounded p-3 text-xs text-slate-300 overflow-x-auto">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Compliance Hash */}
          {log.complianceHash && (
            <div className="bg-slate-950 border border-indigo-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={16} className="text-indigo-400" />
                <div className="text-xs text-indigo-400 uppercase tracking-wider">Compliance Hash</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-white font-mono text-xs flex-1 bg-black rounded p-2">
                  {log.complianceHash}
                </div>
                <button
                  onClick={() => copyToClipboard(log.complianceHash!, 'hash')}
                  className="text-slate-500 hover:text-white p-2"
                >
                  {copied === 'hash' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                This cryptographic hash ensures the log entry is tamper-proof and immutable.
              </div>
            </div>
          )}

          {/* Related Actions */}
          {log.relatedActions && log.relatedActions.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Related Actions</div>
              <div className="flex flex-wrap gap-2">
                {log.relatedActions.map((relatedId) => (
                  <span
                    key={relatedId}
                    className="px-2 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 rounded text-xs font-mono"
                  >
                    #{relatedId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

