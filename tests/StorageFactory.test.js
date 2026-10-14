import assert from 'node:assert/strict';
import test from 'node:test';
import { InMemoryStorageHandler } from '../src/InMemoryStorageHandler.js';
import { InMemoryStorageFactory } from '../src/StorageFactory.js';
import { TodoService } from '../src/TodoService.js';

test('in-memory storage forgets tasks when a fresh handler is created', () => {
  const storage = new InMemoryStorageHandler();
  storage.save([{ id: 1 }]);
  assert.deepEqual(storage.load(), [{ id: 1 }]);
  assert.deepEqual(new InMemoryStorageHandler().load(), []);
});

test('in-memory factory creates a TodoService', () => {
  assert.ok(new InMemoryStorageFactory().createService() instanceof TodoService);
});
