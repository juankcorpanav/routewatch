const { watchSnapshot, DEFAULT_INTERVAL } = require('./watch');
const snapshot = require('./snapshot');
const diff = require('./diff');
const format = require('./format');

jest.mock('./snapshot');
jest.mock('./diff');
jest.mock('./format');
jest.useFakeTimers();

const mockSnapshot1 = { name: 'test', routes: [{ method: 'GET', path: '/a', tag: 'x' }] };
const mockSnapshot2 = { name: 'test', routes: [{ method: 'GET', path: '/b', tag: 'x' }] };

beforeEach(() => {
  jest.clearAllMocks();
  format.formatDiffSummary.mockReturnValue('summary');
});

test('DEFAULT_INTERVAL is 5000', () => {
  expect(DEFAULT_INTERVAL).toBe(5000);
});

test('returns stop function', () => {
  snapshot.loadSnapshot.mockReturnValue(mockSnapshot1);
  diff.diffSnapshots.mockReturnValue({ added: [], removed: [], changed: [] });
  const watcher = watchSnapshot('test', { silent: true });
  expect(typeof watcher.stop).toBe('function');
  watcher.stop();
});

test('calls onChange when diff has changes', () => {
  const onChange = jest.fn();
  snapshot.loadSnapshot
    .mockReturnValueOnce(mockSnapshot1)
    .mockReturnValue(mockSnapshot2);
  diff.diffSnapshots.mockReturnValue({ added: [{ method: 'GET', path: '/b' }], removed: [], changed: [] });

  const watcher = watchSnapshot('test', { silent: true, onChange });
  jest.advanceTimersByTime(5000);
  expect(onChange).toHaveBeenCalledTimes(1);
  watcher.stop();
});

test('does not call onChange when no changes', () => {
  const onChange = jest.fn();
  snapshot.loadSnapshot.mockReturnValue(mockSnapshot1);
  diff.diffSnapshots.mockReturnValue({ added: [], removed: [], changed: [] });

  const watcher = watchSnapshot('test', { silent: true, onChange });
  jest.advanceTimersByTime(10000);
  expect(onChange).not.toHaveBeenCalled();
  watcher.stop();
});

test('handles missing snapshot gracefully on first load', () => {
  snapshot.loadSnapshot
    .mockImplementationOnce(() => { throw new Error('not found'); })
    .mockReturnValue(mockSnapshot1);
  diff.diffSnapshots.mockReturnValue({ added: [], removed: [], changed: [] });

  expect(() => {
    const watcher = watchSnapshot('test', { silent: true });
    jest.advanceTimersByTime(5000);
    watcher.stop();
  }).not.toThrow();
});
