import {
  Metric,
  AuditLog,
  SimulationData,
  UnmatchedField,
  CanonicalField,
  LineageData,
  LineageNode,
  LineageEdge,
  SuccessMetric,
  ActivityItem,
  AIExplanation,
} from '@/types';

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

export const LINEAGE_DATA: Record<string, LineageData> = {
  'm_001': {
    nodes: [
      // Source Fields
      { id: 'sf_gross', type: 'source_field', label: 'gross_sales', description: 'transactions.gross_sales', metadata: { table: 'transactions', type: 'decimal' } },
      { id: 'sf_returns', type: 'source_field', label: 'returns', description: 'transactions.returns', metadata: { table: 'transactions', type: 'decimal' } },
      { id: 'sf_tax', type: 'source_field', label: 'tax', description: 'transactions.tax', metadata: { table: 'transactions', type: 'decimal' } },
      { id: 'sf_discount', type: 'source_field', label: 'discount_amount', description: 'transactions.discount', metadata: { table: 'transactions', type: 'decimal' } },
      { id: 'sf_shipping', type: 'source_field', label: 'shipping_cost', description: 'transactions.shipping', metadata: { table: 'transactions', type: 'decimal' } },
      // Canonical Fields
      { id: 'cf_revenue', type: 'canonical_field', label: 'revenue', description: 'Canonical Revenue Field', metadata: { category: 'revenue' } },
      { id: 'cf_returns', type: 'canonical_field', label: 'returns', description: 'Canonical Returns Field', metadata: { category: 'revenue' } },
      { id: 'cf_tax', type: 'canonical_field', label: 'tax', description: 'Canonical Tax Field', metadata: { category: 'financial' } },
      // Metric
      { id: 'm_001', type: 'metric', label: 'Net Revenue', description: 'Gross Sales - Returns - Tax' },
      // Usage
      { id: 'usage_dash', type: 'usage', label: 'Executive Dashboard', description: 'Q4 Revenue Report' },
      { id: 'usage_report', type: 'usage', label: 'Monthly P&L Report', description: 'Financial Statements' },
      { id: 'usage_api', type: 'usage', label: 'Revenue API', description: 'External API Endpoint' },
    ],
    edges: [
      { id: 'e1', source: 'sf_gross', target: 'cf_revenue', type: 'mapping', label: 'Auto-mapped (95%)' },
      { id: 'e2', source: 'sf_returns', target: 'cf_returns', type: 'mapping', label: 'Auto-mapped (98%)' },
      { id: 'e3', source: 'sf_tax', target: 'cf_tax', type: 'mapping', label: 'Auto-mapped (100%)' },
      { id: 'e4', source: 'sf_discount', target: 'cf_revenue', type: 'mapping', label: 'Auto-mapped (87%)' },
      { id: 'e5', source: 'cf_revenue', target: 'm_001', type: 'transformation', label: 'Calculation' },
      { id: 'e6', source: 'cf_returns', target: 'm_001', type: 'transformation', label: 'Subtraction' },
      { id: 'e7', source: 'cf_tax', target: 'm_001', type: 'transformation', label: 'Subtraction' },
      { id: 'e8', source: 'm_001', target: 'usage_dash', type: 'usage', label: 'Used in' },
      { id: 'e9', source: 'm_001', target: 'usage_report', type: 'usage', label: 'Used in' },
      { id: 'e10', source: 'm_001', target: 'usage_api', type: 'usage', label: 'Exposed via' },
    ],
  },
  'm_002': {
    nodes: [
      // Source Fields
      { id: 'sf_cogs', type: 'source_field', label: 'cogs', description: 'products.cost_of_goods', metadata: { table: 'products', type: 'decimal' } },
      { id: 'sf_inventory', type: 'source_field', label: 'inventory_cost', description: 'products.inventory_value', metadata: { table: 'products', type: 'decimal' } },
      { id: 'sf_labor', type: 'source_field', label: 'labor_cost', description: 'products.manufacturing_labor', metadata: { table: 'products', type: 'decimal' } },
      { id: 'sf_materials', type: 'source_field', label: 'material_cost', description: 'products.raw_materials', metadata: { table: 'products', type: 'decimal' } },
      { id: 'sf_shipping_cost', type: 'source_field', label: 'shipping_cost', description: 'orders.shipping_fee', metadata: { table: 'orders', type: 'decimal' } },
      // Canonical Fields
      { id: 'cf_revenue', type: 'canonical_field', label: 'revenue', description: 'Canonical Revenue Field', metadata: { category: 'revenue' } },
      { id: 'cf_cogs', type: 'canonical_field', label: 'cost_of_goods', description: 'Canonical COGS Field', metadata: { category: 'financial' } },
      { id: 'cf_shipping', type: 'canonical_field', label: 'shipping_cost', description: 'Canonical Shipping Field', metadata: { category: 'financial' } },
      // Metrics
      { id: 'm_001', type: 'metric', label: 'Net Revenue', description: 'Used as input' },
      { id: 'm_002', type: 'metric', label: 'Gross Margin', description: 'Net Revenue - COGS' },
      // Usage
      { id: 'usage_finance', type: 'usage', label: 'Finance Dashboard', description: 'Margin Analysis' },
      { id: 'usage_ops', type: 'usage', label: 'Operations Dashboard', description: 'Cost Tracking' },
    ],
    edges: [
      { id: 'e1', source: 'sf_cogs', target: 'cf_cogs', type: 'mapping', label: 'Auto-mapped (100%)' },
      { id: 'e2', source: 'sf_inventory', target: 'cf_cogs', type: 'mapping', label: 'Auto-mapped (92%)' },
      { id: 'e3', source: 'sf_labor', target: 'cf_cogs', type: 'mapping', label: 'Auto-mapped (88%)' },
      { id: 'e4', source: 'sf_materials', target: 'cf_cogs', type: 'mapping', label: 'Auto-mapped (95%)' },
      { id: 'e5', source: 'sf_shipping_cost', target: 'cf_shipping', type: 'mapping', label: 'Auto-mapped (98%)' },
      { id: 'e6', source: 'm_001', target: 'm_002', type: 'dependency', label: 'Depends on' },
      { id: 'e7', source: 'cf_cogs', target: 'm_002', type: 'transformation', label: 'Subtraction' },
      { id: 'e8', source: 'm_002', target: 'usage_finance', type: 'usage', label: 'Used in' },
      { id: 'e9', source: 'm_002', target: 'usage_ops', type: 'usage', label: 'Used in' },
    ],
  },
  'm_003': {
    nodes: [
      // Source Fields
      { id: 'sf_status', type: 'source_field', label: 'subscription_status', description: 'subscriptions.status', metadata: { table: 'subscriptions', type: 'varchar' } },
      { id: 'sf_cancelled', type: 'source_field', label: 'is_cancelled', description: 'subscriptions.cancelled', metadata: { table: 'subscriptions', type: 'boolean' } },
      { id: 'sf_plan_type', type: 'source_field', label: 'plan_type', description: 'subscriptions.plan', metadata: { table: 'subscriptions', type: 'varchar' } },
      { id: 'sf_trial', type: 'source_field', label: 'is_trial', description: 'subscriptions.trial_flag', metadata: { table: 'subscriptions', type: 'boolean' } },
      { id: 'sf_grace', type: 'source_field', label: 'grace_period', description: 'subscriptions.grace_period_status', metadata: { table: 'subscriptions', type: 'varchar' } },
      { id: 'sf_total_subs', type: 'source_field', label: 'total_subscriptions', description: 'subscriptions.count', metadata: { table: 'subscriptions', type: 'integer' } },
      // Canonical Fields
      { id: 'cf_status', type: 'canonical_field', label: 'subscription_status', description: 'Canonical Status Field', metadata: { category: 'subscription' } },
      { id: 'cf_plan_type', type: 'canonical_field', label: 'plan_type', description: 'Canonical Plan Type Field', metadata: { category: 'subscription' } },
      { id: 'cf_cancellation', type: 'canonical_field', label: 'cancellation', description: 'Canonical Cancellation Field', metadata: { category: 'subscription' } },
      // Metric
      { id: 'm_003', type: 'metric', label: 'Churn Rate (Strict)', description: 'Cancellations / Total Subs' },
      // Usage
      { id: 'usage_product', type: 'usage', label: 'Product Dashboard', description: 'Churn Analysis' },
      { id: 'usage_alert', type: 'usage', label: 'Churn Alert System', description: 'Real-time Monitoring' },
    ],
    edges: [
      { id: 'e1', source: 'sf_status', target: 'cf_status', type: 'mapping', label: 'Auto-mapped (93%)' },
      { id: 'e2', source: 'sf_cancelled', target: 'cf_cancellation', type: 'mapping', label: 'Auto-mapped (97%)' },
      { id: 'e3', source: 'sf_plan_type', target: 'cf_plan_type', type: 'mapping', label: 'Auto-mapped (100%)' },
      { id: 'e4', source: 'sf_trial', target: 'cf_plan_type', type: 'mapping', label: 'Filter: Exclude' },
      { id: 'e5', source: 'sf_grace', target: 'cf_status', type: 'mapping', label: 'Filter: Exclude' },
      { id: 'e6', source: 'cf_cancellation', target: 'm_003', type: 'transformation', label: 'Count Filter' },
      { id: 'e7', source: 'cf_plan_type', target: 'm_003', type: 'transformation', label: 'Filter Applied' },
      { id: 'e8', source: 'sf_total_subs', target: 'm_003', type: 'transformation', label: 'Denominator' },
      { id: 'e9', source: 'm_003', target: 'usage_product', type: 'usage', label: 'Used in' },
      { id: 'e10', source: 'm_003', target: 'usage_alert', type: 'usage', label: 'Monitored by' },
    ],
  },
};

