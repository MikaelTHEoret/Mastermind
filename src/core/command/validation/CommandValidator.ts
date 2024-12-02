import { ParsedCommand } from '../types/CommandTypes';
import { ValidationRule } from './ValidationRule';
import { ValidationError } from './ValidationError';

export class CommandValidator {
  private rules: Map<string, ValidationRule[]> = new Map();

  addRule(commandType: string, rule: ValidationRule): void {
    const existingRules = this.rules.get(commandType) || [];
    this.rules.set(commandType, [...existingRules, rule]);
  }

  async validate(command: ParsedCommand): Promise<void> {
    const rules = this.rules.get(command.target || 'default') || [];
    const errors: string[] = [];

    for (const rule of rules) {
      try {
        await rule.validate(command);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error.message);
        } else if (error instanceof Error) {
          errors.push(error.message);
        } else {
          errors.push('Unknown validation error occurred');
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('\n'));
    }
  }
}