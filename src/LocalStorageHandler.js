import { StorageHandler } from './StorageHandler.js';

// Handles saving and loading tasks.
export class LocalStorageHandler extends StorageHandler {
  constructor(key = 'todo-tasks') {
    super();
    this.key = key;
  }

  load() {
    const raw = localStorage.getItem(this.key);

    if (!raw) {
      return [];
    }

    const tasks = JSON.parse(raw);

    if (
      !Array.isArray(tasks) ||
      !tasks.every(task =>
        task &&
        Number.isSafeInteger(task.id) &&
        typeof task.desc === 'string' &&
        typeof task.completed === 'boolean' &&
        ['normal', 'high'].includes(task.priority) &&
        typeof task.createdAt === 'string'
      )
    ) {
      throw new Error('Saved tasks have an invalid format.');
    }

    return tasks;
  }

  save(tasks) {
    localStorage.setItem(
      this.key,
      JSON.stringify(tasks)
    );
  }
}