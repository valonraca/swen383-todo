import test from 'node:test';
import assert from 'node:assert/strict';
import { StorageHandler } from '../src/StorageHandler.js';
import { LocalStorageHandler } from '../src/LocalStorageHandler.js';
import { InMemoryStorageHandler } from '../src/InMemoryStorageHandler.js';
import { StorageFactory, LocalStorageFactory, InMemoryStorageFactory } from '../src/StorageFactory.js';
import { TodoService } from '../src/TodoService.js';

test('abstract storage operations and factory method require an override', () => {
  const storage = new StorageHandler();
  assert.throws(() => storage.load(), /override me/);
  assert.throws(() => storage.save([]), /override me/);
  assert.throws(() => new StorageFactory().createService(), /override me/);
});

test('a factory subclass supplies storage to the inherited service creation', () => {
  const tasks = [{ id: 1, desc: 'Existing task', completed: false, priority: 'normal' }];
  const storage = { load: () => tasks, save() {} };
  class CustomFactory extends StorageFactory {
    createStorage() { return storage; }
  }
  const service = new CustomFactory().createService();
  assert.ok(service instanceof TodoService);
  assert.equal(service.storage, storage);
  assert.equal(service.tasks, tasks);
});

test('in-memory factories isolate fresh app instances and preserve mutations within one instance', () => {
  const factory = new InMemoryStorageFactory();
  const service = factory.createService();
  assert.ok(service.storage instanceof StorageHandler);
  assert.ok(service.storage instanceof InMemoryStorageHandler);
  const id = service.addTask('A temporary task');
  service.toggleComplete(id);
  assert.equal(service.storage.load()[0].completed, true);
  assert.deepEqual(factory.createService().tasks, []);
  service.deleteTask(id);
  assert.deepEqual(service.storage.load(), []);
});

test('local factories reload the original storage key and task shape', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const data = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  });
  try {
    const factory = new LocalStorageFactory();
    const service = factory.createService();
    assert.ok(service.storage instanceof LocalStorageHandler);
    assert.ok(service.storage instanceof StorageHandler);
    const id = service.addTask('Persist across reloads');
    service.toggleComplete(id);
    assert.equal(JSON.parse(data.get('todo-tasks'))[0].completed, true);
    const reloaded = factory.createService();
    assert.equal(reloaded.tasks[0].desc, 'Persist across reloads');
    reloaded.deleteTask(id);
    assert.deepEqual(factory.createService().tasks, []);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});
