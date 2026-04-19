const { mergeSnapshots, formatMergeSummary } = require('./snapshot-merge');

const snapshotA = {
  name: 'v1',
  routes: [
    { method: 'GET', path: '/users', tag: 'users' },
    { method: 'POST', path: '/users', tag: 'users' },
  ],
};

const snapshotB = {
  name: 'v2',
  routes: [
    { method: 'GET', path: '/users', tag: 'users', description: 'updated' },
    { method: 'DELETE', path: '/users/:id', tag: 'users' },
  ],
};

test('merges two snapshots with onConflict=last (default)', () => {
  const merged = mergeSnapshots([snapshotA, snapshotB]);
  expect(merged.routes).toHaveLength(3);
  const getUsers = merged.routes.find(r => r.method === 'GET' && r.path === '/users');
  expect(getUsers.description).toBe('updated');
});

test('merges with onConflict=first keeps original', () => {
  const merged = mergeSnapshots([snapshotA, snapshotB], { onConflict: 'first' });
  const getUsers = merged.routes.find(r => r.method === 'GET' && r.path === '/users');
  expect(getUsers.description).toBeUndefined();
});

test('merges with onConflict=merge combines fields', () => {
  const merged = mergeSnapshots([snapshotA, snapshotB], { onConflict: 'merge' });
  const getUsers = merged.routes.find(r => r.method === 'GET' && r.path === '/users');
  expect(getUsers.description).toBe('updated');
  expect(getUsers.tag).toBe('users');
});

test('sets merged name from sources', () => {
  const merged = mergeSnapshots([snapshotA, snapshotB]);
  expect(merged.name).toBe('v1+v2');
});

test('throws on empty array', () => {
  expect(() => mergeSnapshots([])).toThrow();
});

test('throws if snapshot missing routes', () => {
  expect(() => mergeSnapshots([{ name: 'bad' }])).toThrow();
});

test('formatMergeSummary returns readable string', () => {
  const merged = mergeSnapshots([snapshotA, snapshotB]);
  const summary = formatMergeSummary(merged, [snapshotA, snapshotB]);
  expect(summary).toMatch('Merged 2 snapshots');
  expect(summary).toMatch('v1, v2');
});
