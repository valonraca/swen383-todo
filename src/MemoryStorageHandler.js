import { StorageHandler } from './StorageHandler.js';

export class MemoryStorageHandler extends StorageHandler {
  constructor() {
    super();
    this.tasks = [];
  }

  load() {
    return [...this.tasks];
  }

  save(tasks) {
    this.tasks = [...tasks];
  }
}
