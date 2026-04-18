const { filterByMethod, filterByPrefix, filterByTag, applyFilters } = require('./filter');

const routes = [
  { method: 'GET',    path: '/api/v1/users',   tags: ['users'] },
  { method: 'POST',   path: '/api/v1/users',   tags: ['users'] },
  { method: 'GET',    path: '/api/v1/orders',  tags: ['orders'] },
  { method: 'DELETE', path: '/api/v2/users',   tags: ['users', 'admin'] },
  { method: 'GET',    path: '/health',         tags: [] },
];

describe('filterByMethod', () => {
  test('returns only GET routes', () => {
    const result = filterByMethod(routes, 'GET');
    expect(result).toHaveLength(3);
    result.forEach(r => expect(r.method).toBe('GET'));
  });

  test('is case-insensitive', () => {
    const result = filterByMethod(routes, 'post');
    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('/api/v1/users');
  });

  test('returns all routes when method is falsy', () => {
    expect(filterByMethod(routes, null)).toHaveLength(routes.length);
  });
});

describe('filterByPrefix', () => {
  test('filters by /api/v1 prefix', () => {
    const result = filterByPrefix(routes, '/api/v1');
    expect(result).toHaveLength(3);
  });

  test('filters by /api/v2 prefix', () => {
    const result = filterByPrefix(routes, '/api/v2');
    expect(result).toHaveLength(1);
    expect(result[0].method).toBe('DELETE');
  });

  test('returns all routes when prefix is falsy', () => {
    expect(filterByPrefix(routes, '')).toHaveLength(routes.length);
  });
});

describe('filterByTag', () => {
  test('filters by users tag', () => {
    const result = filterByTag(routes, 'users');
    expect(result).toHaveLength(3);
  });

  test('filters by admin tag', () => {
    const result = filterByTag(routes, 'admin');
    expect(result).toHaveLength(1);
  });

  test('returns all routes when tag is falsy', () => {
    expect(filterByTag(routes, null)).toHaveLength(routes.length);
  });
});

describe('applyFilters', () => {
  test('combines method and prefix filters', () => {
    const result = applyFilters(routes, { method: 'GET', prefix: '/api/v1' });
    expect(result).toHaveLength(2);
  });

  test('combines all three filters', () => {
    const result = applyFilters(routes, { method: 'GET', prefix: '/api/v1', tag: 'orders' });
    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('/api/v1/orders');
  });

  test('returns all routes with empty opts', () => {
    expect(applyFilters(routes, {})).toHaveLength(routes.length);
  });
});
