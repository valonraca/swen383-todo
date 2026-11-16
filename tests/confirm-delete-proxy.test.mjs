import test from 'node:test';
import assert from 'node:assert/strict';
import { ConfirmDeleteProxy } from '../src/ConfirmDeleteProxy.js';
import { LoggingTodoServiceDecorator } from '../src/LoggingTodoServiceDecorator.js';
import { ArchivingStorageFactory } from '../src/StorageFactory.js';

function installGlobal(t, name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { value, configurable: true });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  });
}

test('Cancel asks the specified question but never calls the real delete operation', t => {
  const prompts = [];
  const calls = [];
  installGlobal(t, 'confirm', message => { prompts.push(message); return false; });
  const proxy = new ConfirmDeleteProxy({ deleteTask: id => calls.push(id) });
  proxy.deleteTask(7);
  assert.deepEqual(prompts, ['Delete this task?']);
  assert.deepEqual(calls, []);
});

test('OK delegates through the logging decorator and preserves the archived task after reload', t => {
  const data = new Map();
  installGlobal(t, 'localStorage', {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value)
  });
  const calls = [];
  installGlobal(t, 'confirm', message => { calls.push(['confirm', message]); return true; });
  t.mock.method(console, 'log', (...args) => calls.push(['log', ...args]));
  const factory = new ArchivingStorageFactory();
  const realService = factory.createService();
  const proxy = new ConfirmDeleteProxy(new LoggingTodoServiceDecorator(realService));
  const id = proxy.addTask('Keep in archive');
  const archived = JSON.parse(data.get('todo-archive'));
  proxy.deleteTask(id);
  assert.deepEqual(proxy.tasks, []);
  assert.deepEqual(factory.createService().tasks, []);
  assert.deepEqual(JSON.parse(data.get('todo-archive')), archived);
  assert.deepEqual(calls, [
    ['log', 'LOG: addTask', 'Keep in archive'], ['confirm', 'Delete this task?']
  ]);
});

test('other service members pass through without prompting and the task getter remains live', t => {
  installGlobal(t, 'confirm', () => { throw new Error('Only deletion may prompt'); });
  const calls = [];
  const component = {
    tasks: [{ id: 1 }],
    addTask: description => { calls.push(['add', description]); return 7; },
    addUrgentTask: description => { calls.push(['urgent', description]); return null; },
    toggleComplete: id => calls.push(['toggle', id]),
    getWorkloadSummary: () => 'A domain-owned summary'
  };
  const proxy = new ConfirmDeleteProxy(component);
  assert.equal(proxy.addTask('Normal task'), 7);
  assert.equal(proxy.addUrgentTask('ab'), null);
  proxy.toggleComplete(7);
  assert.equal(proxy.getWorkloadSummary(), 'A domain-owned summary');
  assert.equal(proxy.tasks, component.tasks);
  component.tasks = [];
  assert.equal(proxy.tasks, component.tasks);
  assert.deepEqual(calls, [['add', 'Normal task'], ['urgent', 'ab'], ['toggle', 7]]);
});
