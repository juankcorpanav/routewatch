const { formatRenamed, formatCopied, formatDeleted, formatSnapshotError } = require('./snapshot-rename-format');

test('formatRenamed includes both names', () => {
  const out = formatRenamed('old', 'new');
  expect(out).toMatch(/old/);
  expect(out).toMatch(/new/);
  expect(out).toMatch(/Renamed/);
});

test('formatCopied includes both names', () => {
  const out = formatCopied('src', 'dest');
  expect(out).toMatch(/src/);
  expect(out).toMatch(/dest/);
  expect(out).toMatch(/Copied/);
});

test('formatDeleted includes name', () => {
  const out = formatDeleted('my-snap');
  expect(out).toMatch(/my-snap/);
  expect(out).toMatch(/Deleted/);
});

test('formatSnapshotError includes error text', () => {
  const out = formatSnapshotError('Snapshot not found');
  expect(out).toMatch(/not found/);
  expect(out).toMatch(/Error/);
});
