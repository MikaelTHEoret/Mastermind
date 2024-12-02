import { ValidationRule } from '../ValidationRule';
import { ParsedCommand } from '../../types/CommandTypes';

export class SystemMetricsRule extends ValidationRule {
  async validate(command: ParsedCommand): Promise<void> {
    // No specific parameters required for metrics command
    if (command.parameters.type) {
      this.validateType(command.parameters.type, 'string', 'type');
      const validTypes = ['cpu', 'memory', 'network', 'all'];
      if (!validTypes.includes(command.parameters.type as string)) {
        throw new ValidationError(
          `Invalid metrics type. Must be one of: ${validTypes.join(', ')}`
        );
      }
    }
  }
}

export class SystemStatusRule extends ValidationRule {
  async validate(command: ParsedCommand): Promise<void> {
    // No specific parameters required for status command
    if (command.parameters.format) {
      this.validateType(command.parameters.format, 'string', 'format');
      const validFormats = ['json', 'text'];
      if (!validFormats.includes(command.parameters.format as string)) {
        throw new ValidationError(
          `Invalid status format. Must be one of: ${validFormats.join(', ')}`
        );
      }
    }
  }
}