import { LocalStorageHandler } from './LocalStorageHandler.js';
import { MemoryStorageHandler } from './MemoryStorageHandler.js';
import { TodoService } from './TodoService.js';

export class StorageFactory {
  createStorage() {
    throw new Error('createStorage() must be implemented');
  }

  createService() {
    return new TodoService(this.createStorage());
  }
}

export class LocalStorageFactory extends StorageFactory {
  createStorage() {
    return new LocalStorageHandler();
  }
}

export class MemoryStorageFactory extends StorageFactory {
  createStorage() {
    return new MemoryStorageHandler();
  }
}
