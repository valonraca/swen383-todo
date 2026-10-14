import assert from 'node:assert/strict';
import test from 'node:test';
import { TodoController } from '../src/TodoController.js';

function makeService(result = 7) {
  const service = { calls: [] };
  service.addTask = (...args) => { service.calls.push(['add', ...args]); return result; };
  service.toggleComplete = (id) => service.calls.push(['toggle', id]);
  service.deleteTask = (id) => service.calls.push(['delete', id]);
  return service;
}

test('controller delegates successful additions then renders the new id', () => {
  const service = makeService();
  const renderer = { render: (...args) => renderer.calls.push(args), bindActions: (actions) => { renderer.actions = actions; }, calls: [] };
  const controller = new TodoController(service, renderer);
  assert.equal(controller.addTask('Buy milk'), 7);
  assert.deepEqual(service.calls, [['add', 'Buy milk']]);
  assert.deepEqual(renderer.calls, [[service, 7]]);
});

test('controller routes renderer actions through service then renders', () => {
  const service = makeService();
  const renderer = { render: (...args) => renderer.calls.push(args), bindActions: (actions) => { renderer.actions = actions; }, calls: [] };
  new TodoController(service, renderer);
  renderer.actions.onToggle(4);
  renderer.actions.onDelete(4);
  assert.deepEqual(service.calls, [['toggle', 4], ['delete', 4]]);
  assert.equal(renderer.calls.length, 2);
});
