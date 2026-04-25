const { findStaleSnapshots, findExcessSnapshots, pruneSnapshots } = require('./snapshot-prune');
const { saveSnapshot, loadSnapshot, listSnapshots } = require('./snapshot');
const fs = require('fs');
const path = require('path');

const SNAPSHOTS_DIR = path.join(process.cwd(), '.routewatch', 'snapshots');

function cleanup(...names) {
  names.forEach((n) => {
    const f = path.join(SNAPSHOTS_DIR, `${n}.json`);
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
}

const routes = [{ method: 'GET', path: '/ping', tag: 'health' }];

beforeAll(() => {
  if (!fs.existsSync(SNAPSHOTS_DIR)) fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
});

describe('findStaleSnapshots', () => {
  test('returns snapshots older than maxAgeDays', () => {
    const old = { routes, timestamp: new Date(Date.now() - 10 * 86400000).toISOString() };
    const fresh = { routes, timestamp: new Date().toISOString() };
    saveSnapshot('prune-old', old);
    saveSnapshot('prune-fresh', fresh);
    const all = ['prune-old', 'prune-fresh'];
    const stale = findStaleSnapshots(all, 5);
    expect(stale).toContain('prune-old');
    expect(stale).not.toContain('prune-fresh');
    cleanup('prune-old', 'prune-fresh');
  });
});

describe('findExcessSnapshots', () => {
  test('returns oldest beyond keepLast limit', () => {
    const names = ['prune-e1', 'prune-e2', 'prune-e3'];
    names.forEach((n, i) => {
      saveSnapshot(n, { routes, timestamp: new Date(Date.now() - (3 - i) * 86400000).toISOString() });
    });
    const excess = findExcessSnapshots(names, 2);
    expect(excess).toHaveLength(1);
    expect(excess[0]).toBe('prune-e1');
    cleanup(...names);
  });

  test('returns empty when within limit', () => {
    const names = ['prune-f1', 'prune-f2'];
    names.forEach((n, i) => {
      saveSnapshot(n, { routes, timestamp: new Date(Date.now() - i * 86400000).toISOString() });
    });
    expect(findExcessSnapshots(names, 5)).toHaveLength(0);
    cleanup(...names);
  });
});

describe('pruneSnapshots', () => {
  test('dry run does not delete files', () => {
    saveSnapshot('prune-dry', { routes, timestamp: new Date(Date.now() - 20 * 86400000).toISOString() });
    const result = pruneSnapshots({ maxAgeDays: 5, dryRun: true });
    expect(result).toContain('prune-dry');
    expect(loadSnapshot('prune-dry')).toBeDefined();
    cleanup('prune-dry');
  });

  test('actually deletes when dryRun is false', () => {
    saveSnapshot('prune-real', { routes, timestamp: new Date(Date.now() - 20 * 86400000).toISOString() });
    pruneSnapshots({ maxAgeDays: 5, dryRun: false });
    expect(() => loadSnapshot('prune-real')).toThrow();
  });
});
