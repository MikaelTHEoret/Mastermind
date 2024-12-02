```typescript
export interface OperationPattern {
  type: string;
  source: string;
  frequency: number;
  avgDuration?: number;
  metadata?: Record<string, unknown>;
}

export interface RelationPattern {
  relationType: string;
  sourceType: string;
  targetType: string;
  frequency: number;
  metadata?: Record<string, unknown>;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface SearchQuery {
  type?: string;
  source?: string;
  target?: string;
  timeRange?: TimeRange;
  limit?: number;
}

export interface TraceResult {
  operation: IndexedOperation;
  relations: Array<{
    type: string;
    operation: IndexedOperation;
  }>;
}
```