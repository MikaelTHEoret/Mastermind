import { create } from 'zustand';
import type { NexusCore, NexusAgent, TaskEvaluation } from '../lib/nexus/types';
import { centralNexus } from '../lib/nexus/CentralNexus';
import { JohnnyGoGetter } from '../lib/nexus/JohnnyGoGetter';
import { SirExecutor } from '../lib/nexus/SirExecutor';
import { workerPool } from '../lib/nexus/WorkerPool';
import { useLogStore } from './logStore';

interface NexusStore {
  core: NexusCore | null;
  agents: Map<string, NexusAgent>;
  activeTask: string | null;
  initialize: () => Promise<void>;
  submitTask: (task: string) => Promise<string>;
  evaluateTask: (task: string) => Promise<TaskEvaluation>;
  executeScript: (script: string) => Promise<any>;
}

export const useNexusStore = create<NexusStore>((set, get) => ({
  core: null,
  agents: new Map(),
  activeTask: null,

  initialize: async () => {
    try {
      if (!centralNexus.isInitialized()) {
        await centralNexus.initialize();
      }
      
      const agents = new Map();
      agents.set(JohnnyGoGetter.id, JohnnyGoGetter);
      agents.set(SirExecutor.id, SirExecutor);

      set({
        core: centralNexus.getState(),
        agents,
      });

      useLogStore.getState().addLog({
        source: 'NexusStore',
        type: 'info',
        message: 'Nexus system initialized successfully',
      });
    } catch (error) {
      useLogStore.getState().addLog({
        source: 'NexusStore',
        type: 'error',
        message: `Failed to initialize Nexus system: ${error.message}`,
      });
      throw error;
    }
  },

  submitTask: async (task: string) => {
    const { agents } = get();
    const johnny = agents.get(JohnnyGoGetter.id);
    
    if (!johnny) {
      throw new Error('Johnny Go Getter not initialized');
    }

    set({ activeTask: task });

    try {
      // Let Johnny evaluate and process the task
      const evaluation = await johnny.evaluateTask(task);
      
      if (evaluation.recommendedProcessor.type === 'api') {
        // Handle API-based processing
        return await johnny.processTask(task);
      } else {
        // Handle local processing through Sir Executor
        const executor = agents.get(SirExecutor.id);
        if (!executor) {
          throw new Error('Sir Executor not initialized');
        }

        const script = await executor.translateTask(task);
        return await workerPool.executeTask('script', script);
      }
    } catch (error) {
      useLogStore.getState().addLog({
        source: 'NexusStore',
        type: 'error',
        message: `Task execution failed: ${error.message}`,
      });
      throw error;
    } finally {
      set({ activeTask: null });
    }
  },

  evaluateTask: async (task: string) => {
    const { agents } = get();
    const johnny = agents.get(JohnnyGoGetter.id);
    
    if (!johnny) {
      throw new Error('Johnny Go Getter not initialized');
    }

    return johnny.evaluateTask(task);
  },

  executeScript: async (script: string) => {
    const { agents } = get();
    const executor = agents.get(SirExecutor.id);
    
    if (!executor) {
      throw new Error('Sir Executor not initialized');
    }

    return workerPool.executeTask('script', script);
  },
}));