export const SUCCESS_METRICS: SuccessMetric[] = [
  {
    id: 'sm_001',
    label: 'Metrics Created',
    value: 142,
    unit: 'metrics',
    trend: 'up',
    trendValue: 12,
    icon: 'BarChart2',
  },
  {
    id: 'sm_002',
    label: 'Time Saved',
    value: 3.5,
    unit: 'hours',
    trend: 'up',
    trendValue: 0.5,
    icon: 'Clock',
  },
  {
    id: 'sm_003',
    label: 'Non-Technical Users',
    value: 5,
    unit: 'users',
    trend: 'up',
    trendValue: 2,
    icon: 'User',
  },
  {
    id: 'sm_004',
    label: 'Avg. Creation Time',
    value: 2.5,
    unit: 'minutes',
    trend: 'down',
    trendValue: 0.8,
    icon: 'Zap',
  },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'metric_created',
    actor: 'Sarah (Marketing)',
    target: 'Customer Acquisition Cost',
    timestamp: '5m ago',
    details: 'Created via Voice Architect',
  },
  {
    id: 'act_002',
    type: 'metric_approved',
    actor: 'Admin',
    target: 'Churn Rate (Strict)',
    timestamp: '15m ago',
  },
  {
    id: 'act_003',
    type: 'field_mapped',
    actor: 'You',
    target: 'custom_revenue_category → revenue_segment',
    timestamp: '1h ago',
  },
  {
    id: 'act_004',
    type: 'mapping_accepted',
    actor: 'Alice (CFO)',
    target: 'Accepted 3 AI suggestions',
    timestamp: '2h ago',
  },
  {
    id: 'act_005',
    type: 'metric_created',
    actor: 'John (Sales)',
    target: 'Sales Velocity',
    timestamp: '3h ago',
    details: 'Created via Voice Architect',
  },
];

