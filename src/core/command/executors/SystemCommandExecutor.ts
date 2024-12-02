import { ParsedCommand } from '../types/CommandTypes';
import { BaseCommandExecutor } from './BaseCommandExecutor';
import { ResourceMonitor } from '../../ResourceMonitor';

export class SystemCommandExecutor extends BaseCommandExecutor {
  protected readonly targetType = 'system';
  
  constructor(private monitor: ResourceMonitor) {
    super();
  }

  async execute(command: ParsedCommand): Promise<string> {
    switch (command.action) {
      case 'status':
        return this.getSystemStatus();
      case 'metrics':
        return this.getSystemMetrics();
      default:
        throw new Error(`Unknown system command: ${command.action}`);
    }
  }

  private getSystemStatus(): string {
    const metrics = this.monitor.getMetrics();
    return JSON.stringify(metrics, null, 2);
  }

  private getSystemMetrics(): string {
    const metrics = this.monitor.getMetrics();
    const memory = metrics.memory;
    const network = metrics.network;

    return `System Metrics:
Memory: ${(memory.used / memory.total * 100).toFixed(1)}% used
Network: ${network.type} (${network.downlink}Mbps)`;
  }
}