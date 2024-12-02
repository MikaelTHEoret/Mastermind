export interface SystemEvent {
  type: string;
  timestamp: Date;
  data: unknown;
}

export interface ConnectionEvent extends SystemEvent {
  connectionName: string;
  status: 'connected' | 'disconnected' | 'error';
}

export interface QueryEvent extends SystemEvent {
  connectionName: string;
  sql: string;
  duration?: number;
  error?: Error;
}