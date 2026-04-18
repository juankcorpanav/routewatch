const { matchesQuery, searchRoutes, formatSearchResults } = require('./search');

const snapshot = {
  name: 'test',
  routes: [
    { method: 'GET', path: '/users', tag: 'users', description: 'List all users' },
    { method: 'POST', path: '/users', tag: 'users', description: 'Create a user' },
    { method: 'GET', path: '/orders', tag: 'orders', description: 'List orders' },
    { method: 'DELETE', path: '/admin/purge', tag: 'admin', description: 'Purge data' },
  ]
};

describe('matchesQuery', () => {
  test('matches substring case-insensitively', () => {
    expect(matchesQuery('GET', 'get')).toBe(true);
    expect(matchesQuery('/users/profile', 'profile')).toBe(true);
  });

  test('returns false for non-string values', () => {
    expect(matchesQuery(undefined, 'x')).toBe(false);
    expect(matchesQuery(null, 'x')).toBe(false);
  });

  test('returns false when no match', () => {
    expect(matchesQuery('hello', 'world')).toBe(false);
  });
});

describe('searchRoutes', () => {
  test('returns all routes for empty query', () => {
    expect(searchRoutes(snapshot, '').length).toBe(4);
    expect(searchRoutes(snapshot, '   ').length).toBe(4);
  });

  test('matches by method', () => {
    const results = searchRoutes(snapshot, 'delete');
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe('/admin/purge');
  });

  test('matches by path', () => {
    const results = searchRoutes(snapshot, '/orders');
    expect(results).toHaveLength(1);
    expect(results[0].tag).toBe('orders');
  });

  test('matches by tag', () => {
    const results = searchRoutes(snapshot, 'users');
    expect(results).toHaveLength(2);
  });

  test('matches by description', () => {
    const results = searchRoutes(snapshot, 'purge');
    expect(results).toHaveLength(1);
  });

  test('returns empty for no match', () => {
    expect(searchRoutes(snapshot, 'nonexistent')).toHaveLength(0);
  });

  test('handles invalid snapshot gracefully', () => {
    expect(searchRoutes(null, 'x')).toEqual([]);
    expect(searchRoutes({}, 'x')).toEqual([]);
  });
});

describe('formatSearchResults', () => {
  test('shows no match message when empty', () => {
    const out = formatSearchResults([], 'foo');
    expect(out).toContain('No routes matched');
  });

  test('shows match count and routes', () => {
    const results = searchRoutes(snapshot, 'users');
    const out = formatSearchResults(results, 'users');
    expect(out).toContain('2 matches');
    expect(out).toContain('/users');
  });
});
