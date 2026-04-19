const fs = require('fs');
const path = require('path');
const { loadHistory, addHistoryEntry, clearHistory, getRecentHistory } = require('./history');

const HISTORY_FILE = path.join(process.cwd(), '.routewatch', 'history', 'commands.json');

function cleanup() {
  if (fs.existsSync(HISTORY_FILE)) fs.unlinkSync(HISTORY_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('loadHistory returns empty array when no file', () => {
  expect(loadHistory()).toEqual([]);
});

test('addHistoryEntry saves an entry', () => {
  const entry = addHistoryEntry('diff', { from: 'v1', to: 'v2' });
  expect(entry.command).toBe('diff');
  expect(entry.args).toEqual({ from: 'v1', to: 'v2' });
  expect(entry.timestamp).toBeDefined();
  const history = loadHistory();
  expect(history.length).toBe(1);
  expect(history[0].command).toBe('diff');
});

test('addHistoryEntry prepends entries', () => {
  addHistoryEntry('save', { name: 'snap1' });
  addHistoryEntry('load', { name: 'snap2' });
  const history = loadHistory();
  expect(history[0].command).toBe('load');
  expect(history[1].command).toBe('save');
});

test('clearHistory removes all entries', () => {
  addHistoryEntry('save', {});
  clearHistory();
  expect(loadHistory()).toEqual([]);
});

test('getRecentHistory respects limit', () => {
  for (let i = 0; i < 15; i++) addHistoryEntry('cmd' + i, {});
  expect(getRecentHistory(5).length).toBe(5);
  expect(getRecentHistory().length).toBe(10);
});
