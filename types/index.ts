export type MetricStatus = 'active' | 'pending_approval' | 'draft' | 'rejected';

export interface Metric {
  id: string;
  name: string;
  def: string;
  status: MetricStatus;
  confidence: number;
  lastUpdated: string;
  author: string;
  code: string;
  requester?: string;
  timestamp?: string;
}

export type AuditLogSeverity = 'info' | 'warning' | 'error' | 'critical';
export type AuditLogStatus = 'success' | 'failed' | 'pending';
export type AuditLogCategory = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'QUERY' | 'AUTH' | 'CONFIG' | 'EXPORT' | 'OTHER';

export interface AuditLog {
  id: number;
  action: string;
  target: string;
  actor: string;
  time: string;
  hash: string;
  // Enterprise fields
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  correlationId?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  diff?: string;
  category: AuditLogCategory;
  severity: AuditLogSeverity;
  status: AuditLogStatus;
  metadata?: Record<string, any>;
  duration?: number; // milliseconds
  relatedActions?: number[];
  complianceHash?: string; // Cryptographic hash for tamper-proofing
  timestamp: Date; // ISO timestamp for sorting
}

export interface SimulationResult {
  variance: number;
  rowCountDelta: number;
  performance: string;
  isSignificant: boolean;
}

export interface Draft {
  name: string;
  logic: string;
  justification: string;
  code: string;
  diff: {
    old: string;
    new: string;
  } | null;
}

export interface SimulationData {
  period: string;
  old: number;
  new: number;
}

export interface UnmatchedField {
  id: string;
  sourceField: string;
  sourceTable: string;
  dataType: string;
  sampleValue?: string;
  suggestedMapping?: string;
  confidence?: number;
}

export interface CanonicalField {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface FieldMapping {
  unmatchedFieldId: string;
  canonicalFieldId: string | null;
}

export type LineageNodeType = 'source_field' | 'canonical_field' | 'metric' | 'usage';

export interface LineageNode {
  id: string;
  type: LineageNodeType;
  label: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface LineageEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'transformation' | 'mapping' | 'usage' | 'dependency';
}

export interface LineageData {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

export interface SuccessMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  icon?: string;
}

export interface ActivityItem {
  id: string;
  type: 'metric_created' | 'metric_approved' | 'field_mapped' | 'mapping_accepted';
  actor: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface AIExplanation {
  confidence: number;
  breakdown: {
    fieldNameSimilarity: number;
    dataTypeMatch: number;
    contextClues: number;
    historicalPatterns?: number;
  };
  reasoning: string;
  alternatives?: Array<{
    canonicalFieldId: string;
    confidence: number;
    reason: string;
  }>;
  learningIndicator?: {
    basedOnMappings: number;
    improvement: number;
  };
}

export type ComponentType =
  | 'erp'
  | 'worker'
  | 's3'
  | 'tinybird'
  | 'user'
  | 'clerk'
  | 'cube'
  | 'falkordb';

export type ComponentCategory =
  | 'data-source'
  | 'etl'
  | 'storage'
  | 'compute'
  | 'api-gateway'
  | 'control-plane'
  | 'auth'
  | 'frontend';

export type FlowType = 'ingestion' | 'query' | 'auth' | 'control';

export interface FlowConnection {
  from: ComponentType;
  to: ComponentType;
  label: string;
  flowType: FlowType;
  bidirectional?: boolean;
}

export interface ComponentDemo {
  id: ComponentType;
  name: string;
  description: string;
  responsibility: string;
  category: ComponentCategory;
  dependencies?: {
    dependsOn: ComponentType[];
    dependedBy: ComponentType[];
  };
  architectureContext?: {
    position: string;
    interactions: ComponentType[];
    dataFlowIn: string[];
    dataFlowOut: string[];
  };
  examples: {
    data?: {
      title: string;
      content: string;
      language?: string;
    };
    process?: {
      title: string;
      steps: Array<{ step: string; description: string; timing?: string }>;
    };
    metrics?: {
      title: string;
      stats: Array<{ label: string; value: string | number; unit?: string }>;
    };
    interactions?: {
      title: string;
      examples: Array<{ type: string; request: string; response?: string }>;
    };
    visualization?: {
      title: string;
      type: 'code' | 'data' | 'graph' | 'flow';
      content: any;
    };
  };
}

