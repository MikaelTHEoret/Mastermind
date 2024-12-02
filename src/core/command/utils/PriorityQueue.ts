```typescript
export class PriorityQueue<T> {
  private items: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compareFunction: (a: T, b: T) => number) {
    this.compare = compareFunction;
  }

  enqueue(item: T): void {
    this.items.push(item);
    this.items.sort(this.compare);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  updatePriorities(): void {
    this.items.sort(this.compare);
  }
}
```