'use client';

import { useState, useEffect } from 'react';
import { Filter, X, Search, Calendar } from 'lucide-react';
import { AuditLog, AuditLogCategory, AuditLogSeverity, AuditLogStatus } from '@/types';

interface AuditLogFiltersProps {
  logs: AuditLog[];
  onFilterChange: (filteredLogs: AuditLog[]) => void;
}

export function AuditLogFilters({ logs, onFilterChange }: AuditLogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AuditLogCategory | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditLogSeverity | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AuditLogStatus | 'ALL'>('ALL');
  const [selectedActor, setSelectedActor] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<'ALL' | '1h' | '24h' | '7d' | '30d'>('ALL');
  const [showFilters, setShowFilters] = useState(true);

  const categories: AuditLogCategory[] = ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'QUERY', 'AUTH', 'CONFIG', 'EXPORT', 'OTHER'];
  const severities: AuditLogSeverity[] = ['info', 'warning', 'error', 'critical'];
  const statuses: AuditLogStatus[] = ['success', 'failed', 'pending'];
  const actors = Array.from(new Set(logs.map(log => log.actor)));

  const applyFilters = () => {
    let filtered = [...logs];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(query) ||
        log.target.toLowerCase().includes(query) ||
        log.actor.toLowerCase().includes(query) ||
        log.ipAddress?.toLowerCase().includes(query) ||
        log.requestId?.toLowerCase().includes(query) ||
        log.correlationId?.toLowerCase().includes(query)
      );
    }

    // Category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Severity
    if (selectedSeverity !== 'ALL') {
      filtered = filtered.filter(log => log.severity === selectedSeverity);
    }

    // Status
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(log => log.status === selectedStatus);
    }

    // Actor
    if (selectedActor !== 'ALL') {
      filtered = filtered.filter(log => log.actor === selectedActor);
    }

    // Date range
    if (dateRange !== 'ALL') {
      const now = Date.now();
      const ranges: Record<string, number> = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now - ranges[dateRange];
      filtered = filtered.filter(log => log.timestamp.getTime() >= cutoff);
    }

    onFilterChange(filtered);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedSeverity, selectedStatus, selectedActor, dateRange, logs]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedSeverity('ALL');
    setSelectedStatus('ALL');
    setSelectedActor('ALL');
    setDateRange('ALL');
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, selectedSeverity, selectedStatus, selectedActor, dateRange]);

  const activeFilterCount = [
    searchQuery,
    selectedCategory !== 'ALL',
    selectedSeverity !== 'ALL',
    selectedStatus !== 'ALL',
    selectedActor !== 'ALL',
    dateRange !== 'ALL',
  ].filter(Boolean).length;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search actions, targets, actors, IPs, request IDs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value as AuditLogCategory | 'ALL');
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => {
                  setSelectedSeverity(e.target.value as AuditLogSeverity | 'ALL');
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Severities</option>
                {severities.map(sev => (
                  <option key={sev} value={sev}>{sev.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as AuditLogStatus | 'ALL');
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Actor */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Actor</label>
              <select
                value={selectedActor}
                onChange={(e) => {
                  setSelectedActor(e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Actors</option>
                {actors.map(actor => (
                  <option key={actor} value={actor}>{actor}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <Calendar size={12} /> Time Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value as typeof dateRange);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Time</option>
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

