import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskBuilder } from '../src/TaskBuilder.js';

test('builder creates normal and urgent task shapes', () => {
  const normal = new TaskBuilder('Read chapter').build();
  const urgent = new TaskBuilder('Submit lab').setPriority('high').addLabel('URGENT').build();
  assert.equal(normal.priority, 'normal');
  assert.equal(urgent.priority, 'high');
  assert.equal(urgent.desc, '[URGENT] Submit lab');
});
