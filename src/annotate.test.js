const { annotateRoute, annotateByMethod, annotateByPrefix, annotateByTag, applyAnnotations } = require('./annotate');

const snapshot = [
  { method: 'GET', path: '/users', tags: ['users'] },
  { method: 'POST', path: '/users', tags: ['users'] },
  { method: 'GET', path: '/admin/settings', tags: ['admin'] },
];

test('annotateRoute merges annotations', () => {
  const result = annotateRoute(snapshot[0], { deprecated: true });
  expect(result.deprecated).toBe(true);
  expect(result.method).toBe('GET');
});

test('annotateByMethod annotates matching routes', () => {
  const result = annotateByMethod(snapshot, 'POST', { internal: true });
  expect(result[1].internal).toBe(true);
  expect(result[0].internal).toBeUndefined();
});

test('annotateByPrefix annotates matching routes', () => {
  const result = annotateByPrefix(snapshot, '/admin', { restricted: true });
  expect(result[2].restricted).toBe(true);
  expect(result[0].restricted).toBeUndefined();
});

test('annotateByTag annotates matching routes', () => {
  const result = annotateByTag(snapshot, 'admin', { sensitive: true });
  expect(result[2].sensitive).toBe(true);
  expect(result[0].sensitive).toBeUndefined();
});

test('applyAnnotations applies multiple rules in order', () => {
  const rules = [
    { method: 'GET', annotations: { cached: true } },
    { prefix: '/admin', annotations: { restricted: true } },
  ];
  const result = applyAnnotations(snapshot, rules);
  expect(result[0].cached).toBe(true);
  expect(result[2].cached).toBe(true);
  expect(result[2].restricted).toBe(true);
  expect(result[1].cached).toBeUndefined();
});

test('applyAnnotations returns copy, does not mutate original', () => {
  const rules = [{ method: 'GET', annotations: { cached: true } }];
  applyAnnotations(snapshot, rules);
  expect(snapshot[0].cached).toBeUndefined();
});
