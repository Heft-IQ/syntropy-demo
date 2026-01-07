import { Metric, AuditLog, SimulationData, UnmatchedField, CanonicalField } from '@/types';

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

export const UNMATCHED_FIELDS: UnmatchedField[] = [
  {
    id: 'uf_001',
    sourceField: 'custom_revenue_category',
    sourceTable: 'transactions',
    dataType: 'varchar(100)',
    sampleValue: 'Enterprise Sales',
    suggestedMapping: 'revenue_segment',
    confidence: 87,
  },
  {
    id: 'uf_002',
    sourceField: 'client_region_code',
    sourceTable: 'customers',
    dataType: 'varchar(10)',
    sampleValue: 'NA-WEST',
    suggestedMapping: 'geographic_region',
    confidence: 92,
  },
  {
    id: 'uf_003',
    sourceField: 'product_line_id',
    sourceTable: 'products',
    dataType: 'integer',
    sampleValue: '4501',
    suggestedMapping: 'product_category',
    confidence: 78,
  },
  {
    id: 'uf_004',
    sourceField: 'contract_start_date',
    sourceTable: 'subscriptions',
    dataType: 'date',
    sampleValue: '2024-01-15',
    suggestedMapping: 'subscription_start_date',
    confidence: 95,
  },
  {
    id: 'uf_005',
    sourceField: 'payment_processor_fee',
    sourceTable: 'payments',
    dataType: 'decimal(10,2)',
    sampleValue: '2.50',
    suggestedMapping: 'transaction_fee',
    confidence: 89,
  },
  {
    id: 'uf_006',
    sourceField: 'customer_tier_level',
    sourceTable: 'customers',
    dataType: 'varchar(20)',
    sampleValue: 'Premium',
  },
];

export const CANONICAL_FIELDS: CanonicalField[] = [
  {
    id: 'cf_001',
    name: 'revenue_segment',
    description: 'Categorization of revenue by business segment',
    category: 'revenue',
  },
  {
    id: 'cf_002',
    name: 'geographic_region',
    description: 'Standardized geographic region codes',
    category: 'location',
  },
  {
    id: 'cf_003',
    name: 'product_category',
    description: 'Product classification and categorization',
    category: 'product',
  },
  {
    id: 'cf_004',
    name: 'subscription_start_date',
    description: 'Date when subscription period begins',
    category: 'subscription',
  },
  {
    id: 'cf_005',
    name: 'transaction_fee',
    description: 'Fees associated with financial transactions',
    category: 'financial',
  },
  {
    id: 'cf_006',
    name: 'customer_segment',
    description: 'Customer classification and segmentation',
    category: 'customer',
  },
  {
    id: 'cf_007',
    name: 'revenue_type',
    description: 'Type classification of revenue streams',
    category: 'revenue',
  },
  {
    id: 'cf_008',
    name: 'sales_channel',
    description: 'Channel through which sales occurred',
    category: 'sales',
  },
  {
    id: 'cf_009',
    name: 'customer_lifetime_value',
    description: 'Calculated lifetime value of customer',
    category: 'customer',
  },
  {
    id: 'cf_010',
    name: 'product_line',
    description: 'Product line or family classification',
    category: 'product',
  },
];

