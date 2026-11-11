import test from 'node:test';
import assert from 'node:assert/strict';
import { StorageHandler } from '../src/StorageHandler.js';
import { ArchiveStorageHandler } from '../src/ArchiveStorageHandler.js';
import { StorageGroup } from '../src/StorageGroup.js';
import { ArchivingStorageFactory } from '../src/StorageFactory.js';

function browserStorage(t, initial = []) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const data = new Map(initial);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  });
  return data;
}

test('archive appends new IDs once and retains their first-saved records after changes or deletion', t => {
  const data = browserStorage(t);
  const archive = new ArchiveStorageHandler();
  assert.ok(archive instanceof StorageHandler);
  assert.deepEqual(archive.load(), []);
  const first = { id: 1, desc: 'First', completed: false };
  const second = { id: 2, desc: 'Second', completed: false };
  archive.save([first]);
  archive.save([{ ...first, completed: true }, second]);
  archive.save([second]);
  archive.save([]);
  assert.deepEqual(archive.load(), [first, second]);
  assert.deepEqual(JSON.parse(data.get('todo-archive')), [first, second]);
  assert.equal(data.has('todo-tasks'), false);
});

test('group reads only its first member and fans out the same save to nested components', () => {
  const calls = [];
  const active = [{ id: 1, desc: 'Active' }];
  const first = { load: () => active, save: tasks => calls.push(['first', tasks]) };
  const second = { load() { throw new Error('Archive must not supply active tasks'); }, save: tasks => calls.push(['second', tasks]) };
  const nested = new StorageGroup();
  nested.add(second);
  const group = new StorageGroup();
  group.add(first);
  group.add(nested);
  assert.ok(group instanceof StorageHandler);
  assert.equal(group.load(), active);
  group.save(active);
  assert.deepEqual(calls.map(call => call[0]), ['first', 'second']);
  assert.ok(calls.every(call => call[1] === active));
});

test('archiving factory preserves legacy tasks, mirrors saves, and never resurrects archived deletions', t => {
  const existing = { id: 7, desc: 'Previously saved', completed: false, priority: 'normal', createdAt: '09:00' };
  const deleted = { id: 3, desc: 'Archived only', completed: false, priority: 'normal', createdAt: '08:00' };
  const data = browserStorage(t, [
    ['todo-tasks', JSON.stringify([existing])],
    ['todo-archive', JSON.stringify([deleted])]
  ]);
  t.mock.method(Date, 'now', () => 8);
  const factory = new ArchivingStorageFactory();
  const service = factory.createService();
  assert.ok(service.storage instanceof StorageGroup);
  assert.deepEqual(service.tasks, [existing]);
  const id = service.addUrgentTask('New work');
  assert.equal(JSON.parse(data.get('todo-tasks')).length, 2);
  const savedArchive = JSON.parse(data.get('todo-archive'));
  assert.deepEqual(savedArchive.map(task => task.id), [3, 7, 8]);
  service.toggleComplete(id);
  service.deleteTask(7);
  assert.deepEqual(factory.createService().tasks.map(task => task.id), [8]);
  assert.deepEqual(JSON.parse(data.get('todo-archive')), savedArchive);
  service.deleteTask(id);
  assert.deepEqual(factory.createService().tasks, []);
  assert.deepEqual(JSON.parse(data.get('todo-archive')), savedArchive);
});
