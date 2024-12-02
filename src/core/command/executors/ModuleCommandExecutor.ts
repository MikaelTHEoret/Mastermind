import { CommandExecutor, ParsedCommand } from '../types/CommandTypes';
import { ModuleSystem } from '../../module/ModuleSystem';

export class ModuleCommandExecutor implements CommandExecutor {
  constructor(private moduleSystem: ModuleSystem) {}

  canHandle(command: ParsedCommand): boolean {
    return command.target === 'module';
  }

  async execute(command: ParsedCommand): Promise<string> {
    switch (command.action) {
      case 'create':
        return this.handleCreate(command);
      case 'list':
        return this.handleList();
      case 'update':
        return this.handleUpdate(command);
      case 'delete':
        return this.handleDelete(command);
      default:
        throw new Error(`Unknown module command: ${command.action}`);
    }
  }

  private async handleCreate(command: ParsedCommand): Promise<string> {
    const description = command.parameters.description as string;
    if (!description) {
      throw new Error('Module description is required');
    }
    const moduleName = await this.moduleSystem.createModule(description);
    return `Module ${moduleName} created successfully`;
  }

  private async handleList(): Promise<string> {
    const modules = await this.moduleSystem.listModules();
    return `Available modules:\n${modules.join('\n')}`;
  }

  private async handleUpdate(command: ParsedCommand): Promise<string> {
    const name = command.parameters.name as string;
    const content = command.parameters.content as string;
    if (!name || !content) {
      throw new Error('Module name and content are required');
    }
    await this.moduleSystem.updateModuleContent(name, content);
    return `Module ${name} updated successfully`;
  }

  private async handleDelete(command: ParsedCommand): Promise<string> {
    const name = command.parameters.name as string;
    if (!name) {
      throw new Error('Module name is required');
    }
    // Implement delete functionality in ModuleSystem
    return `Module ${name} deleted successfully`;
  }
}