// The Strategy: what every sort order must have.
export class SortStrategy {
  sort(tasks) { throw new Error('override me'); }
}

// A to Z by description
export class SortByName extends SortStrategy {
  sort(tasks) {
    tasks.sort((a, b) => a.desc.localeCompare(b.desc));
  }
}

// The task added last comes first
export class SortByNewest extends SortStrategy {
  sort(tasks) {
    tasks.sort((a, b) => b.id - a.id);
  }
}
