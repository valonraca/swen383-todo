// src/StorageFactory.js
import { TodoService } from './TodoService.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';
import { InMemoryStorageHandler } from './InMemoryStorageHandler.js';

// Creator: builds a TodoService on top of whatever storage createStorage() returns.
export class StorageFactory {
  createService() {
    const storage = this.createStorage();   // the factory method
    return new TodoService(storage);
  }
  createStorage() { throw new Error('override me'); }
}

// ConcreteCreators: each one decides which storage class to create.
export class LocalStorageFactory extends StorageFactory {
  createStorage() { return new LocalStorageHandler(); }
}

export class InMemoryStorageFactory extends StorageFactory {
  createStorage() { return new InMemoryStorageHandler(); }
}