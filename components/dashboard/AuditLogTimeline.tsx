'use client';

import { AuditLog } from '@/types';
import { Activity } from 'lucide-react';

interface AuditLogTimelineProps {
  logs: AuditLog[];
}

export function AuditLogTimeline({ logs }: AuditLogTimelineProps) {
  // Group logs by hour
  const logsByHour = logs.reduce((acc, log) => {
    const hour = new Date(log.timestamp);
    hour.setMinutes(0, 0, 0);
    const key = hour.toISOString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(log);
    return acc;
  }, {} as Record<string, AuditLog[]>);

  const sortedHours = Object.keys(logsByHour).sort().reverse();

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      critical: 'bg-purple-500',
    };
    return colors[severity as keyof typeof colors] || 'bg-slate-500';
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={18} className="text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Action Timeline</h3>
      </div>

      <div className="space-y-6">
        {sortedHours.map((hourKey) => {
          const hourLogs = logsByHour[hourKey];
          const hour = new Date(hourKey);

          return (
            <div key={hourKey} className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700"></div>

              {/* Hour marker */}
              <div className="flex items-start gap-4">
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-slate-800 border-2 border-slate-700 rounded-full">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-sm font-semibold text-white mb-4">
                    {hour.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>

                  {/* Logs for this hour */}
                  <div className="space-y-3">
                    {hourLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`}
                              ></div>
                              <span className="text-sm font-semibold text-white">{log.action}</span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-400">{log.category}</span>
                            </div>
                            <div className="text-sm text-slate-300 mb-1">{log.target}</div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{log.actor}</span>
                              <span>•</span>
                              <span>{log.time}</span>
                              {log.duration && (
                                <>
                                  <span>•</span>
                                  <span>{log.duration}ms</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-[10px] font-semibold ${
                            log.status === 'success'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : log.status === 'failed'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {log.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedHours.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No logs to display in timeline
        </div>
      )}
    </div>
  );
}

