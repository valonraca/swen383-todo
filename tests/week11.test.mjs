import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TodoService } from '../src/TodoService.js';
import { InMemoryStorageHandler } from '../src/InMemoryStorageHandler.js';
import { TaskCounter } from '../src/TaskObservers.js';
import { AddTaskCommand, CommandHistory } from '../src/Commands.js';
import { TodoController } from '../src/TodoController.js';
import { ConfirmDeleteProxy } from '../src/ConfirmDeleteProxy.js';
import { LoggingTodoServiceDecorator } from '../src/LoggingTodoServiceDecorator.js';

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
  assert.equal(counterElement.textContent, 'Open: 2 · Done: 1');
  assert.equal(service.tasks.find(task => task.id === id).status, 'doing');
  service.toggleComplete(id);
  assert.equal(counterElement.textContent, 'Open: 1 · Done: 2');
  service.deleteTask(id);
  assert.equal(counterElement.textContent, 'Open: 1 · Done: 1');
  assert.equal(snapshots.length, 5);
});

test('Undo removes three successful adds newest first through the confirmation proxy', t => {
  let nextId = 100;
  t.mock.method(Date, 'now', () => nextId++);
  t.mock.method(console, 'log', () => {});
  const originals = { alert: globalThis.alert, confirm: globalThis.confirm };
  let confirmations = 0;
  globalThis.alert = () => {};
  globalThis.confirm = message => {
    assert.equal(message, 'Delete this task?');
    confirmations++;
    return true;
  };
  t.after(() => Object.assign(globalThis, originals));

  const storage = new InMemoryStorageHandler();
  const service = new TodoService(storage);
  const observedCounts = [];
  service.subscribe({ update: tasks => observedCounts.push(tasks.length) });
  let renders = 0;
  const controller = new TodoController(
    new ConfirmDeleteProxy(new LoggingTodoServiceDecorator(service)),
    { render: () => { renders++; } },
  );
  const history = new CommandHistory();
  history.undo();
  for (const description of ['First task', 'Second task', 'Third task']) {
    history.run(new AddTaskCommand(controller, description));
  }
  history.run(new AddTaskCommand(controller, ' '));
  assert.equal(history.done.length, 3);
  for (const expected of [['First task', 'Second task'], ['First task'], []]) {
    history.undo();
    assert.deepEqual(service.tasks.map(task => task.desc), expected);
    assert.deepEqual(storage.load(), service.tasks);
  }
  history.undo();
  assert.equal(confirmations, 3);
  assert.equal(renders, 6);
  assert.deepEqual(observedCounts, [1, 2, 3, 2, 1, 0]);

  history.run(new AddTaskCommand(controller, 'Keep this task'));
  globalThis.confirm = () => false;
  history.undo();
  assert.equal(service.tasks[0].desc, 'Keep this task');
  assert.equal(history.done.length, 0);
});

test('main wires startup counts and the task and sorting controls', async t => {
  const originals = {
    document: globalThis.document,
    localStorage: globalThis.localStorage,
    alert: globalThis.alert,
    confirm: globalThis.confirm,
  };
  t.after(() => Object.assign(globalThis, originals));
  t.mock.method(console, 'log', () => {});
  let nextId = 100;
  t.mock.method(Date, 'now', () => nextId++);
  const elements = new Map();
  let toggleButtons;
  for (const id of ['task-input', 'add-task-btn', 'add-urgent-btn', 'suggest-btn',
    'undo-btn', 'sort-name-btn', 'sort-newest-btn', 'task-counter', 'task-container']) {
    elements.set(id, {
      value: '', textContent: '', innerHTML: '', listeners: {},
      addEventListener(event, listener) { this.listeners[event] = listener; },
      click() { this.listeners.click(); },
      querySelectorAll(selector) {
        if (selector !== '[data-toggle]') return [];
        toggleButtons = new Map();
        for (const [, id] of this.innerHTML.matchAll(/data-toggle="(\d+)"/g)) {
          const button = {
            dataset: { toggle: id },
            addEventListener(event, listener) { this[event] = listener; },
          };
          toggleButtons.set(Number(id), button);
        }
        return [...toggleButtons.values()];
      },
      querySelector() { return null; },
    });
  }
  const stored = new Map([['todo-tasks', JSON.stringify([
    { id: 1, desc: 'Previously saved task', completed: true },
  ])]]);
  globalThis.document = { getElementById: id => elements.get(id), title: '' };
  globalThis.localStorage = {
    getItem: key => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  };
  globalThis.alert = () => {};
  globalThis.confirm = () => true;
  await import('../src/main.js');
  const counter = elements.get('task-counter');
  const input = elements.get('task-input');
  assert.equal(counter.textContent, 'Open: 0 · Done: 1');
  input.value = 'Added with button';
  elements.get('add-task-btn').click();
  assert.equal(input.value, '');
  input.value = 'Added with Enter';
  input.listeners.keydown({ key: 'Enter' });
  input.value = 'Urgent task';
  elements.get('add-urgent-btn').click();
  elements.get('suggest-btn').click();
  assert.equal(counter.textContent, 'Open: 4 · Done: 1');
  elements.get('undo-btn').click();
  elements.get('undo-btn').click();
  elements.get('undo-btn').click();
  assert.equal(counter.textContent, 'Open: 2 · Done: 1');
  const tasks = JSON.parse(stored.get('todo-tasks'));
  assert.equal(tasks.length, 3);
  assert.equal(tasks[1].priority, 'high');
  assert.ok(elements.get('task-container').innerHTML.includes('Previously saved task'));
  assert.equal(document.title, 'Todo (2)');

  const container = elements.get('task-container');
  elements.get('sort-name-btn').click();
  input.value = 'Z new task';
  elements.get('add-task-btn').click();
  input.value = 'A new task';
  elements.get('add-task-btn').click();
  assert.match(container.innerHTML, /A new task<\/span>[\s\S]*Z new task<\/span>/);
  elements.get('sort-newest-btn').click();
  assert.match(container.innerHTML, /<ul>\s*<li[^>]*>\s*<span[^>]*>A new task<\/span>/);
  assert.match(container.innerHTML, /oldest: \[URGENT\] Urgent task/);

  const lastId = JSON.parse(stored.get('todo-tasks')).find(task => task.desc === 'A new task').id;
  toggleButtons.get(lastId).click();
  assert.match(container.innerHTML, /To do<\/h2><ul>[\s\S]*\[DOING\] A new task[\s\S]*Completed<\/h2>/);
  assert.equal(JSON.parse(stored.get('todo-tasks'))[0].status, 'doing');
  await import('../src/main.js?reload=doing');
  assert.match(container.innerHTML, /To do<\/h2><ul>[\s\S]*\[DOING\] A new task[\s\S]*Completed<\/h2>/);
  toggleButtons.get(lastId).click();
  await import('../src/main.js?reload=done');
  assert.match(container.innerHTML, /Completed<\/h2><ul>[\s\S]*>A new task<\/span>/);
  assert.doesNotMatch(container.innerHTML, /\[DOING\] A new task/);
  toggleButtons.get(lastId).click();
  toggleButtons.get(1).click();
  const reloadedTasks = JSON.parse(stored.get('todo-tasks'));
  assert.equal(reloadedTasks.find(task => task.id === lastId).status, 'open');
  assert.equal(reloadedTasks.find(task => task.id === 1).status, 'open');
});
