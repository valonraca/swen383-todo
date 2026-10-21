import test from 'node:test';
import assert from 'node:assert/strict';
import { Task } from '../src/Task.js';
import { TaskBuilder } from '../src/TaskBuilder.js';
import { InMemoryStorageFactory } from '../src/StorageFactory.js';
import { TodoController } from '../src/TodoController.js';

test('default and customized builders retain the persisted task shape', () => {
  const builder = new TaskBuilder('Buy milk');
  const normal = builder.build();
  assert.ok(normal instanceof Task);
  assert.equal(normal.desc, 'Buy milk');
  assert.equal(normal.priority, 'normal');
  assert.equal(normal.completed, false);
  assert.equal(typeof normal.id, 'number');
  assert.equal(typeof normal.createdAt, 'string');
  assert.deepEqual(Object.keys(normal), ['id', 'desc', 'completed', 'priority', 'createdAt']);
  assert.equal(builder.setPriority('high'), builder);
  assert.equal(builder.addLabel('URGENT'), builder);
  const urgent = builder.build();
  assert.equal(urgent.desc, '[URGENT] Buy milk');
  assert.equal(urgent.priority, 'high');
  assert.equal(normal.desc, 'Buy milk');
  assert.equal(normal.priority, 'normal');
  assert.deepEqual(JSON.parse(JSON.stringify(urgent)), { ...urgent });
});

test('new builder configurations do not change the existing normal or urgent recipes', () => {
  const low = new TaskBuilder('Optional reading').setPriority('low').addLabel('LATER').build();
  assert.equal(low.priority, 'low');
  assert.equal(low.desc, '[LATER] Optional reading');
  assert.equal(new TaskBuilder('Normal task').build().priority, 'normal');
});

test('both add paths validate before saving, use Task products, and retain workload behavior', t => {
  const alerts = [];
  const oldAlert = globalThis.alert;
  globalThis.alert = message => alerts.push(message);
  let nextId = 100;
  t.mock.method(Date, 'now', () => nextId++);
  try {
    const service = new InMemoryStorageFactory().createService();
    let saves = 0;
    const save = service.storage.save.bind(service.storage);
    service.storage.save = tasks => { saves++; save(tasks); };
    assert.equal(service.addTask(' a '), null);
    assert.equal(service.addUrgentTask('  '), null);
    assert.equal(saves, 0);
    assert.equal(alerts.length, 2);
    const normalId = service.addTask('  Buy milk  ');
    const urgentId = service.addUrgentTask('  Finish lab  ');
    assert.ok(service.tasks.every(task => task instanceof Task));
    assert.equal(service.tasks[0].desc, 'Buy milk');
    assert.equal(service.tasks[1].desc, '[URGENT] Finish lab');
    assert.equal(saves, 2);
    assert.equal(service.getWorkloadSummary(), '0/2 done - 1 urgent, 1 normal remaining');
    service.toggleComplete(urgentId);
    assert.equal(service.getWorkloadSummary(), '1/2 done - 0 urgent, 1 normal remaining');
    service.deleteTask(normalId);
    assert.equal(service.getWorkloadSummary(), '1/1 done - 0 urgent, 0 normal remaining');
  } finally {
    if (oldAlert === undefined) delete globalThis.alert;
    else globalThis.alert = oldAlert;
  }
});

test('controller preserves add return values and bound Done/Delete actions', () => {
  const calls = [];
  let actions;
  const service = {
    addTask: description => { calls.push(['normal', description]); return 7; },
    addUrgentTask: description => { calls.push(['urgent', description]); return null; },
    toggleComplete: id => calls.push(['toggle', id]),
    deleteTask: id => calls.push(['delete', id])
  };
  const renderer = {
    bindActions: supplied => { actions = supplied; },
    render: (received, id) => { assert.equal(received, service); calls.push(['render', id]); }
  };
  const controller = new TodoController(service, renderer);
  assert.equal(controller.addTask('Buy milk'), 7);
  assert.equal(controller.addUrgentTask('ab'), null);
  actions.onToggle(7);
  actions.onDelete(7);
  assert.deepEqual(calls, [
    ['normal', 'Buy milk'], ['render', 7], ['urgent', 'ab'],
    ['toggle', 7], ['render', undefined], ['delete', 7], ['render', undefined]
  ]);
});
