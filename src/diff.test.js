const { diffSnapshots, getFieldChanges } = require('./diff');

const baseRoutes = [
  { method: 'GET', path: '/users', auth: true },
  { method: 'POST', path: '/users', auth: true },
  { method: 'DELETE', path: '/users/:id', auth: true },
];

describe('diffSnapshots', () => {
  test('detects added routes', () => {
    const oldSnap = { routes: baseRoutes };
    const newSnap = { routes: [...baseRoutes, { method: 'GET', path: '/posts' }] };
    const result = diffSnapshots(oldSnap, newSnap);
    expect(result.added).toHaveLength(1);
    expect(result.added[0].path).toBe('/posts');
    expect(result.removed).toHaveLength(0);
  });

  test('detects removed routes', () => {
    const oldSnap = { routes: baseRoutes };
    const newSnap = { routes: baseRoutes.slice(0, 2) };
    const result = diffSnapshots(oldSnap, newSnap);
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].path).toBe('/users/:id');
    expect(result.added).toHaveLength(0);
  });

  test('detects changed routes', () => {
    const updatedRoutes = [
      { method: 'GET', path: '/users', auth: false },
      ...baseRoutes.slice(1),
    ];
    const oldSnap = { routes: baseRoutes };
    const newSnap = { routes: updatedRoutes };
    const result = diffSnapshots(oldSnap, newSnap);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].route).toBe('GET /users');
    expect(result.changed[0].differences[0]).toMatchObject({ field: 'auth', from: true, to: false });
  });

  test('returns empty diff for identical snapshots', () => {
    const snap = { routes: baseRoutes };
    const result = diffSnapshots(snap, snap);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  test('handles missing routes array gracefully', () => {
    const result = diffSnapshots({}, {});
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });
});

describe('getFieldChanges', () => {
  test('returns empty array when routes are identical', () => {
    const route = { method: 'GET', path: '/test', auth: true };
    expect(getFieldChanges(route, route)).toHaveLength(0);
  });

  test('ignores method and path fields', () => {
    const a = { method: 'GET', path: '/test' };
    const b = { method: 'POST', path: '/other' };
    expect(getFieldChanges(a, b)).toHaveLength(0);
  });
});
