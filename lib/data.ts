import { Metric, AuditLog, SimulationData } from '@/types';

export const SEEDED_METRICS: Metric[] = [
  { 
    id: 'm_001', 
    name: 'Net Revenue', 
    def: 'Gross Sales - Returns - Tax (Verified against SAP 4-4-5 Calendar)', 
    status: 'active', 
    confidence: 99, 
    lastUpdated: '2h ago', 
    author: 'System',
    code: "measures: { net_revenue: { sql: `${gross} - ${returns} - ${tax}`, type: 'currency' } }"
  },
  { 
    id: 'm_002', 
    name: 'Gross Margin', 
    def: 'Net Revenue - COGS. Includes Shipping, Excludes Marketing Spend.', 
    status: 'active', 
    confidence: 95, 
    lastUpdated: '1d ago', 
    author: 'Alice (CFO)',
    code: "measures: { margin: { sql: `${net_revenue} - ${cogs}`, filters: [{ sql: `${dept} != 'Marketing'` }] } }"
  },
  { 
    id: 'm_003', 
    name: 'Churn Rate (Strict)', 
    def: 'Cancellations / Total Subs. Exclude "Trial" users and "Grace Period" status.', 
    status: 'pending_approval', 
    confidence: 88, 
    lastUpdated: '15m ago', 
    author: 'You (Voice)',
    requester: 'You (Voice)',
    timestamp: '15m ago',
    code: "measures: { churn_strict: { type: 'count', filters: [{ sql: `${status} = 'cancelled'` }, { sql: `${plan_type} != 'trial'` }] } }"
  },
];

export const SEEDED_AUDIT_LOG: AuditLog[] = [
  { id: 901, action: 'CREATE_DRAFT', target: 'Churn Rate (Strict)', actor: 'Alice (CFO)', time: '15m ago', hash: '0x1d...4b' },
  { id: 902, action: 'APPROVE_METRIC', target: 'Gross Margin', actor: 'Admin', time: '1d ago', hash: '0x8f...2a' },
];

export const SIMULATION_DATA: SimulationData[] = [
  { period: 'Q1 2024', old: 1200000, new: 1150000 },
  { period: 'Q2 2024', old: 1350000, new: 1280000 },
  { period: 'Q3 2024', old: 1100000, new: 1050000 },
];

