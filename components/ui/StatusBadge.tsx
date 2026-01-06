'use client';

import { CheckCircle, Clock, Activity, AlertTriangle } from 'lucide-react';
import { MetricStatus } from '@/types';

interface StatusBadgeProps {
  status: MetricStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<MetricStatus, string> = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending_approval: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const icons: Record<MetricStatus, React.ReactNode> = {
    active: <CheckCircle size={12} />,
    pending_approval: <Clock size={12} />,
    draft: <Activity size={12} />,
    rejected: <AlertTriangle size={12} />,
  };

  const label = status
    ? status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)
    : 'Unknown';

  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
        styles[status] || styles.draft
      }`}
    >
      {icons[status] || icons.draft}
      {label}
    </span>
  );
}

