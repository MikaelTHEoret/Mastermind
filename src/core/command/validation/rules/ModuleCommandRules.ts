import { ValidationRule } from '../ValidationRule';
import { ParsedCommand } from '../../types/CommandTypes';

export class CreateModuleRule extends ValidationRule {
  async validate(command: ParsedCommand): Promise<void> {
    this.validateRequired(command, ['description']);
    this.validateType(command.parameters.description, 'string', 'description');
    
    const description = command.parameters.description as string;
    if (description.length < 10) {
      throw new ValidationError('Module description must be at least 10 characters long');
    }
  }
}

export class UpdateModuleRule extends ValidationRule {
  async validate(command: ParsedCommand): Promise<void> {
    this.validateRequired(command, ['name', 'content']);
    this.validateType(command.parameters.name, 'string', 'name');
    this.validateType(command.parameters.content, 'string', 'content');
    
    const name = command.parameters.name as string;
    this.validatePattern(name, /^[a-zA-Z][a-zA-Z0-9-_]*$/, 'name');
  }
}

export class DeleteModuleRule extends ValidationRule {
  async validate(command: ParsedCommand): Promise<void> {
    this.validateRequired(command, ['name']);
    this.validateType(command.parameters.name, 'string', 'name');
    
    const name = command.parameters.name as string;
    this.validatePattern(name, /^[a-zA-Z][a-zA-Z0-9-_]*$/, 'name');
  }
}