import test from 'node:test';
import assert from 'node:assert/strict';
import { Command, AddTaskCommand, CommandHistory } from '../src/Commands.js';
import { TodoController } from '../src/TodoController.js';
import { InMemoryStorageFactory } from '../src/StorageFactory.js';
import { LoggingTodoServiceDecorator } from '../src/LoggingTodoServiceDecorator.js';
import { ConfirmDeleteProxy } from '../src/ConfirmDeleteProxy.js';

test('Command requires concrete execute and undo implementations', () => {
  const command = new Command();
  assert.throws(() => command.execute(), /override me/);
  assert.throws(() => command.undo(), /override me/);
});

test('AddTaskCommand captures the receiver result and removes that exact ID on undo', () => {
  const calls = [];
  const receiver = {
    addTask(description) { calls.push(['add', description]); return 7; },
    removeTask(id) { calls.push(['remove', id]); }
  };
  const command = new AddTaskCommand(receiver, 'A normal task');
  assert.ok(command instanceof Command);
  assert.equal(command.execute(), 7);
  assert.equal(command.id, 7);
  command.undo();
  assert.deepEqual(calls, [['add', 'A normal task'], ['remove', 7]]);
});

test('history ignores rejected additions, unwinds successful commands newest first, and handles an empty stack', () => {
  const calls = [];
  let nextId = 40;
  const receiver = {
    addTask(description) { calls.push(['add', description]); return description === 'bad' ? null : nextId++; },
    removeTask(id) { calls.push(['remove', id]); }
  };
  const history = new CommandHistory();
  history.undo();
  assert.deepEqual(calls, []);
  history.run(new AddTaskCommand(receiver, 'First'));
  history.run(new AddTaskCommand(receiver, 'bad'));
  history.run(new AddTaskCommand(receiver, 'Second'));
  assert.equal(history.done.length, 2);
  history.undo();
  history.undo();
  history.undo();
  assert.equal(history.done.length, 0);
  assert.deepEqual(calls, [
    ['add', 'First'], ['add', 'bad'], ['add', 'Second'], ['remove', 41], ['remove', 40]
  ]);
});

test('receiver Undo uses the existing proxy/decorator and Observer; Cancel consumes the popped history entry as specified', t => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'confirm');
  const answers = [false, true];
  const prompts = [];
  Object.defineProperty(globalThis, 'confirm', {
    configurable: true,
    value: message => { prompts.push(message); return answers.shift(); }
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'confirm', descriptor);
    else delete globalThis.confirm;
  });
  t.mock.method(console, 'log', () => {});
  let nextId = 100;
  t.mock.method(Date, 'now', () => nextId++);
  const real = new InMemoryStorageFactory().createService();
  const counts = [];
  real.subscribe({ update: tasks => counts.push(tasks.length) });
  const service = new ConfirmDeleteProxy(new LoggingTodoServiceDecorator(real));
  let renders = 0;
  const controller = new TodoController(service, { bindActions() {}, render() { renders++; } });
  const history = new CommandHistory();
  history.run(new AddTaskCommand(controller, 'First task'));
  history.run(new AddTaskCommand(controller, 'Second task'));
  history.undo();
  assert.equal(history.done.length, 1);
  assert.equal(real.tasks.length, 2);
  assert.deepEqual(counts, [1, 2]);
  history.undo();
  assert.deepEqual(real.tasks.map(task => task.desc), ['Second task']);
  assert.deepEqual(counts, [1, 2, 1]);
  assert.equal(renders, 4);
  assert.deepEqual(prompts, ['Delete this task?', 'Delete this task?']);
});
