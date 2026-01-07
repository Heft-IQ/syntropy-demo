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

