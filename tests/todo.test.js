import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TodoService } from '../src/TodoService.js';
import { LocalStorageHandler } from '../src/LocalStorageHandler.js';
import { TodoController } from '../src/TodoController.js';

function memoryStorage(initial = []) {
  let saved = structuredClone(initial);

  return {
    writes: 0,

    load() {
      return structuredClone(saved);
    },

    save(tasks) {
      saved = structuredClone(tasks);
      this.writes++;
    }
  };
}

test('loads existing tasks through the injected storage', () => {
  const tasks = [
    {
      id: 1,
      desc: 'Read notes',
      completed: false,
      priority: 'normal'
    }
  ];

  const service = new TodoService(memoryStorage(tasks));

  assert.deepEqual(service.tasks, tasks);
});

test('adds a trimmed normal task, returns its ID and persists it', t => {
  t.mock.method(Date, 'now', () => 123);

  const storage = memoryStorage();
  const service = new TodoService(storage);

  assert.equal(service.addTask('  Read notes  '), 123);
  assert.equal(service.tasks[0].desc, 'Read notes');
  assert.equal(service.tasks[0].priority, 'normal');
  assert.equal(service.tasks[0].completed, false);
  assert.equal(typeof service.tasks[0].createdAt, 'string');
  assert.deepEqual(storage.load(), structuredClone(service.tasks));
  assert.equal(storage.writes, 1);
});

test('urgent tasks retain the original prefix and high priority', () => {
  const storage = memoryStorage();
  const service = new TodoService(storage);

  const id = service.addUrgentTask('  Submit lab  ');

  assert.equal(id, service.tasks[0].id);
  assert.equal(service.tasks[0].desc, '[URGENT] Submit lab');
  assert.equal(service.tasks[0].priority, 'high');
  assert.equal(service.tasks[0].completed, false);
  assert.deepEqual(storage.load(), structuredClone(service.tasks));
  assert.equal(storage.writes, 1);
});

test('short or blank descriptions are rejected without saving', t => {
  const alerts = [];
  const previousAlert = globalThis.alert;

  globalThis.alert = message => alerts.push(message);

  t.after(() => {
    if (previousAlert === undefined) {
      delete globalThis.alert;
    } else {
      globalThis.alert = previousAlert;
    }
  });

  const storage = memoryStorage();
  const service = new TodoService(storage);

  assert.equal(service.addTask('  ab  '), null);
  assert.equal(service.addUrgentTask('   '), null);
  assert.deepEqual(service.tasks, []);
  assert.equal(storage.writes, 0);
  assert.equal(alerts.length, 2);
});

test('completion and undo persist; an unknown ID is ignored', () => {
  const storage = memoryStorage([
    { id: 5, desc: 'Read notes', completed: false }
  ]);

  const service = new TodoService(storage);

  service.toggleComplete(5);
  assert.equal(storage.load()[0].completed, true);

  service.toggleComplete(5);
  assert.equal(storage.load()[0].completed, false);

  service.toggleComplete(99);
  assert.equal(storage.writes, 2);
});

test('deleting a task preserves the other tasks and survives a new service', () => {
  const storage = memoryStorage([
    { id: 1, desc: 'Keep this' },
    { id: 2, desc: 'Remove this' }
  ]);

  const service = new TodoService(storage);
  service.deleteTask(2);

  assert.deepEqual(
    new TodoService(storage).tasks,
    [{ id: 1, desc: 'Keep this' }]
  );
});

test('twenty existing tasks produce a warning but still allow adding', t => {
  const warning = t.mock.method(console, 'warn', () => {});

  const initialTasks = Array.from(
    { length: 20 },
    (_, id) => ({ id })
  );

  const service = new TodoService(memoryStorage(initialTasks));

  service.addTask('One more task');

  assert.equal(service.tasks.length, 21);
  assert.equal(warning.mock.callCount(), 1);
});

test('storage uses the existing todo-tasks key and round-trips JSON', t => {
  const values = new Map();
  const previousStorage = globalThis.localStorage;

  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };

  t.after(() => {
    if (previousStorage === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = previousStorage;
    }
  });

  const storage = new LocalStorageHandler();

  assert.deepEqual(storage.load(), []);

  const tasks = [
    { id: 7, desc: 'Persist this', completed: true }
  ];

  storage.save(tasks);

  assert.equal(values.get('todo-tasks'), JSON.stringify(tasks));
  assert.deepEqual(storage.load(), tasks);
});

test('workload summary follows completion, undo and deletion', () => {
  const service = new TodoService(memoryStorage([
    { id: 1, completed: false, priority: 'normal' },
    { id: 2, completed: false, priority: 'high' },
    { id: 3, completed: true, priority: 'high' }
  ]));

  assert.equal(
    service.getWorkloadSummary(),
    '1/3 done - 1 urgent, 1 normal remaining'
  );

  service.toggleComplete(2);

  assert.equal(
    service.getWorkloadSummary(),
    '2/3 done - 0 urgent, 1 normal remaining'
  );

  service.toggleComplete(2);
  service.deleteTask(1);

  assert.equal(
    service.getWorkloadSummary(),
    '1/2 done - 1 urgent, 0 normal remaining'
  );

  assert.equal(
    new TodoService(memoryStorage()).getWorkloadSummary(),
    '0/0 done - 0 urgent, 0 normal remaining'
  );
});

test('controller delegates normal and urgent additions and renders them', () => {
  const calls = [];

  const service = {
    addTask(description) {
      calls.push(['normal', description]);
      return 42;
    },

    addUrgentTask(description) {
      calls.push(['urgent', description]);
      return 43;
    }
  };

  const renderer = {
    render(...args) {
      calls.push(['render', ...args]);
    }
  };

  const controller = new TodoController(service, renderer);

  controller.start();

  assert.equal(controller.addTask('Read notes'), 42);
  assert.equal(controller.addUrgentTask('Submit lab'), 43);

  assert.deepEqual(calls, [
    ['render', service],
    ['normal', 'Read notes'],
    ['render', service, 42],
    ['urgent', 'Submit lab'],
    ['render', service, 43]
  ]);
});

test('controller leaves the page alone when the service rejects input', () => {
  let renders = 0;

  const controller = new TodoController(
    {
      addTask() {
        return null;
      },

      addUrgentTask() {
        return null;
      }
    },
    {
      render() {
        renders++;
      }
    }
  );

  assert.equal(controller.addTask('x'), null);
  assert.equal(controller.addUrgentTask('x'), null);
  assert.equal(renders, 0);
});