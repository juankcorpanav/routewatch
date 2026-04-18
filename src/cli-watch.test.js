const { printWatchUsage, parseWatchArgs } = require('./cli-watch');
const { DEFAULT_INTERVAL } = require('./watch');

test('parseWatchArgs returns name and default options', () => {
  const result = parseWatchArgs(['node', 'cli.js', 'watch', 'staging']);
  expect(result.name).toBe('staging');
  expect(result.options.interval).toBe(DEFAULT_INTERVAL);
  expect(result.options.silent).toBe(false);
  expect(result.options.filters).toEqual({});
});

test('parseWatchArgs parses --interval', () => {
  const result = parseWatchArgs(['node', 'cli.js', 'watch', 'prod', '--interval', '3000']);
  expect(result.options.interval).toBe(3000);
});

test('parseWatchArgs parses --method filter', () => {
  const result = parseWatchArgs(['node', 'cli.js', 'watch', 'prod', '--method', 'POST']);
  expect(result.options.filters.method).toBe('POST');
});

test('parseWatchArgs parses --prefix filter', () => {
  const result = parseWatchArgs(['node', 'cli.js', 'watch', 'prod', '--prefix', '/api']);
  expect(result.options.filters.prefix).toBe('/api');
});

test('parseWatchArgs parses --tag filter', () => {
  const result = parseWatchArgs(['node', 'cli.js', 'watch', 'prod', '--tag', 'auth']);
  expect(result.options.filters.tag).toBe('auth');
});

test('parseWatchArgs parses --silent flag', () => {
  const result = parseWatchArgs(['node', 'cli.js', 'watch', 'prod', '--silent']);
  expect(result.options.silent).toBe(true);
});

test('parseWatchArgs returns undefined name when missing', () => {
  const result = parseWatchArgs(['node', 'cli.js', 'watch']);
  expect(result.name).toBeUndefined();
});

test('printWatchUsage does not throw', () => {
  expect(() => printWatchUsage()).not.toThrow();
});
