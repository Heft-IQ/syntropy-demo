'use client';

import { BarChart2, Clock, User, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { SuccessMetric, ActivityItem } from '@/types';
import { SUCCESS_METRICS, ACTIVITY_FEED } from '@/lib/data';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BarChart2,
  Clock,
  User,
  Zap,
};

export function QuickWinsDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Quick Wins</h2>
        <p className="text-slate-400 text-sm">See the immediate value Syntropy delivers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUCCESS_METRICS.map((metric) => {
          const Icon = iconMap[metric.icon || 'BarChart2'];
          return (
            <div
              key={metric.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-indigo-400" />
                </div>
                {metric.trend && (
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {metric.trend === 'up' ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {metric.trendValue}
                    {metric.unit === 'hours' ? 'h' : metric.unit === 'minutes' ? 'm' : ''}
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {metric.value}
                {metric.unit && <span className="text-lg text-slate-400 ml-1">{metric.unit}</span>}
              </div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {ACTIVITY_FEED.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-slate-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                  {activity.actor.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">
                    <span className="font-medium">{activity.actor}</span>{' '}
                    <span className="text-slate-400">
                      {activity.type === 'metric_created' && 'created'}
                      {activity.type === 'metric_approved' && 'approved'}
                      {activity.type === 'field_mapped' && 'mapped'}
                      {activity.type === 'mapping_accepted' && 'accepted'}
                    </span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </div>
                  {activity.details && (
                    <div className="text-xs text-slate-500 mt-1">{activity.details}</div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Before vs After Syntropy</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Time to Create Metric</span>
                <span className="text-xs text-slate-500">Before: 2 hours → After: 2.5 min</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500/20" style={{ width: '100%' }}></div>
                <div className="h-full bg-green-500 -mt-3" style={{ width: '2%' }}></div>
              </div>
              <div className="text-xs text-green-400 mt-1 font-medium">98% faster</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Technical Skills Required</span>
                <span className="text-xs text-slate-500">Before: SQL Expert → After: Business User</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500/20" style={{ width: '100%' }}></div>
                <div className="h-full bg-green-500 -mt-3" style={{ width: '20%' }}></div>
              </div>
              <div className="text-xs text-green-400 mt-1 font-medium">80% reduction</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Metric Governance</span>
                <span className="text-xs text-slate-500">Before: Manual → After: Automated</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500/20" style={{ width: '100%' }}></div>
                <div className="h-full bg-green-500 -mt-3" style={{ width: '100%' }}></div>
              </div>
              <div className="text-xs text-green-400 mt-1 font-medium">100% automated</div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="text-sm text-slate-300">
                <span className="font-bold text-white">ROI:</span> 3.5 hours saved per metric × 142 metrics ={' '}
                <span className="font-bold text-green-400">497 hours saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

