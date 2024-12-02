import { EventEmitter } from 'events';
import { WebSocket } from 'ws';

export class EventCoordinator extends EventEmitter {
  private connections: Map<string, WebSocket> = new Map();
  private tasks: Map<string, any> = new Map();

  constructor() {
    super();
    this.setupWebSocket();
  }

  private setupWebSocket() {
    const wss = new WebSocket.Server({ port: 8080 });
    
    wss.on('connection', (ws) => {
      const id = crypto.randomBytes(8).toString('hex');
      this.connections.set(id, ws);

      ws.on('message', (data) => {
        this.handleMessage(id, JSON.parse(data.toString()));
      });

      ws.on('close', () => {
        this.connections.delete(id);
      });
    });
  }

  private handleMessage(connectionId: string, message: any) {
    switch (message.type) {
      case 'task_complete':
        this.emit('taskComplete', message.data);
        break;
      case 'error':
        this.emit('error', message.data);
        break;
      case 'status_update':
        this.emit('statusUpdate', message.data);
        break;
    }
  }

  async dispatchTask(task: any): Promise<void> {
    const taskId = crypto.randomBytes(8).toString('hex');
    this.tasks.set(taskId, task);

    // Find available worker
    const worker = Array.from(this.connections.values())[0];
    if (worker) {
      worker.send(JSON.stringify({ taskId, ...task }));
    } else {
      throw new Error('No workers available');
    }
  }
}