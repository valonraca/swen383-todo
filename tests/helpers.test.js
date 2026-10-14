import assert from 'node:assert/strict';
import test from 'node:test';
import { createMemoryStorage } from './helpers.js';

test('fresh memory storage loads an empty task list', () => {
  const storage = createMemoryStorage();

  assert.deepEqual(storage.load(), []);
});
