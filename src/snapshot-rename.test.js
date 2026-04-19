const { renameSnapshot, copySnapshot, deleteSnapshot, snapshotExists } = require('./snapshot-rename');
const { saveSnapshot, listSnapshots } = require('./snapshot');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(process.cwd(), '.routewatch', 'snapshots');

function cleanup(...names) {
  for (const name of names) {
    const p = path.join(SNAPSHOT_DIR, `${name}.json`);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

const routes = [{ method: 'GET', path: '/api/test', tag: 'test' }];

beforeEach(() => cleanup('src-snap', 'dest-snap', 'renamed-snap', 'copy-snap'));
afterEach(() => cleanup('src-snap', 'dest-snap', 'renamed-snap', 'copy-snap'));

test('renameSnapshot moves snapshot to new name', () => {
  saveSnapshot('src-snap', routes);
  const result = renameSnapshot('src-snap', 'renamed-snap');
  expect(result.ok).toBe(true);
  expect(snapshotExists('renamed-snap')).toBe(true);
  expect(snapshotExists('src-snap')).toBe(false);
});

test('renameSnapshot fails if source missing', () => {
  const result = renameSnapshot('no-such-snap', 'renamed-snap');
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/not found/);
});

test('renameSnapshot fails if dest exists', () => {
  saveSnapshot('src-snap', routes);
  saveSnapshot('dest-snap', routes);
  const result = renameSnapshot('src-snap', 'dest-snap');
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/already exists/);
});

test('copySnapshot duplicates snapshot', () => {
  saveSnapshot('src-snap', routes);
  const result = copySnapshot('src-snap', 'copy-snap');
  expect(result.ok).toBe(true);
  expect(snapshotExists('src-snap')).toBe(true);
  expect(snapshotExists('copy-snap')).toBe(true);
});

test('deleteSnapshot removes snapshot', () => {
  saveSnapshot('src-snap', routes);
  const result = deleteSnapshot('src-snap');
  expect(result.ok).toBe(true);
  expect(snapshotExists('src-snap')).toBe(false);
});

test('deleteSnapshot fails if not found', () => {
  const result = deleteSnapshot('ghost-snap');
  expect(result.ok).toBe(false);
});
