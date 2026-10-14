import assert from 'node:assert/strict';
import test from 'node:test';
import { TodoService } from '../src/TodoService.js';
import { createMemoryStorage } from './helpers.js';

globalThis.alert = () => {};

test('adds and persists a normal task', () => {
  const storage = createMemoryStorage();
  const service = new TodoService(storage);

  const id = service.addTask('Buy milk', 'simple');

  assert.equal(service.tasks.length, 1);
  assert.equal(service.tasks[0].id, id);
  assert.equal(service.tasks[0].desc, 'Buy milk');
  assert.deepEqual(storage.savedTasks, service.tasks);
});

test('rejects a short description without persisting', () => {
  const storage = createMemoryStorage();
  const service = new TodoService(storage);

  assert.equal(service.addTask('hi', 'simple'), null);
  assert.deepEqual(storage.savedTasks, []);
});

test('toggles only the matching task', () => {
  const storage = createMemoryStorage([
    { id: 1, desc: 'First task', completed: false, priority: 'normal', createdAt: '09:00' },
    { id: 2, desc: 'Second task', completed: false, priority: 'normal', createdAt: '09:01' }
  ]);
  const service = new TodoService(storage);

  service.toggleComplete(2);

  assert.equal(service.tasks[0].completed, false);
  assert.equal(service.tasks[1].completed, true);
});

test('deleting a missing task leaves tasks unchanged', () => {
  const tasks = [{ id: 1, desc: 'First task', completed: false, priority: 'normal', createdAt: '09:00' }];
  const storage = createMemoryStorage(tasks);
  const service = new TodoService(storage);

  service.deleteTask(99);

  assert.deepEqual(service.tasks, tasks);
  assert.deepEqual(storage.savedTasks, tasks);
});
