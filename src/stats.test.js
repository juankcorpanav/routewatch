const { countByMethod, countByTag, countDeprecated, buildStats, formatStats } = require('./stats');

const sampleRoutes = [
  { method: 'GET', path: '/users', tags: ['users'] },
  { method: 'POST', path: '/users', tags: ['users'] },
  { method: 'GET', path: '/posts', tags: ['posts'], deprecated: true },
  { method: 'DELETE', path: '/posts/:id', tags: ['posts', 'admin'] },
  { method: 'get', path: '/health' },
];

test('countByMethod normalizes to uppercase', () => {
  const result = countByMethod(sampleRoutes);
  expect(result['GET']).toBe(3);
  expect(result['POST']).toBe(1);
  expect(result['DELETE']).toBe(1);
});

test('countByTag handles multiple tags and missing tags', () => {
  const result = countByTag(sampleRoutes);
  expect(result['users']).toBe(2);
  expect(result['posts']).toBe(2);
  expect(result['admin']).toBe(1);
  expect(result['untagged']).toBe(1);
});

test('countDeprecated counts only deprecated routes', () => {
  expect(countDeprecated(sampleRoutes)).toBe(1);
  expect(countDeprecated([])).toBe(0);
});

test('buildStats returns combined stats', () => {
  const snapshot = { routes: sampleRoutes };
  const stats = buildStats(snapshot);
  expect(stats.total).toBe(5);
  expect(stats.deprecated).toBe(1);
  expect(stats.byMethod['GET']).toBe(3);
  expect(stats.byTag['users']).toBe(2);
});

test('buildStats handles empty snapshot', () => {
  const stats = buildStats({});
  expect(stats.total).toBe(0);
  expect(stats.deprecated).toBe(0);
});

test('formatStats returns readable string', () => {
  const snapshot = { routes: sampleRoutes };
  const stats = buildStats(snapshot);
  const output = formatStats(stats);
  expect(output).toContain('Total routes');
  expect(output).toContain('GET');
  expect(output).toContain('users');
  expect(output).toContain('Deprecated');
});
