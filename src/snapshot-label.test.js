const fs = require('fs');
const path = require('path');
const {
  loadLabels, setLabel, removeLabel, getLabels, findByLabel, clearLabels
} = require('./snapshot-label');

const LABELS_FILE = path.join('.routewatch', 'labels', 'labels.json');

function cleanup() {
  if (fs.existsSync(LABELS_FILE)) fs.unlinkSync(LABELS_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('setLabel adds a label to a snapshot', () => {
  const result = setLabel('snap-a', 'production');
  expect(result).toContain('production');
  expect(getLabels('snap-a')).toEqual(['production']);
});

test('setLabel does not duplicate labels', () => {
  setLabel('snap-a', 'production');
  setLabel('snap-a', 'production');
  expect(getLabels('snap-a')).toEqual(['production']);
});

test('setLabel allows multiple labels on same snapshot', () => {
  setLabel('snap-a', 'production');
  setLabel('snap-a', 'stable');
  expect(getLabels('snap-a')).toEqual(['production', 'stable']);
});

test('removeLabel removes an existing label', () => {
  setLabel('snap-b', 'beta');
  const removed = removeLabel('snap-b', 'beta');
  expect(removed).toBe(true);
  expect(getLabels('snap-b')).toEqual([]);
});

test('removeLabel returns false when label does not exist', () => {
  const removed = removeLabel('snap-x', 'nonexistent');
  expect(removed).toBe(false);
});

test('getLabels returns empty array for unknown snapshot', () => {
  expect(getLabels('no-such-snap')).toEqual([]);
});

test('findByLabel returns snapshots with matching label', () => {
  setLabel('snap-c', 'release');
  setLabel('snap-d', 'release');
  setLabel('snap-e', 'draft');
  const found = findByLabel('release');
  expect(found).toContain('snap-c');
  expect(found).toContain('snap-d');
  expect(found).not.toContain('snap-e');
});

test('clearLabels removes all labels for a snapshot', () => {
  setLabel('snap-f', 'alpha');
  setLabel('snap-f', 'beta');
  clearLabels('snap-f');
  expect(getLabels('snap-f')).toEqual([]);
});

test('loadLabels returns empty object when no file exists', () => {
  expect(loadLabels()).toEqual({});
});
