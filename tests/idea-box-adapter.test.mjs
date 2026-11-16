import test from 'node:test';
import assert from 'node:assert/strict';
import { IdeaBox } from '../src/IdeaBox.js';
import { IdeaBoxAdapter } from '../src/IdeaBoxAdapter.js';

test('adapter converts the foreign object to a string without changing the adaptee or idea', () => {
  const idea = Object.freeze({ title: 'A task from another team', minutes: 25 });
  let calls = 0;
  const adaptee = Object.freeze({ pickRandomIdea() { calls++; return idea; } });
  const adapter = new IdeaBoxAdapter(adaptee);
  assert.equal(adapter.getSuggestion(), 'A task from another team (25 min)');
  assert.equal(calls, 1);
  assert.equal(adapter.ideaBox, adaptee);
  assert.deepEqual(idea, { title: 'A task from another team', minutes: 25 });
});

test('the unchanged IdeaBox and adapter support each of the three supplied ideas', t => {
  let value = 0;
  t.mock.method(Math, 'random', () => value);
  const adapter = new IdeaBoxAdapter(new IdeaBox());
  for (const [random, expected] of [
    [0, 'Learn a new skill (60 min)'],
    [0.5, 'Clean your desk (15 min)'],
    [0.99, 'Call a friend (20 min)']
  ]) {
    value = random;
    assert.equal(adapter.getSuggestion(), expected);
  }
});
