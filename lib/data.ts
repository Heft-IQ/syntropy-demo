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
  ComponentDemo,
  FlowConnection,
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
  {
    id: 901,
    action: 'CREATE_DRAFT',
    target: 'Churn Rate (Strict)',
    actor: 'Alice (CFO)',
    time: '15m ago',
    hash: '0x1d...4b',
    category: 'CREATE',
    severity: 'info',
    status: 'success',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_abc123def456',
    requestId: 'req_789xyz',
    correlationId: 'corr_001_20240115',
    before: null,
    after: {
      name: 'Churn Rate (Strict)',
      definition: 'Cancellations / Total Subs. Exclude "Trial" users and "Grace Period" status.',
      status: 'draft',
    },
    diff: '+ Added new metric definition',
    metadata: {
      source: 'voice_interface',
      confidence: 88,
      justification: 'Need stricter churn calculation excluding trial users',
    },
    duration: 234,
    relatedActions: [],
    complianceHash: 'sha256:a1b2c3d4e5f6...',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 902,
    action: 'APPROVE_METRIC',
    target: 'Gross Margin',
    actor: 'Admin',
    time: '1d ago',
    hash: '0x8f...2a',
    category: 'APPROVE',
    severity: 'info',
    status: 'success',
    ipAddress: '10.0.0.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_admin789',
    requestId: 'req_456abc',
    correlationId: 'corr_002_20240114',
    before: {
      status: 'pending_approval',
      confidence: 95,
    },
    after: {
      status: 'active',
      confidence: 95,
      approvedBy: 'Admin',
      approvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    diff: 'status: pending_approval → active',
    metadata: {
      reviewDuration: '2h 15m',
      impactAnalysis: 'passed',
      testResults: 'all_passed',
    },
    duration: 156,
    relatedActions: [901],
    complianceHash: 'sha256:f6e5d4c3b2a1...',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 903,
    action: 'UPDATE_METRIC',
    target: 'Net Revenue',
    actor: 'Bob (Data Engineer)',
    time: '3h ago',
    hash: '0x3c...9d',
    category: 'UPDATE',
    severity: 'warning',
    status: 'success',
    ipAddress: '172.16.0.23',
    userAgent: 'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36',
    sessionId: 'sess_eng456',
    requestId: 'req_321xyz',
    correlationId: 'corr_003_20240115',
    before: {
      definition: 'Gross Sales - Returns - Tax',
      code: 'measures: { net_revenue: { sql: `${gross} - ${returns} - ${tax}` } }',
    },
    after: {
      definition: 'Gross Sales - Returns - Tax (Verified against SAP 4-4-5 Calendar)',
      code: 'measures: { net_revenue: { sql: `${gross} - ${returns} - ${tax}`, calendar: "sap_4_4_5" } }',
    },
    diff: 'Added calendar verification to definition and code',
    metadata: {
      reason: 'Compliance requirement for SAP calendar alignment',
      breakingChange: false,
      affectedQueries: 12,
    },
    duration: 412,
    relatedActions: [],
    complianceHash: 'sha256:9d8c7b6a5f4e...',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 904,
    action: 'QUERY_METRIC',
    target: 'Gross Margin',
    actor: 'Carol (Analyst)',
    time: '45m ago',
    hash: '0x5e...1f',
    category: 'QUERY',
    severity: 'info',
    status: 'success',
    ipAddress: '192.168.1.78',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_analyst123',
    requestId: 'req_654def',
    correlationId: 'corr_004_20240115',
    before: null,
    after: {
      query: 'SELECT * FROM metrics WHERE name = "Gross Margin"',
      filters: { dateRange: 'Q1 2024', region: 'North America' },
    },
    diff: null,
    metadata: {
      queryType: 'analytical',
      rowCount: 1250,
      executionTime: 234,
      cacheHit: true,
    },
    duration: 234,
    relatedActions: [],
    complianceHash: 'sha256:1f2e3d4c5b6a...',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: 905,
    action: 'REJECT_METRIC',
    target: 'Customer Lifetime Value',
    actor: 'Admin',
    time: '2d ago',
    hash: '0x7a...3b',
    category: 'REJECT',
    severity: 'warning',
    status: 'success',
    ipAddress: '10.0.0.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_admin789',
    requestId: 'req_987ghi',
    correlationId: 'corr_005_20240113',
    before: {
      status: 'pending_approval',
    },
    after: {
      status: 'rejected',
      rejectionReason: 'Definition conflicts with existing CLV metric',
    },
    diff: 'status: pending_approval → rejected',
    metadata: {
      rejectionReason: 'Duplicate metric definition',
      suggestedAction: 'Use existing CLV metric or rename',
    },
    duration: 89,
    relatedActions: [],
    complianceHash: 'sha256:3b4c5d6e7f8a...',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 906,
    action: 'EXPORT_DATA',
    target: 'Audit Log',
    actor: 'Admin',
    time: '1h ago',
    hash: '0x9c...5d',
    category: 'EXPORT',
    severity: 'info',
    status: 'success',
    ipAddress: '10.0.0.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_admin789',
    requestId: 'req_147jkl',
    correlationId: 'corr_006_20240115',
    before: null,
    after: {
      format: 'CSV',
      recordCount: 1250,
      filters: { dateRange: 'last_30_days', severity: 'all' },
    },
    diff: null,
    metadata: {
      exportType: 'audit_log',
      fileSize: '2.4 MB',
      includesMetadata: true,
    },
    duration: 1234,
    relatedActions: [],
    complianceHash: 'sha256:5d6e7f8a9b0c...',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 907,
    action: 'AUTH_FAILED',
    target: 'API Endpoint: /api/metrics',
    actor: 'Unknown',
    time: '30m ago',
    hash: '0x2e...7f',
    category: 'AUTH',
    severity: 'error',
    status: 'failed',
    ipAddress: '203.0.113.45',
    userAgent: 'curl/7.68.0',
    sessionId: null,
    requestId: 'req_258mno',
    correlationId: 'corr_007_20240115',
    before: null,
    after: null,
    diff: null,
    metadata: {
      errorCode: 'AUTH_401',
      errorMessage: 'Invalid JWT token',
      attemptCount: 3,
      blocked: true,
    },
    duration: 12,
    relatedActions: [],
    complianceHash: 'sha256:7f8a9b0c1d2e...',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 908,
    action: 'CONFIG_UPDATE',
    target: 'System Settings',
    actor: 'Admin',
    time: '4h ago',
    hash: '0x4f...8a',
    category: 'CONFIG',
    severity: 'warning',
    status: 'success',
    ipAddress: '10.0.0.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_admin789',
    requestId: 'req_369pqr',
    correlationId: 'corr_008_20240115',
    before: {
      cacheTimeout: 300,
      maxQueryRows: 10000,
    },
    after: {
      cacheTimeout: 600,
      maxQueryRows: 50000,
    },
    diff: 'cacheTimeout: 300 → 600, maxQueryRows: 10000 → 50000',
    metadata: {
      changeReason: 'Performance optimization',
      requiresRestart: false,
      impact: 'high',
    },
    duration: 567,
    relatedActions: [],
    complianceHash: 'sha256:8a9b0c1d2e3f...',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 909,
    action: 'DELETE_METRIC',
    target: 'Deprecated Revenue Metric',
    actor: 'Admin',
    time: '5d ago',
    hash: '0x6b...2c',
    category: 'DELETE',
    severity: 'critical',
    status: 'success',
    ipAddress: '10.0.0.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_admin789',
    requestId: 'req_741stu',
    correlationId: 'corr_009_20240110',
    before: {
      name: 'Deprecated Revenue Metric',
      status: 'active',
      usageCount: 0,
    },
    after: {
      status: 'deleted',
      deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    diff: 'status: active → deleted',
    metadata: {
      deletionReason: 'Replaced by Net Revenue metric',
      backupCreated: true,
      affectedDashboards: 0,
    },
    duration: 234,
    relatedActions: [],
    complianceHash: 'sha256:2c3d4e5f6a7b...',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 910,
    action: 'QUERY_METRIC',
    target: 'Churn Rate (Strict)',
    actor: 'Dave (Product Manager)',
    time: '20m ago',
    hash: '0x8d...4e',
    category: 'QUERY',
    severity: 'info',
    status: 'success',
    ipAddress: '192.168.1.92',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    sessionId: 'sess_pm456',
    requestId: 'req_852vwx',
    correlationId: 'corr_010_20240115',
    before: null,
    after: {
      query: 'SELECT churn_rate FROM metrics WHERE name = "Churn Rate (Strict)"',
      filters: { dateRange: 'last_quarter' },
    },
    diff: null,
    metadata: {
      queryType: 'analytical',
      rowCount: 89,
      executionTime: 156,
      cacheHit: false,
    },
    duration: 156,
    relatedActions: [901],
    complianceHash: 'sha256:4e5f6a7b8c9d...',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
  },
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

export const COMPONENT_DEMOS: Record<string, ComponentDemo> = {
  erp: {
    id: 'erp',
    name: 'ERP (NetSuite)',
    description: 'Enterprise Resource Planning system providing transactional data',
    responsibility: 'Source system that provides raw business data via REST API',
    category: 'data-source',
    dependencies: {
      dependsOn: [],
      dependedBy: ['worker'],
    },
    architectureContext: {
      position: 'Entry point of the ingestion pipeline',
      interactions: ['worker'],
      dataFlowIn: [],
      dataFlowOut: ['Raw JSON via REST API'],
    },
    examples: {
      data: {
        title: 'Sample API Response',
        language: 'json',
        content: `{
  "transactions": [
    {
      "id": "TXN-001",
      "date": "2024-01-15",
      "gross_sales": 125000.00,
      "returns": 2500.00,
      "tax": 10250.00,
      "customer_id": "CUST-1234"
    }
  ],
  "total_records": 15420,
  "extracted_at": "2024-01-15T10:30:00Z"
}`,
      },
      process: {
        title: 'Data Extraction Process',
        steps: [
          { step: '1. Authenticate', description: 'OAuth 2.0 token exchange with NetSuite API' },
          { step: '2. Query', description: 'Fetch transactions from last 24 hours' },
          { step: '3. Paginate', description: 'Handle large result sets with cursor-based pagination' },
          { step: '4. Transform', description: 'Normalize JSON structure for dlt pipeline' },
        ],
      },
      metrics: {
        title: 'Extraction Metrics',
        stats: [
          { label: 'Records Extracted', value: '15,420', unit: 'rows' },
          { label: 'Tables Scanned', value: 8, unit: 'tables' },
          { label: 'API Latency', value: '245', unit: 'ms' },
          { label: 'Data Size', value: '12.4', unit: 'MB' },
        ],
      },
    },
  },
  worker: {
    id: 'worker',
    name: 'dlt Worker',
    description: 'Data load tool worker that normalizes and transforms data',
    responsibility: 'ETL pipeline that standardizes data formats and schemas',
    category: 'etl',
    dependencies: {
      dependsOn: ['erp'],
      dependedBy: ['s3'],
    },
    architectureContext: {
      position: 'ETL layer in the ingestion pipeline',
      interactions: ['erp', 's3'],
      dataFlowIn: ['Raw JSON from ERP'],
      dataFlowOut: ['Normalized Parquet to S3'],
    },
    examples: {
      data: {
        title: 'Transformation Example',
        language: 'json',
        content: `Before (Raw):
{
  "cust_id": "1234",
  "order_date": "2024-01-15T10:30:00",
  "amt": 1250.50
}

After (Normalized):
{
  "customer_id": "1234",
  "order_date": "2024-01-15",
  "amount": 1250.50,
  "currency": "USD",
  "schema_version": "v2.1"
}`,
      },
      process: {
        title: 'Normalization Pipeline',
        steps: [
          { step: '1. Schema Detection', description: 'Auto-detect field types and constraints' },
          { step: '2. Field Mapping', description: 'Map to canonical field names' },
          { step: '3. Data Validation', description: 'Validate data types and ranges' },
          { step: '4. Format Standardization', description: 'Standardize dates, currencies, etc.' },
        ],
      },
      metrics: {
        title: 'Processing Metrics',
        stats: [
          { label: 'Records Processed', value: '15,420', unit: 'rows' },
          { label: 'Transformation Rate', value: '1,200', unit: 'rows/sec' },
          { label: 'Success Rate', value: '99.8', unit: '%' },
          { label: 'Processing Time', value: '12.8', unit: 'sec' },
        ],
      },
    },
  },
  s3: {
    id: 's3',
    name: 'S3 Bronze',
    description: 'Raw data lake storage organized by vendor connectors',
    responsibility: 'Immutable storage layer for raw ingested data with multi-vendor organization',
    category: 'storage',
    dependencies: {
      dependsOn: ['worker'],
      dependedBy: ['tinybird'],
    },
    architectureContext: {
      position: 'Bronze layer in the data lake architecture',
      interactions: ['worker', 'tinybird'],
      dataFlowIn: ['Normalized Parquet from dlt Worker'],
      dataFlowOut: ['Parquet files to Tinybird for processing'],
    },
    examples: {
      data: {
        title: 'Directory Structure (Multi-Vendor)',
        language: 'text',
        content: `/ingestion
  /connectors
    /netsuite_erp         # Finance Data
      __init__.py
      resource.py
    /salesforce_crm       # Sales Data
      __init__.py
      resource.py
  /pipelines
    run_finance_sync.py   # Entrypoint for NetSuite
    run_sales_sync.py     # Entrypoint for Salesforce
  /tests
    test_netsuite.py`,
      },
      process: {
        title: 'Ingestion Pipeline Structure',
        steps: [
          { step: '1. Connectors', description: 'Vendor-specific connectors (NetSuite ERP, Salesforce CRM)' },
          { step: '2. Pipelines', description: 'Entrypoint scripts for each vendor sync process' },
          { step: '3. Resources', description: 'Resource definitions for data extraction' },
          { step: '4. Tests', description: 'Unit tests for connector validation' },
        ],
      },
      metrics: {
        title: 'Storage Metrics',
        stats: [
          { label: 'Total Size', value: '3.2', unit: 'TB' },
          { label: 'Partitions', value: '1,247', unit: 'partitions' },
          { label: 'Files', value: '8,934', unit: 'files' },
          { label: 'Compression Ratio', value: '4.2', unit: 'x' },
        ],
      },
    },
  },
  tinybird: {
    id: 'tinybird',
    name: 'Tinybird (Silver/Gold)',
    description: 'Real-time analytics database for querying processed data',
    responsibility: 'High-performance columnar database for analytical queries',
    category: 'compute',
    dependencies: {
      dependsOn: ['s3'],
      dependedBy: ['cube'],
    },
    architectureContext: {
      position: 'Silver/Gold layer providing queryable analytics data',
      interactions: ['s3', 'cube'],
      dataFlowIn: ['Parquet from S3 Bronze', 'SQL queries from Cube Gateway'],
      dataFlowOut: ['Query results to Cube Gateway'],
    },
    examples: {
      data: {
        title: 'Query Example',
        language: 'sql',
        content: `SELECT 
  date_trunc('month', order_date) as month,
  SUM(gross_sales) as revenue,
  COUNT(*) as orders
FROM transactions
WHERE order_date >= '2024-01-01'
GROUP BY month
ORDER BY month DESC
LIMIT 12`,
      },
      process: {
        title: 'Query Execution',
        steps: [
          { step: '1. Parse Query', description: 'Validate SQL syntax and permissions' },
          { step: '2. Optimize', description: 'Generate optimal execution plan' },
          { step: '3. Execute', description: 'Scan partitions in parallel' },
          { step: '4. Aggregate', description: 'Compute aggregations in-memory' },
        ],
      },
      metrics: {
        title: 'Performance Metrics',
        stats: [
          { label: 'Query Latency', value: '45', unit: 'ms' },
          { label: 'Rows Scanned', value: '1.2M', unit: 'rows' },
          { label: 'Cache Hit Rate', value: '87', unit: '%' },
          { label: 'Throughput', value: '2,400', unit: 'qps' },
        ],
      },
    },
  },
  user: {
    id: 'user',
    name: 'User / Dashboard',
    description: 'End-user interface for accessing metrics and insights',
    responsibility: 'Frontend application for business users to query and visualize data',
    category: 'frontend',
    dependencies: {
      dependsOn: ['cube', 'clerk'],
      dependedBy: [],
    },
    architectureContext: {
      position: 'Frontend entry point for user interactions',
      interactions: ['cube', 'clerk'],
      dataFlowIn: ['Metric data from Cube Gateway', 'Auth tokens from Clerk'],
      dataFlowOut: ['Metric queries to Cube Gateway', 'Auth requests to Clerk'],
    },
    examples: {
      data: {
        title: 'User Request',
        language: 'json',
        content: `{
  "metric": "Net Revenue",
  "filters": {
    "date_range": "2024-Q1",
    "region": "North America"
  },
  "granularity": "monthly",
  "format": "chart"
}`,
      },
      process: {
        title: 'User Interaction Flow',
        steps: [
          { step: '1. Select Metric', description: 'User chooses metric from dashboard' },
          { step: '2. Apply Filters', description: 'User sets date range and filters' },
          { step: '3. Request Data', description: 'Frontend sends query to Cube Gateway' },
          { step: '4. Display Results', description: 'Render chart/table with results' },
        ],
      },
      metrics: {
        title: 'Usage Metrics',
        stats: [
          { label: 'Active Users', value: '142', unit: 'users' },
          { label: 'Queries Today', value: '8,934', unit: 'queries' },
          { label: 'Avg Session', value: '12.5', unit: 'min' },
          { label: 'Metrics Viewed', value: '67', unit: 'metrics' },
        ],
      },
    },
  },
  clerk: {
    id: 'clerk',
    name: 'Clerk Auth',
    description: 'Authentication and authorization service',
    responsibility: 'Manages user sessions, JWT tokens, and role-based permissions',
    category: 'auth',
    dependencies: {
      dependsOn: [],
      dependedBy: ['user', 'cube'],
    },
    architectureContext: {
      position: 'Authentication layer securing all API access',
      interactions: ['user', 'cube'],
      dataFlowIn: ['Auth requests from User/Dashboard', 'Token validation requests from Cube'],
      dataFlowOut: ['JWT tokens to User/Dashboard', 'Permission checks to Cube Gateway'],
    },
    examples: {
      data: {
        title: 'JWT Token Structure',
        language: 'json',
        content: `{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "user_abc123",
    "email": "alice@acme.com",
    "role": "CFO",
    "permissions": [
      "metrics:read",
      "metrics:approve",
      "metrics:create"
    ],
    "exp": 1705312800
  }
}`,
      },
      process: {
        title: 'Authentication Flow',
        steps: [
          { step: '1. Login', description: 'User authenticates with credentials' },
          { step: '2. Validate', description: 'Verify credentials and MFA if enabled' },
          { step: '3. Issue Token', description: 'Generate JWT with user claims' },
          { step: '4. Session', description: 'Create session and set cookies' },
        ],
      },
      metrics: {
        title: 'Auth Metrics',
        stats: [
          { label: 'Active Sessions', value: '142', unit: 'sessions' },
          { label: 'Auth Requests', value: '1,247', unit: 'requests' },
          { label: 'Success Rate', value: '99.2', unit: '%' },
          { label: 'Avg Auth Time', value: '120', unit: 'ms' },
        ],
      },
    },
  },
  cube: {
    id: 'cube',
    name: 'Cube Gateway',
    description: 'Semantic layer API gateway for metric queries',
    responsibility: 'Resolves metric definitions, checks permissions, and routes queries',
    category: 'api-gateway',
    dependencies: {
      dependsOn: ['clerk', 'falkordb', 'tinybird'],
      dependedBy: ['user'],
    },
    architectureContext: {
      position: 'Semantic layer gateway between frontend and data stores',
      interactions: ['user', 'clerk', 'falkordb', 'tinybird'],
      dataFlowIn: ['Metric queries from User', 'JWT tokens from Clerk', 'Schema from FalkorDB', 'Data from Tinybird'],
      dataFlowOut: ['Resolved queries to Tinybird', 'Schema queries to FalkorDB', 'Results to User'],
    },
    examples: {
      data: {
        title: 'Query Resolution',
        language: 'json',
        content: `Request:
{
  "metric": "Net Revenue",
  "filters": {"date": "2024-Q1"}
}

Resolved Query:
{
  "sql": "SELECT SUM(gross_sales - returns - tax) 
          FROM transactions 
          WHERE date >= '2024-01-01'",
  "permissions": "granted",
  "schema_source": "falkordb"
}`,
      },
      process: {
        title: 'Query Resolution Process',
        steps: [
          { step: '1. Authenticate', description: 'Validate JWT token with Clerk' },
          { step: '2. Check Permissions', description: 'Verify user can access metric' },
          { step: '3. Resolve Schema', description: 'Query FalkorDB for metric definition' },
          { step: '4. Transform', description: 'Convert to SQL and route to Tinybird' },
        ],
      },
      metrics: {
        title: 'Gateway Metrics',
        stats: [
          { label: 'Queries Processed', value: '8,934', unit: 'queries' },
          { label: 'Avg Latency', value: '12', unit: 'ms' },
          { label: 'Cache Hit Rate', value: '78', unit: '%' },
          { label: 'Error Rate', value: '0.1', unit: '%' },
        ],
      },
    },
  },
  falkordb: {
    id: 'falkordb',
    name: 'FalkorDB Graph',
    description: 'Knowledge Graph (Control Plane) storing mappings between Business Terms (Canonical), ERP Columns (Physical), and Access Control (RBAC)',
    responsibility: 'Maintains semantic relationships between canonical business terms, physical ERP assets, and access control policies',
    category: 'control-plane',
    dependencies: {
      dependsOn: [],
      dependedBy: ['cube'],
    },
    architectureContext: {
      position: 'Control plane providing semantic layer and metadata',
      interactions: ['cube'],
      dataFlowIn: ['Schema resolution queries from Cube Gateway'],
      dataFlowOut: ['Metric definitions and mappings to Cube Gateway'],
    },
    examples: {
      data: {
        title: 'Project Structure & Seeding Examples',
        language: 'text',
        content: `/graph
  /schema
    schema.cql            # Indexes and Constraints
  /seeds
    canonical_finance.cql # Base ontology (e.g. Revenue, Margin)
    rbac_policies.cql     # Roles and Scopes
  /queries
    resolve_metric.cypher # Standard queries used by the Agent

A. Creating the Canonical "Ideal" Model:
CREATE (:CanonicalEntity {name: 'Order', description: 'A commercial transaction'});
CREATE (:CanonicalAttribute {name: 'GrossRevenue', type: 'currency'});
CREATE (:CanonicalAttribute {name: 'CostOfGoods', type: 'currency'});

B. Registering Physical ERP Assets (Multi-Tenant):
// Register a NetSuite table for Customer A
CREATE (:VendorTable {name: 'TRANSACTION_LINES', source: 'netsuite', tenant_id: 'cust_acme'});
CREATE (:VendorColumn {name: 'AMOUNT_NET', type: 'float', tenant_id: 'cust_acme'});

// Register a SAP table for Customer B
CREATE (:VendorTable {name: 'BSEG', source: 'sap', tenant_id: 'cust_beta'});
CREATE (:VendorColumn {name: 'DMBTR', type: 'decimal', tenant_id: 'cust_beta'});

C. Creating the Semantic Map:
// Map NetSuite 'AMOUNT_NET' -> Canonical 'GrossRevenue'
MATCH (c:VendorColumn {name: 'AMOUNT_NET', tenant_id: 'cust_acme'})
MATCH (a:CanonicalAttribute {name: 'GrossRevenue'})
CREATE (c)-[:MAPS_TO {confidence: 0.98, author: 'auto_agent'}]->(a);`,
      },
      process: {
        title: 'Knowledge Graph Seeding & Resolution',
        steps: [
          { step: '1. Define Canonical Model', description: 'Create ideal business concepts (CanonicalEntity, CanonicalAttribute)' },
          { step: '2. Register Physical Assets', description: 'Register ERP columns and tables with tenant_id isolation' },
          { step: '3. Create Semantic Maps', description: 'Link physical columns to canonical attributes with confidence scores' },
          { step: '4. Resolve Metrics', description: 'Query graph to resolve metric definitions from canonical mappings' },
        ],
      },
      metrics: {
        title: 'Graph Metrics',
        stats: [
          { label: 'Nodes', value: '1,247', unit: 'nodes' },
          { label: 'Edges', value: '3,892', unit: 'edges' },
          { label: 'Query Latency', value: '8', unit: 'ms' },
          { label: 'Cache Hit Rate', value: '92', unit: '%' },
        ],
      },
    },
  },
};

export const FLOW_CONNECTIONS: FlowConnection[] = [
  { from: 'erp', to: 'worker', label: 'Raw JSON', flowType: 'ingestion' },
  { from: 'worker', to: 's3', label: 'Parquet', flowType: 'ingestion' },
  { from: 's3', to: 'tinybird', label: 'Parquet', flowType: 'ingestion' },
  { from: 'user', to: 'cube', label: 'Metric Query', flowType: 'query' },
  { from: 'user', to: 'clerk', label: 'Auth Request', flowType: 'auth' },
  { from: 'clerk', to: 'cube', label: 'JWT Token', flowType: 'auth' },
  { from: 'cube', to: 'falkordb', label: 'Schema Query', flowType: 'control', bidirectional: true },
  { from: 'cube', to: 'tinybird', label: 'SQL Query', flowType: 'query', bidirectional: true },
];

