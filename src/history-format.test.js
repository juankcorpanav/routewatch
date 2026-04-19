const { formatHistoryEntry, formatHistoryList, formatHistoryCleared } = require('./history-format');

const sampleEntry = {
  id: 1700000000000,
  timestamp: '2024-01-15T10:30:00.000Z',
  command: 'diff',
  args: { from: 'v1', to: 'v2' },
  meta: {}
};

test('formatHistoryEntry includes command name', () => {
  const out = formatHistoryEntry(sampleEntry, 0);
  expect(out).toContain('diff');
});

test('formatHistoryEntry includes args', () => {
  const out = formatHistoryEntry(sampleEntry, 0);
  expect(out).toContain('from');
  expect(out).toContain('v1');
});

test('formatHistoryEntry includes index number', () => {
  const out = formatHistoryEntry(sampleEntry, 4);
  expect(out).toContain('5');
});

test('formatHistoryList returns no-history message for empty array', () => {
  const out = formatHistoryList([]);
  expect(out).toContain('No command history');
});

test('formatHistoryList includes header and entries', () => {
  const out = formatHistoryList([sampleEntry]);
  expect(out).toContain('Command History');
  expect(out).toContain('diff');
});

test('formatHistoryCleared returns confirmation', () => {
  const out = formatHistoryCleared();
  expect(out).toContain('cleared');
});
