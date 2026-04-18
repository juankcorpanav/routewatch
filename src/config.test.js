const fs = require('fs');
const path = require('path');
const { loadConfig, saveConfig, getConfigValue, setConfigValue, resetConfig, DEFAULTS } = require('./config');

const CONFIG_FILE = path.join(process.cwd(), '.routewatch', 'config.json');

function cleanup() {
  if (fs.existsSync(CONFIG_FILE)) fs.unlinkSync(CONFIG_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('loadConfig returns defaults when no file exists', () => {
  const config = loadConfig();
  expect(config).toEqual(DEFAULTS);
});

test('saveConfig persists values and merges with defaults', () => {
  const saved = saveConfig({ defaultFormat: 'json' });
  expect(saved.defaultFormat).toBe('json');
  expect(saved.watchInterval).toBe(DEFAULTS.watchInterval);
});

test('loadConfig reads persisted values', () => {
  saveConfig({ watchInterval: 9000 });
  const config = loadConfig();
  expect(config.watchInterval).toBe(9000);
});

test('getConfigValue returns specific key', () => {
  saveConfig({ defaultExport: 'csv' });
  expect(getConfigValue('defaultExport')).toBe('csv');
});

test('setConfigValue updates a valid key', () => {
  const result = setConfigValue('defaultFormat', 'markdown');
  expect(result.defaultFormat).toBe('markdown');
});

test('setConfigValue throws on unknown key', () => {
  expect(() => setConfigValue('nonexistent', 'val')).toThrow('Unknown config key');
});

test('resetConfig restores defaults', () => {
  saveConfig({ watchInterval: 1000 });
  const result = resetConfig();
  expect(result).toEqual(DEFAULTS);
  expect(loadConfig()).toEqual(DEFAULTS);
});
