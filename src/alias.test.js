const fs = require('fs');
const path = require('path');
const { setAlias, getAlias, removeAlias, listAliases, resolveAlias } = require('./alias');

const ALIAS_FILE = path.join('.routewatch', 'aliases.json');

function cleanup() {
  if (fs.existsSync(ALIAS_FILE)) fs.unlinkSync(ALIAS_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('setAlias and getAlias', () => {
  setAlias('prod', 'snapshot-2024-01-01');
  expect(getAlias('prod')).toBe('snapshot-2024-01-01');
});

test('getAlias returns null for unknown alias', () => {
  expect(getAlias('unknown')).toBeNull();
});

test('removeAlias deletes an alias', () => {
  setAlias('staging', 'snapshot-staging');
  removeAlias('staging');
  expect(getAlias('staging')).toBeNull();
});

test('listAliases returns all aliases', () => {
  setAlias('a', 'snap-a');
  setAlias('b', 'snap-b');
  const aliases = listAliases();
  expect(aliases['a']).toBe('snap-a');
  expect(aliases['b']).toBe('snap-b');
});

test('resolveAlias returns snapshot name if alias exists', () => {
  setAlias('live', 'snap-live-v2');
  expect(resolveAlias('live')).toBe('snap-live-v2');
});

test('resolveAlias returns input unchanged if no alias', () => {
  expect(resolveAlias('snap-direct')).toBe('snap-direct');
});
