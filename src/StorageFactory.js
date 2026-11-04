import { TodoService } from './TodoService.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';
import { InMemoryStorageHandler } from './InMemoryStorageHandler.js';

export class StorageFactory {
  createService() {
    const storage = this.createStorage();
    return new TodoService(storage);
  }

  createStorage() {
    throw new Error('override me');
  }
}

export class LocalStorageFactory extends StorageFactory {
  createStorage() {
    return new LocalStorageHandler();
  }
}

export class InMemoryStorageFactory extends StorageFactory {
  createStorage() {
    return new InMemoryStorageHandler();
  }
}
