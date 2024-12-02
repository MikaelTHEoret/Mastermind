import { ParsedCommand } from '../types/CommandTypes';
import { ValidationError } from './ValidationError';

export abstract class ValidationRule {
  abstract validate(command: ParsedCommand): Promise<void>;

  protected validateRequired(command: ParsedCommand, requiredParams: string[]): void {
    for (const param of requiredParams) {
      if (!(param in command.parameters)) {
        throw new ValidationError(`Missing required parameter: ${param}`);
      }
    }
  }

  protected validateType(value: unknown, expectedType: string, paramName: string): void {
    const actualType = typeof value;
    if (actualType !== expectedType) {
      throw new ValidationError(
        `Invalid type for parameter '${paramName}'. Expected ${expectedType}, got ${actualType}`
      );
    }
  }

  protected validatePattern(value: string, pattern: RegExp, paramName: string): void {
    if (!pattern.test(value)) {
      throw new ValidationError(
        `Invalid format for parameter '${paramName}'. Value does not match required pattern`
      );
    }
  }
}