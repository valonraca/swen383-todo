import test from 'node:test';
import assert from 'node:assert/strict';
import { TodoService } from '../src/TodoService.js';
import { TaskObserver, TaskCounter } from '../src/TaskObservers.js';

test('Observer base requires an update implementation', () => {
  assert.throws(() => new TaskObserver().update([]), /override me/);
});

test('subject notifies every subscriber after saving normal/urgent additions, toggles, and deletions', t => {
  const events = [];
  const snapshot = tasks => tasks.map(({ id, completed }) => ({ id, completed }));
  const storage = { load: () => [], save: tasks => events.push(['save', snapshot(tasks)]) };
  const service = new TodoService(storage);
  let nextId = 100;
  t.mock.method(Date, 'now', () => nextId++);
  const oldAlert = globalThis.alert;
  globalThis.alert = () => {};
  t.after(() => {
    if (oldAlert === undefined) delete globalThis.alert;
    else globalThis.alert = oldAlert;
  });
  for (const name of ['first', 'second']) {
    service.subscribe({ update(tasks) {
      assert.equal(tasks, service.tasks);
      events.push([name, snapshot(tasks)]);
    } });
  }
  assert.deepEqual(events, []);
  assert.equal(service.addTask('ab'), null);
  service.toggleComplete(-1);
  assert.deepEqual(events, []);
  const normalId = service.addTask('Normal task');
  const urgentId = service.addUrgentTask('Urgent task');
  service.toggleComplete(normalId);
  service.deleteTask(urgentId);
  assert.equal(events.length, 12);
  for (let index = 0; index < events.length; index += 3) {
    assert.deepEqual(events.slice(index, index + 3).map(event => event[0]), ['save', 'first', 'second']);
    assert.deepEqual(events[index + 1][1], events[index][1]);
    assert.deepEqual(events[index + 2][1], events[index][1]);
  }
  assert.deepEqual(events.at(-1)[1], [{ id: normalId, completed: true }]);
});

test('counter displays empty, loaded, and changed task counts without changing tasks', t => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const element = { textContent: '' };
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { getElementById(id) { assert.equal(id, 'task-counter'); return element; } }
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'document', descriptor);
    else delete globalThis.document;
  });
  const counter = new TaskCounter();
  assert.ok(counter instanceof TaskObserver);
  counter.update([]);
  assert.equal(element.textContent, 'Open: 0 · Done: 0');
  const tasks = [{ completed: false }, { completed: true }, { completed: false }];
  const before = structuredClone(tasks);
  counter.update(tasks);
  assert.equal(element.textContent, 'Open: 2 · Done: 1');
  assert.deepEqual(tasks, before);
  tasks[0].completed = true;
  counter.update(tasks);
  assert.equal(element.textContent, 'Open: 1 · Done: 2');
});
