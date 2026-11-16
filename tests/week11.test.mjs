import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TodoService } from '../src/TodoService.js';
import { InMemoryStorageHandler } from '../src/InMemoryStorageHandler.js';
import { TaskCounter } from '../src/TaskObservers.js';

test('counter shows loaded tasks and follows saved additions, toggles and deletions', t => {
  const counterElement = { textContent: '' };
  const originalDocument = globalThis.document;
  globalThis.document = {
    getElementById: id => {
      assert.equal(id, 'task-counter');
      return counterElement;
    },
  };
  t.after(() => { globalThis.document = originalDocument; });
  let nextId = 100;
  t.mock.method(Date, 'now', () => nextId++);

  const storage = new InMemoryStorageHandler();
  storage.save([{ id: 1, desc: 'Saved task', completed: true }]);
  const service = new TodoService(storage);
  const counter = new TaskCounter();
  const snapshots = [];
  service.subscribe(counter);
  service.subscribe({ update(tasks) {
    assert.deepEqual(tasks, storage.load());
    snapshots.push(structuredClone(tasks));
  } });
  counter.update(service.tasks);
  assert.equal(counterElement.textContent, 'Open: 0 · Done: 1');

  const id = service.addTask('New task');
  assert.equal(counterElement.textContent, 'Open: 1 · Done: 1');
  service.addUrgentTask('Urgent task');
  assert.equal(counterElement.textContent, 'Open: 2 · Done: 1');
  service.toggleComplete(id);
  assert.equal(counterElement.textContent, 'Open: 1 · Done: 2');
  service.deleteTask(id);
  assert.equal(counterElement.textContent, 'Open: 1 · Done: 1');
  assert.equal(snapshots.length, 4);
});
