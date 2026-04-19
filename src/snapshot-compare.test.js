const { compareSnapshots, compareSummary } = require('./snapshot-compare');
const { saveSnapshot } = require('./snapshot');
const fs = require('fs');
const path = require('path');

const SNAP_DIR = path.join(__dirname, '../snapshots');

function cleanup() {
  ['cmp-a', 'cmp-b'].forEach(name => {
    const f = path.join(SNAP_DIR, `${name}.json`);
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
}

beforeEach(cleanup);
afterAll(cleanup);

const routesA = [{ method: 'GET', path: '/users', tag: 'users' }];
const routesB = [
  { method: 'GET', path: '/users', tag: 'users' },
  { method: 'POST', path: '/users', tag: 'users' }
];

test('compareSnapshots returns diff', () => {
  saveSnapshot('cmp-a', routesA);
  saveSnapshot('cmp-b', routesB);
  const result = compareSnapshots('cmp-a', 'cmp-b');
  expect(result.diff.added.length).toBe(1);
  expect(result.diff.removed.length).toBe(0);
});

test('compareSummary counts correctly', () => {
  const result = { diff: { added: [1, 2], removed: [1], changed: [] } };
  const s = compareSummary(result);
  expect(s.added).toBe(2);
  expect(s.removed).toBe(1);
  expect(s.changed).toBe(0);
  expect(s.total).toBe(3);
});

test('compareSnapshots throws on missing snapshot', () => {
  expect(() => compareSnapshots('ghost-a', 'ghost-b')).toThrow();
});
