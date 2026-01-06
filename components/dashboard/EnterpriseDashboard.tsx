'use client';

import { useState } from 'react';
import {
  GitBranch,
  FileText,
  Plus,
  Eye,
  Edit3,
  Layers,
} from 'lucide-react';
import { Metric, AuditLog, Draft } from '@/types';
import { SEEDED_METRICS, SEEDED_AUDIT_LOG } from '@/lib/data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VoiceArchitect } from '@/components/voice-architect/VoiceArchitect';
import { ImpactReviewModal } from './ImpactReviewModal';

export function EnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'audit'>('metrics');
  const [userRole, setUserRole] = useState('Admin');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [selectedMetricForEdit, setSelectedMetricForEdit] = useState<Metric | null>(null);
  const [reviewItem, setReviewItem] = useState<Metric | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>(SEEDED_METRICS);
  const [auditLog, setAuditLog] = useState<AuditLog[]>(SEEDED_AUDIT_LOG);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all');

  const handleOpenCreate = () => {
    setSelectedMetricForEdit(null);
    setShowVoiceModal(true);
  };

  const handleOpenEdit = (metric: Metric) => {
    setSelectedMetricForEdit(metric);
    setShowVoiceModal(true);
  };

  const handleVoiceSubmit = (newDraft: Draft) => {
    setShowVoiceModal(false);
    setMetrics((prev) => {
      const exists = prev.find((m) => m.name === newDraft.name);
      const newEntry: Metric = {
        id: exists ? exists.id : `m_${Date.now()}`,
        name: newDraft.name,
        def: newDraft.logic,
        status: 'pending_approval',
        confidence: 95,
        lastUpdated: 'Just now',
        author: 'You (Voice)',
        requester: 'You (Voice)',
        timestamp: 'Just now',
        code: newDraft.code,
      };
      if (exists) return prev.map((m) => (m.name === newDraft.name ? newEntry : m));
      return [newEntry, ...prev];
    });
    setAuditLog((prev) => [
      {
        id: Date.now(),
        action: 'CREATE_DRAFT',
        target: newDraft.name,
        actor: 'You (Voice)',
        time: 'Just now',
        hash: '0x1d...4b',
      },
      ...prev,
    ]);
    setFilter('pending');
  };

  const handleApprove = (id: string) => {
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'active' as const } : m)));
    setAuditLog((prev) => [
      {
        id: Date.now(),
        action: 'APPROVE_METRIC',
        target: metrics.find((m) => m.id === id)?.name || 'Unknown',
        actor: userRole,
        time: 'Just now',
        hash: '0x8f...2a',
      },
      ...prev,
    ]);
    setReviewItem(null);
  };

  const handleReject = (id: string) => {
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'rejected' as const } : m)));
    setReviewItem(null);
  };

  const filteredMetrics = metrics.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'active') return m.status === 'active';
    if (filter === 'pending') return m.status === 'pending_approval';
    return true;
  });

  const pendingCount = metrics.filter((m) => m.status === 'pending_approval').length;

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <div className="w-64 border-r border-slate-800 flex flex-col p-4 bg-slate-900/50">
        <div className="space-y-1 flex-1 mt-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Knowledge Base
          </div>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'metrics'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <GitBranch size={18} /> Semantic Layer
            </div>
            {pendingCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText size={18} /> Audit Log
            </div>
          </button>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
              AC
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Acme Corp</div>
              <div className="text-xs text-slate-400">{userRole}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-sm">
          <span className="text-white font-medium">
            {activeTab === 'metrics' ? 'Semantic Layer' : 'System Audit Log'}
          </span>
          <button
            onClick={() => setUserRole(userRole === 'Admin' ? 'Viewer' : 'Admin')}
            className="text-xs text-slate-500 hover:text-white underline"
          >
            Role: {userRole}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'metrics' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Semantic Rules</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage definitions and approvals.</p>
                </div>
                <button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                >
                  <Plus size={16} /> New Metric
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    filter === 'all'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  All Rules
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    filter === 'pending'
                      ? 'border-yellow-500 text-white'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Pending Approval{' '}
                  {pendingCount > 0 && (
                    <span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-1.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Business Logic</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredMetrics.map((m) => (
                      <tr
                        key={m.id}
                        className={`transition-colors group ${
                          m.status === 'pending_approval'
                            ? 'bg-yellow-500/5 hover:bg-yellow-500/10'
                            : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                          {m.name}
                          {m.status === 'pending_approval' && (
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono text-xs max-w-md truncate">{m.def}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={m.status} />
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          {m.status === 'pending_approval' ? (
                            <button
                              onClick={() => setReviewItem(m)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/20"
                            >
                              <Eye size={14} /> Review
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenEdit(m)}
                              className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredMetrics.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                          No rules found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'audit' && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Actor</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{log.time}</td>
                        <td className="px-6 py-4 text-white">{log.actor}</td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold px-2 py-1 rounded border bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{log.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showVoiceModal && (
        <VoiceArchitect
          onClose={() => setShowVoiceModal(false)}
          onSubmit={handleVoiceSubmit}
          initialRule={selectedMetricForEdit}
        />
      )}
      {reviewItem && (
        <ImpactReviewModal
          approvalItem={reviewItem}
          onClose={() => setReviewItem(null)}
          onApprove={() => handleApprove(reviewItem.id)}
          onReject={() => handleReject(reviewItem.id)}
        />
      )}
    </div>
  );
}

