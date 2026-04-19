const { splitByField, splitByPredicate, formatSplitSummary } = require('./snapshot-split');

const snapshot = {
  name: 'test',
  routes: [
    { method: 'GET', path: '/users', tag: 'users' },
    { method: 'POST', path: '/users', tag: 'users' },
    { method: 'GET', path: '/orders', tag: 'orders' },
    { method: 'DELETE', path: '/orders', tag: 'orders' },
    { method: 'GET', path: '/health' }
  ]
};

describe('splitByField', () => {
  test('splits by tag', () => {
    const groups = splitByField(snapshot, 'tag');
    expect(Object.keys(groups).sort()).toEqual(['orders', 'unknown', 'users']);
    expect(groups['users'].routes).toHaveLength(2);
    expect(groups['orders'].routes).toHaveLength(2);
    expect(groups['unknown'].routes).toHaveLength(1);
  });

  test('splits by method', () => {
    const groups = splitByField(snapshot, 'method');
    expect(groups['get'].routes).toHaveLength(3);
    expect(groups['post'].routes).toHaveLength(1);
    expect(groups['delete'].routes).toHaveLength(1);
  });

  test('preserves snapshot metadata', () => {
    const groups = splitByField(snapshot, 'tag');
    expect(groups['users'].name).toBe('test');
  });
});

describe('splitByPredicate', () => {
  test('splits into matched and unmatched', () => {
    const { matched, unmatched } = splitByPredicate(snapshot, r => r.method === 'GET');
    expect(matched.routes).toHaveLength(3);
    expect(unmatched.routes).toHaveLength(2);
  });

  test('handles all matching', () => {
    const { matched, unmatched } = splitByPredicate(snapshot, () => true);
    expect(matched.routes).toHaveLength(5);
    expect(unmatched.routes).toHaveLength(0);
  });
});

describe('formatSplitSummary', () => {
  test('formats summary correctly', () => {
    const groups = splitByField(snapshot, 'tag');
    const summary = formatSplitSummary(groups);
    expect(summary).toContain('Split Summary:');
    expect(summary).toContain('users: 2 route(s)');
    expect(summary).toContain('orders: 2 route(s)');
  });
});
