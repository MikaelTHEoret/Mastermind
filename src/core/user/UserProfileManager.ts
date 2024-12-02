```typescript
import { DatabaseManager } from '../database/DatabaseManager';
import { EventEmitter } from 'events';

interface UserPreference {
  category: string;
  key: string;
  value: any;
  confidence: number;
  lastUpdated: Date;
  usageCount: number;
}

interface PreferencePattern {
  category: string;
  pattern: RegExp;
  weight: number;
}

export class UserProfileManager extends EventEmitter {
  private preferences: Map<string, UserPreference> = new Map();
  private patterns: PreferencePattern[] = [
    { category: 'color', pattern: /color|theme|background|text-(\w+)/, weight: 0.8 },
    { category: 'layout', pattern: /layout|position|align|justify|grid|flex/, weight: 0.7 },
    { category: 'interaction', pattern: /click|hover|focus|active/, weight: 0.6 },
    { category: 'timing', pattern: /duration|delay|timeout/, weight: 0.5 }
  ];

  constructor(private db: DatabaseManager) {
    super();
    this.loadPreferences();
  }

  private async loadPreferences(): Promise<void> {
    try {
      const result = await this.db.query(
        'SELECT * FROM user_preferences'
      );
      
      for (const row of result.rows) {
        this.preferences.set(
          this.getPreferenceKey(row.category, row.key),
          JSON.parse(row.data)
        );
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }

  async recordChoice(category: string, key: string, value: any): Promise<void> {
    const prefKey = this.getPreferenceKey(category, key);
    const existing = this.preferences.get(prefKey);

    if (existing) {
      // Update existing preference
      existing.usageCount++;
      existing.lastUpdated = new Date();
      
      // Adjust confidence based on consistency
      if (existing.value === value) {
        existing.confidence = Math.min(1, existing.confidence + 0.1);
      } else {
        existing.confidence = Math.max(0, existing.confidence - 0.1);
        existing.value = value;
      }
    } else {
      // Create new preference
      this.preferences.set(prefKey, {
        category,
        key,
        value,
        confidence: 0.1,
        lastUpdated: new Date(),
        usageCount: 1
      });
    }

    await this.savePreference(prefKey);
    this.emit('preferenceUpdated', { category, key, value });
  }

  getPreference<T>(category: string, key: string, defaultValue: T): T {
    const preference = this.preferences.get(this.getPreferenceKey(category, key));
    return preference && preference.confidence > 0.3 ? preference.value : defaultValue;
  }

  getPreferenceWithConfidence<T>(category: string, key: string, defaultValue: T): {
    value: T;
    confidence: number;
  } {
    const preference = this.preferences.get(this.getPreferenceKey(category, key));
    return preference ? {
      value: preference.value,
      confidence: preference.confidence
    } : {
      value: defaultValue,
      confidence: 0
    };
  }

  async analyzeChoices(choices: Array<{ category: string; key: string; value: any }>): Promise<void> {
    for (const choice of choices) {
      const pattern = this.findMatchingPattern(choice.category, choice.key);
      if (pattern) {
        await this.recordChoice(
          choice.category,
          choice.key,
          choice.value
        );
      }
    }
  }

  getWeightedDecision<T>(
    category: string,
    key: string,
    options: T[],
    defaultWeight: number = 0.5
  ): T {
    const preference = this.preferences.get(this.getPreferenceKey(category, key));
    
    if (!preference || preference.confidence < 0.3) {
      return options[Math.floor(Math.random() * options.length)];
    }

    // Find the option most similar to the preferred value
    const weightedOptions = options.map(option => ({
      option,
      weight: this.calculateSimilarity(option, preference.value) * preference.confidence
    }));

    // Sort by weight and add some randomness for exploration
    weightedOptions.sort((a, b) => {
      const randomFactor = Math.random() * 0.2 - 0.1; // ±10% randomness
      return (b.weight + randomFactor) - (a.weight + randomFactor);
    });

    return weightedOptions[0].option;
  }

  private calculateSimilarity(a: any, b: any): number {
    if (typeof a === 'string' && typeof b === 'string') {
      return this.calculateStringSimilarity(a, b);
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return 1 - Math.abs(a - b) / Math.max(a, b);
    }
    return a === b ? 1 : 0;
  }

  private calculateStringSimilarity(a: string, b: string): number {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    if (aLower === bLower) return 1;
    if (aLower.includes(bLower) || bLower.includes(aLower)) return 0.8;
    
    // Calculate Levenshtein distance
    const distance = this.levenshteinDistance(aLower, bLower);
    const maxLength = Math.max(a.length, b.length);
    return 1 - distance / maxLength;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[b.length][a.length];
  }

  private findMatchingPattern(category: string, key: string): PreferencePattern | undefined {
    return this.patterns.find(pattern => 
      pattern.category === category || pattern.pattern.test(key)
    );
  }

  private getPreferenceKey(category: string, key: string): string {
    return `${category}:${key}`;
  }

  private async savePreference(key: string): Promise<void> {
    const preference = this.preferences.get(key);
    if (!preference) return;

    try {
      await this.db.query(
        `INSERT OR REPLACE INTO user_preferences (category, key, data) VALUES (?, ?, ?)`,
        [preference.category, preference.key, JSON.stringify(preference)]
      );
    } catch (error) {
      console.error('Failed to save preference:', error);
    }
  }
}
```