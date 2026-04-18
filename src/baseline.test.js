const fs = require('fs');
const path = require('path');
const { setBaseline, getBaseline, clearBaseline, hasBaseline, BASELINE_FILE } = require('./baseline');
const { saveSnapshot } = require('./snapshot');

const cleanup = () => {
  if (fs.existsSync(BASELINE_FILE)) fs.unlinkSync(BASELINE_FILE);
};

const mockSnapshot = { routes: [{ method: 'GET', path: '/health', tag: 'system' }] };

beforeEach(() => {
  cleanup();
  jest.resetModules();
});

afterEach(cleanup);

test('hasBaseline returns false when no baseline set', () => {
  expect(hasBaseline()).toBe(false);
});

test('getBaseline returns null when no baseline set', () => {
  expect(getBaseline()).toBeNull();
});

test('setBaseline saves and getBaseline retrieves it', () => {
  saveSnapshot('snap-v1', mockSnapshot);
  setBaseline('snap-v1');
  expect(hasBaseline()).toBe(true);
  const baseline = getBaseline();
  expect(baseline).not.toBeNull();
  expect(baseline.name).toBe('snap-v1');
  expect(baseline.snapshot).toEqual(mockSnapshot);
  expect(baseline.setAt).toBeDefined();
});

test('clearBaseline removes the baseline file', () => {
  saveSnapshot('snap-v2', mockSnapshot);
  setBaseline('snap-v2');
  clearBaseline();
  expect(hasBaseline()).toBe(false);
});

test('setBaseline throws if snapshot does not exist', () => {
  expect(() => setBaseline('nonexistent-snap')).toThrow('Snapshot not found');
});
