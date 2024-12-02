export interface SystemMetrics {
  cpu?: number;
  memory: {
    used: number;
    total: number;
  };
  network: {
    type: string;
    downlink: number;
  };
}

export interface FileSystemError extends Error {
  code?: string;
  path?: string;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'stopped' | 'error';
}

export interface SystemState {
  metrics: SystemMetrics;
  processes: ProcessInfo[];
  status: 'active' | 'idle' | 'error';
}

export interface CommandResult {
  success: boolean;
  result?: string;
  error?: string;
  metrics?: SystemMetrics;
}