import { CommandParser } from './CommandParser';
import { NaturalLanguageParser } from './NaturalLanguageParser';
import { StructuredCommandParser } from './StructuredCommandParser';

export class ParserFactory {
  private static instance: ParserFactory;
  private parsers: Map<string, CommandParser>;

  private constructor() {
    this.parsers = new Map();
    this.initialize();
  }

  static getInstance(): ParserFactory {
    if (!ParserFactory.instance) {
      ParserFactory.instance = new ParserFactory();
    }
    return ParserFactory.instance;
  }

  private initialize(): void {
    this.parsers.set('natural', new NaturalLanguageParser());
    this.parsers.set('structured', new StructuredCommandParser());
  }

  getParser(type: string = 'natural'): CommandParser {
    const parser = this.parsers.get(type);
    if (!parser) {
      throw new Error(`Parser type '${type}' not found`);
    }
    return parser;
  }

  registerParser(type: string, parser: CommandParser): void {
    this.parsers.set(type, parser);
  }
}