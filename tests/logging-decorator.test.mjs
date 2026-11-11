import test from 'node:test';
import assert from 'node:assert/strict';
import { LoggingTodoServiceDecorator } from '../src/LoggingTodoServiceDecorator.js';

test('decorator logs before delegating both add methods and preserves success/rejection results', t => {
  const calls = [];
  t.mock.method(console, 'log', (...args) => calls.push(['log', ...args]));
  const component = {
    addTask(description) { calls.push(['normal', description]); return description === 'ab' ? null : 7; },
    addUrgentTask(description) { calls.push(['urgent', description]); return 8; }
  };
  const decorated = new LoggingTodoServiceDecorator(component);
  assert.equal(decorated.addTask('Buy milk'), 7);
  assert.equal(decorated.addUrgentTask('Finish lab'), 8);
  assert.equal(decorated.addTask('ab'), null);
  assert.deepEqual(calls, [
    ['log', 'LOG: addTask', 'Buy milk'], ['normal', 'Buy milk'],
    ['log', 'LOG: addUrgentTask', 'Finish lab'], ['urgent', 'Finish lab'],
    ['log', 'LOG: addTask', 'ab'], ['normal', 'ab']
  ]);
});

test('decorator forwards mutations and summary and exposes the current underlying array', () => {
  const component = {
    tasks: [{ id: 7, completed: false }, { id: 8, completed: false }],
    toggleComplete(id) { this.tasks.find(task => task.id === id).completed = true; },
    deleteTask(id) { this.tasks = this.tasks.filter(task => task.id !== id); },
    getWorkloadSummary() { return `${this.tasks.filter(task => task.completed).length}/${this.tasks.length} done`; }
  };
  const decorated = new LoggingTodoServiceDecorator(component);
  const original = component.tasks;
  assert.equal(decorated.tasks, original);
  decorated.toggleComplete(7);
  assert.equal(decorated.getWorkloadSummary(), '1/2 done');
  decorated.deleteTask(8);
  assert.notEqual(decorated.tasks, original);
  assert.equal(decorated.tasks, component.tasks);
  assert.equal(decorated.getWorkloadSummary(), '1/1 done');
});
