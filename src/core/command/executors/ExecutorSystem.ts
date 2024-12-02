```typescript
import { EventEmitter } from 'events';
import { ResourceMonitor } from '../../ResourceMonitor';
import { UserProfileManager } from '../../user/UserProfileManager';
import { ExperienceManager } from '../experience/ExperienceManager';
import { CommandRegistry } from '../CommandRegistry';
import { ParsedCommand, CommandContext } from '../types/CommandTypes';
import { PriorityQueue } from '../utils/PriorityQueue';
import { SystemMetrics } from '../../../types/system';

interface ExecutionTask {
  command: ParsedCommand;
  priority: number;
  timestamp: Date;
  resourceRequirements: {
    cpu?: number;
    memory?: number;
    network?: number;
  };
}

export class ExecutorSystem extends EventEmitter {
  private taskQueue: PriorityQueue<ExecutionTask>;
  private running: boolean = false;
  private resourceThresholds = {
    cpu: 80, // 80% CPU usage threshold
    memory: 85, // 85% memory usage threshold
    network: 90 // 90% network bandwidth threshold
  };

  constructor(
    private registry: CommandRegistry,
    private monitor: ResourceMonitor,
    private userProfile: UserProfileManager,
    private experience: ExperienceManager
  ) {
    super();
    this.taskQueue = new PriorityQueue<ExecutionTask>((a, b) => b.priority - a.priority);
    this.startProcessing();
  }

  async executeCommand(command: ParsedCommand, context: CommandContext): Promise<string> {
    const task = await this.createExecutionTask(command, context);
    
    if (await this.isHighPriority(task)) {
      return this.executeImmediately(task);
    }

    this.taskQueue.enqueue(task);
    return `Command queued for execution with priority ${task.priority}`;
  }

  private async createExecutionTask(command: ParsedCommand, context: CommandContext): Promise<ExecutionTask> {
    const experienceAnalysis = await this.experience.analyzeCommand(command);
    const userPreferences = this.getUserPreferences(command);
    
    const priority = this.calculatePriority(
      command,
      experienceAnalysis.confidence,
      userPreferences.priority || 0
    );

    const resourceRequirements = await this.estimateResourceRequirements(command);

    return {
      command,
      priority,
      timestamp: new Date(),
      resourceRequirements
    };
  }

  private async isHighPriority(task: ExecutionTask): Promise<boolean> {
    // Check if command has critical importance
    if (task.priority > 0.8) return true;

    // Check if resources are readily available
    const metrics = this.monitor.getMetrics();
    if (this.hasAvailableResources(metrics, task.resourceRequirements)) {
      return true;
    }

    return false;
  }

  private async executeImmediately(task: ExecutionTask): Promise<string> {
    const executor = this.registry.getExecutor(task.command);
    if (!executor) {
      throw new Error('No executor found for command');
    }

    try {
      this.emit('taskStarted', task);
      const result = await executor.execute(task.command);
      this.emit('taskCompleted', { task, result });
      return result;
    } catch (error) {
      this.emit('taskFailed', { task, error });
      throw error;
    }
  }

  private startProcessing(): void {
    if (this.running) return;
    this.running = true;

    const processNext = async () => {
      if (!this.taskQueue.isEmpty()) {
        const metrics = this.monitor.getMetrics();
        const task = this.taskQueue.peek();

        if (this.hasAvailableResources(metrics, task.resourceRequirements)) {
          this.taskQueue.dequeue();
          await this.executeImmediately(task);
        }
      }

      if (this.running) {
        setTimeout(processNext, 100); // Check queue every 100ms
      }
    };

    processNext();
  }

  private calculatePriority(
    command: ParsedCommand,
    experienceConfidence: number,
    userPriority: number
  ): number {
    const weights = {
      experience: 0.4,
      user: 0.3,
      time: 0.2,
      resources: 0.1
    };

    const timeFactor = this.calculateTimeFactor(command);
    const resourceFactor = this.calculateResourceFactor(command);

    return (
      experienceConfidence * weights.experience +
      userPriority * weights.user +
      timeFactor * weights.time +
      resourceFactor * weights.resources
    );
  }

  private calculateTimeFactor(command: ParsedCommand): number {
    // Consider time-based patterns from user profile
    const timePreference = this.userProfile.getPreferenceWithConfidence(
      'timing',
      `${command.action}:${command.target}`,
      0.5
    );

    // Consider current time of day
    const hour = new Date().getHours();
    const isWorkingHours = hour >= 9 && hour <= 17;

    return timePreference.confidence * (isWorkingHours ? 1.2 : 0.8);
  }

  private calculateResourceFactor(command: ParsedCommand): number {
    // Consider current resource availability
    const metrics = this.monitor.getMetrics();
    const memoryUsage = metrics.memory.used / metrics.memory.total;
    
    return 1 - memoryUsage; // Higher priority when more resources available
  }

  private async estimateResourceRequirements(command: ParsedCommand): Promise<ExecutionTask['resourceRequirements']> {
    // Use experience data to estimate resource needs
    const similar = await this.experience.findSimilarCommands(command);
    
    if (similar.length > 0) {
      return {
        cpu: average(similar.map(c => c.metrics.cpu)),
        memory: average(similar.map(c => c.metrics.memory)),
        network: average(similar.map(c => c.metrics.network))
      };
    }

    // Default conservative estimates
    return {
      cpu: 10,
      memory: 50,
      network: 5
    };
  }

  private hasAvailableResources(
    metrics: SystemMetrics,
    requirements: ExecutionTask['resourceRequirements']
  ): boolean {
    if (requirements.cpu && metrics.cpu && metrics.cpu > this.resourceThresholds.cpu) {
      return false;
    }

    const memoryUsage = (metrics.memory.used / metrics.memory.total) * 100;
    if (requirements.memory && memoryUsage > this.resourceThresholds.memory) {
      return false;
    }

    return true;
  }

  private getUserPreferences(command: ParsedCommand): { priority: number } {
    return {
      priority: this.userProfile.getPreference(
        'commandPriority',
        `${command.action}:${command.target}`,
        0.5
      )
    };
  }

  stop(): void {
    this.running = false;
  }

  getQueueStatus(): {
    length: number;
    highPriority: number;
    averageWait: number;
  } {
    const tasks = this.taskQueue.toArray();
    const now = new Date();

    return {
      length: tasks.length,
      highPriority: tasks.filter(t => t.priority > 0.8).length,
      averageWait: average(tasks.map(t => now.getTime() - t.timestamp.getTime()))
    };
  }
}

function average(numbers: number[]): number {
  return numbers.length > 0
    ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length
    : 0;
}
```