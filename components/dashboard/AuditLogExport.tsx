'use client';

import { Download, FileText, Code } from 'lucide-react';
import { AuditLog } from '@/types';

interface AuditLogExportProps {
  logs: AuditLog[];
}

export function AuditLogExport({ logs }: AuditLogExportProps) {
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Timestamp',
      'Time',
      'Actor',
      'Action',
      'Category',
      'Target',
      'Severity',
      'Status',
      'IP Address',
      'Session ID',
      'Request ID',
      'Correlation ID',
      'Duration (ms)',
      'Compliance Hash',
    ];

    const rows = logs.map(log => [
      log.id.toString(),
      log.timestamp.toISOString(),
      log.time,
      log.actor,
      log.action,
      log.category,
      log.target,
      log.severity,
      log.status,
      log.ipAddress || '',
      log.sessionId || '',
      log.requestId || '',
      log.correlationId || '',
      log.duration?.toString() || '',
      log.complianceHash || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_log_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToCSV}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-white transition-colors"
      >
        <FileText size={16} />
        Export CSV
      </button>
      <button
        onClick={exportToJSON}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-white transition-colors"
      >
        <Code size={16} />
        Export JSON
      </button>
      <div className="text-xs text-slate-500 ml-2">
        ({logs.length} {logs.length === 1 ? 'entry' : 'entries'})
      </div>
    </div>
  );
}

