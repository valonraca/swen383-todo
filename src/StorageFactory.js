import { TodoService } from './TodoService.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';
import { InMemoryStorageHandler } from './InMemoryStorageHandler.js';
import { StorageGroup } from './StorageGroup.js';
import { ArchiveStorageHandler } from './ArchiveStorageHandler.js';

export class StorageFactory {
  createService() {
    return new TodoService(this.createStorage());
  }

  createStorage() {
    throw new Error('Storage factories must implement createStorage()');
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

export class ArchivingStorageFactory extends StorageFactory {
  createStorage() {
    const group = new StorageGroup();
    group.add(new LocalStorageHandler());
    group.add(new ArchiveStorageHandler());
    return group;
  }
}
