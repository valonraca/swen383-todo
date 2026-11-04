import { TodoService } from './TodoService.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';
import { InMemoryStorageHandler } from './InMemoryStorageHandler.js';
import { StorageGroup } from './StorageGroup.js';
import { ArchiveStorageHandler } from './ArchiveStorageHandler.js';

// Creator: delegates storage creation to the factory method.
export class StorageFactory {
  createService() {
    const storage = this.createStorage();
    return new TodoService(storage);
  }

  createStorage() { throw new Error('override me'); }
}

// ConcreteCreators: each chooses a storage backend.
export class LocalStorageFactory extends StorageFactory {
  createStorage() { return new LocalStorageHandler(); }
}

export class InMemoryStorageFactory extends StorageFactory {
  createStorage() { return new InMemoryStorageHandler(); }
}
export class ArchivingStorageFactory extends StorageFactory {
  createStorage() {
    const group = new StorageGroup();
    group.add(new LocalStorageHandler());
    group.add(new ArchiveStorageHandler());
    return group;
  }
}