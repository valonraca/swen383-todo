import { StorageHandler } from './StorageHandler.js';

// ConcreteProduct: a new handler starts with an empty list after a page reload.
export class InMemoryStorageHandler extends StorageHandler {
  constructor() {
    super();
    this.tasks = [];
  }

  load() { return this.tasks; }
  save(tasks) { this.tasks = tasks; }
}
