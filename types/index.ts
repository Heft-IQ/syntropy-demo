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

export interface AuditLog {
  id: number;
  action: string;
  target: string;
  actor: string;
  time: string;
  hash: string;
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

