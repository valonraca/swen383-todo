import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';

test('page handlers support Add, Urgent, Enter, validation, Done, Undo, Delete and reload', async t => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<script type="module" src="src\/main\.js"><\/script>/);
  const errors = [];
  const alerts = [];
  const windows = [];
  const previous = Object.fromEntries(
    ['document', 'localStorage', 'alert'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)])
  );
  t.after(() => {
    for (const window of windows) window.close();
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  let clock = 1000;
  t.mock.method(Date, 'now', () => clock++);

  async function openPage(savedTasks, suffix) {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => errors.push(error));
    const { window } = new JSDOM(html, { url: 'http://localhost/', virtualConsole });
    windows.push(window);
    if (savedTasks) window.localStorage.setItem('todo-tasks', savedTasks);
    globalThis.document = window.document;
    globalThis.localStorage = window.localStorage;
    globalThis.alert = message => alerts.push(message);
    await import(`../src/main.js?dom-test=${suffix}`);
    return window;
  }

  let window = await openPage(null, 'initial');
  let doc = window.document;
  const input = doc.getElementById('task-input');
  const saved = () => JSON.parse(window.localStorage.getItem('todo-tasks'));
  const status = () => doc.querySelector('.status').textContent;

  assert.equal(doc.title, 'Todo (0)');
  assert.match(status(), /0\/0 done - 0 urgent, 0 normal remaining - oldest: none/);

  input.value = '  Read the lab guide  ';
  doc.getElementById('add-task-btn').click();
  assert.equal(input.value, '');
  assert.equal(saved()[0].desc, 'Read the lab guide');
  const normalId = saved()[0].id;
  assert.equal(doc.querySelector(`[data-row="${normalId}"]`).classList.contains('flash'), true);
  assert.equal(doc.title, 'Todo (1)');

  input.value = 'Submit the lab';
  doc.getElementById('add-urgent-btn').click();
  assert.equal(saved()[1].priority, 'high');
  const urgentId = saved()[1].id;
  assert.equal(doc.querySelector('.priority-high').textContent, '[URGENT] Submit the lab');

  input.value = 'Review the diagrams';
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.equal(input.value, '');
  assert.equal(saved().length, 3);
  const enterId = saved()[2].id;
  assert.equal(doc.title, 'Todo (3)');

  input.value = 'ab';
  doc.getElementById('add-task-btn').click();
  assert.equal(input.value, 'ab');
  assert.equal(alerts.length, 1);
  assert.equal(saved().length, 3);

  doc.querySelector(`[data-toggle="${urgentId}"]`).click();
  assert.equal(saved()[1].completed, true);
  assert.equal(doc.querySelector(`[data-row="${urgentId}"]`).classList.contains('completed'), true);
  assert.equal(doc.querySelector(`[data-toggle="${urgentId}"]`).textContent, 'Undo');
  assert.match(status(), /1\/3 done - 0 urgent, 2 normal remaining/);
  assert.equal(doc.title, 'Todo (2)');

  doc.querySelector(`[data-toggle="${urgentId}"]`).click();
  assert.equal(saved()[1].completed, false);
  assert.match(status(), /0\/3 done - 1 urgent, 2 normal remaining/);

  doc.querySelector(`[data-delete="${normalId}"]`).click();
  assert.equal(doc.querySelector(`[data-row="${normalId}"]`), null);
  assert.deepEqual(saved().map(task => task.id), [urgentId, enterId]);
  assert.match(status(), /oldest: \[URGENT\] Submit the lab/);

  const persisted = window.localStorage.getItem('todo-tasks');
  window = await openPage(persisted, 'reload');
  doc = window.document;
  assert.equal(doc.querySelectorAll('[data-row]').length, 2);
  assert.equal(doc.title, 'Todo (2)');
  assert.equal(window.localStorage.getItem('todo-tasks'), persisted);
  assert.match(status(), /0\/2 done - 1 urgent, 1 normal remaining/);
  assert.deepEqual(errors, []);
});
