import { StorageHandler } from './StorageHandler.js';

// ConcreteProduct: tasks last only until the page is reloaded.
export class InMemoryStorageHandler extends StorageHandler {
  constructor() {
    super();
    this.tasks = [];
  }

  load() { return this.tasks; }

  save(tasks) { this.tasks = tasks; }
}
