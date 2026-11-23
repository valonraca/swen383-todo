import { StorageHandler } from './StorageHandler.js';

export class InMemoryStorageHandler extends StorageHandler {
  constructor() {
    super();
    this.tasks = [];
  }

  load() {
    return this.tasks;
  }

  save(tasks) {
    this.tasks = tasks;
  }
}
