const {
  lintMissingTags,
  lintMissingDescription,
  lintDuplicateRoutes,
  lintSnapshot,
  formatLintResults,
} = require('./lint');

const routes = [
  { method: 'GET', path: '/users', tags: ['users'], description: 'List users' },
  { method: 'POST', path: '/users', tags: [], description: 'Create user' },
  { method: 'GET', path: '/items', tags: ['items'], description: '' },
  { method: 'GET', path: '/users', tags: ['users'], description: 'Duplicate' },
];

test('lintMissingTags flags routes with no tags', () => {
  const res = lintMissingTags(routes);
  expect(res).toHaveLength(1);
  expect(res[0].route).toBe('POST /users');
});

test('lintMissingDescription flags routes with empty description', () => {
  const res = lintMissingDescription(routes);
  expect(res).toHaveLength(1);
  expect(res[0].route).toBe('GET /items');
});

test('lintDuplicateRoutes flags duplicate method+path', () => {
  const res = lintDuplicateRoutes(routes);
  expect(res).toHaveLength(1);
  expect(res[0].route).toBe('GET /users');
  expect(res[0].issue).toBe('duplicate route');
});

test('lintSnapshot aggregates all issues', () => {
  const snapshot = { routes };
  const res = lintSnapshot(snapshot);
  expect(res.length).toBeGreaterThanOrEqual(3);
});

test('formatLintResults returns clean message when no issues', () => {
  expect(formatLintResults([])).toBe('No lint issues found.');
});

test('formatLintResults formats issues', () => {
  const res = formatLintResults([{ route: 'GET /foo', issue: 'missing tags' }]);
  expect(res).toContain('[missing tags]');
  expect(res).toContain('GET /foo');
});
