import { SystemInformation } from 'systeminformation';
import { EventEmitter } from 'events';

export class ResourceMonitor extends EventEmitter {
  private metrics: Map<string, any> = new Map();
  private monitoring: boolean = false;
  private interval: NodeJS.Timer | null = null;

  async startMonitoring() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.interval = setInterval(async () => {
      const cpuLoad = await SystemInformation.currentLoad();
      const memory = await SystemInformation.mem();
      const network = await SystemInformation.networkStats();

      this.metrics.set('cpu', cpuLoad);
      this.metrics.set('memory', memory);
      this.metrics.set('network', network);

      this.emit('metrics', this.getMetrics());
    }, 5000);
  }

  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.monitoring = false;
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}