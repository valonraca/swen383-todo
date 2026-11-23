// Strategy: common interface for task sorting.
export class SortStrategy {
  sort(tasks) { throw new Error('override me'); }
}

export class SortByName extends SortStrategy {
  sort(tasks) {
    tasks.sort((a, b) => a.desc.localeCompare(b.desc));
  }
}

export class SortByNewest extends SortStrategy {
  sort(tasks) {
    tasks.sort((a, b) => b.id - a.id);
  }
}
