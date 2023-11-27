declare global {
  interface Array<T> {
    isEmpty(): boolean;

    isNotEmpty(): boolean;

    sum(): number;

    hasDuplicates(): boolean;

    distinct(): T[];

    hasCommonElements(items: (T | ConcatArray<T>)[]): boolean;

    generateSubsets(): T[][];
  }
}

Array.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};

Array.prototype.isNotEmpty = function (): boolean {
  return this.length !== 0;
};

Array.prototype.sum = function (): number {
  return this.reduce((acc: number, cur: number) => acc + cur, 0);
};

Array.prototype.hasDuplicates = function (): boolean {
  const uniqueSet = new Set(this);
  return this.length - uniqueSet.size > 0;
};

Array.prototype.distinct = function <T>(): T[] {
  return [...new Set(this)] as T[];
};

Array.prototype.hasCommonElements = function <T>(
  items: (T | ConcatArray<T>)[],
): boolean {
  const combinedSet = new Set([...this, ...items]);

  return combinedSet.size < this.length + items.length;
};

Array.prototype.generateSubsets = function (): number[][] {
  if (this.isEmpty()) {
    return [];
  }

  const result: number[][] = [];

  const n = this.length;
  for (let i = 0; i < Math.pow(2, n); i++) {
    const subset = new Array(n).fill(0);

    for (let j = 0; j < n; j++) {
      if ((i >> j) & 1) {
        subset[j] = this[j];
      }
    }

    // check duplicate
    if (!result.some((it) => JSON.stringify(it) === JSON.stringify(subset))) {
      result.push(subset);
    }
  }

  return result;
};

export {};