export const AI_EXPLANATIONS: Record<string, AIExplanation> = {
  'uf_001': {
    confidence: 87,
    breakdown: {
      fieldNameSimilarity: 85,
      dataTypeMatch: 100,
      contextClues: 75,
      historicalPatterns: 88,
    },
    reasoning: 'Field name "custom_revenue_category" contains "revenue" which strongly matches "revenue_segment". Sample value "Enterprise Sales" indicates segmentation use case.',
    alternatives: [
      {
        canonicalFieldId: 'cf_007',
        confidence: 65,
        reason: 'Could also map to "revenue_type" but "segment" is more specific for categorization.',
      },
    ],
    learningIndicator: {
      basedOnMappings: 142,
      improvement: 5,
    },
  },
  'uf_002': {
    confidence: 92,
    breakdown: {
      fieldNameSimilarity: 90,
      dataTypeMatch: 100,
      contextClues: 95,
      historicalPatterns: 93,
    },
    reasoning: 'High confidence match. "client_region_code" clearly indicates geographic region. Sample value "NA-WEST" confirms regional coding pattern.',
    learningIndicator: {
      basedOnMappings: 142,
      improvement: 3,
    },
  },
  'uf_003': {
    confidence: 78,
    breakdown: {
      fieldNameSimilarity: 70,
      dataTypeMatch: 80,
      contextClues: 85,
    },
    reasoning: 'Moderate confidence. "product_line_id" is an ID field that likely maps to product categorization. Integer type suggests it\'s a foreign key reference.',
    alternatives: [
      {
        canonicalFieldId: 'cf_010',
        confidence: 72,
        reason: 'Could map to "product_line" but "product_category" is more appropriate for classification.',
      },
    ],
    learningIndicator: {
      basedOnMappings: 142,
      improvement: 8,
    },
  },
};

