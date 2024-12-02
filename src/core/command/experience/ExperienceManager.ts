```typescript
// Add this method to the existing ExperienceManager class

async findSimilarCommands(command: ParsedCommand): Promise<Array<{
  command: ParsedCommand;
  metrics: {
    cpu: number;
    memory: number;
    network: number;
  };
}>> {
  const pattern = this.generatePattern(command);
  const similar = Array.from(this.experiences.entries())
    .filter(([key]) => this.patternSimilarity(key, pattern) > 0.7)
    .map(([, exp]) => ({
      command: exp.command,
      metrics: exp.metrics
    }));

  return similar;
}

private patternSimilarity(pattern1: string, pattern2: string): number {
  const [action1, target1] = pattern1.split(':');
  const [action2, target2] = pattern2.split(':');

  const actionSimilarity = action1 === action2 ? 1 : 0;
  const targetSimilarity = target1 === target2 ? 1 : 0;

  return (actionSimilarity + targetSimilarity) / 2;
}
```