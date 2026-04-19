const fs = require('fs');
const path = require('path');
const { registerPlugin, removePlugin, getPlugin, listPlugins } = require('./plugin');

const PLUGIN_DIR = path.join(process.cwd(), '.routewatch', 'plugins');
const REGISTRY = path.join(PLUGIN_DIR, 'registry.json');

function cleanup() {
  if (fs.existsSync(REGISTRY)) fs.unlinkSync(REGISTRY);
}

beforeEach(cleanup);
afterAll(cleanup);

test('registerPlugin stores plugin entry', () => {
  const entry = registerPlugin('my-plugin', './plugins/my-plugin.js');
  expect(entry.name).toBe('my-plugin');
  expect(entry.modulePath).toBe('./plugins/my-plugin.js');
  expect(entry.registeredAt).toBeDefined();
});

test('getPlugin returns registered plugin', () => {
  registerPlugin('test-plugin', './plugins/test.js');
  const entry = getPlugin('test-plugin');
  expect(entry).not.toBeNull();
  expect(entry.name).toBe('test-plugin');
});

test('getPlugin returns null for unknown plugin', () => {
  expect(getPlugin('nonexistent')).toBeNull();
});

test('listPlugins returns all plugins', () => {
  registerPlugin('alpha', './alpha.js');
  registerPlugin('beta', './beta.js');
  const list = listPlugins();
  expect(list.length).toBe(2);
  expect(list.map(p => p.name)).toContain('alpha');
  expect(list.map(p => p.name)).toContain('beta');
});

test('removePlugin deletes plugin from registry', () => {
  registerPlugin('to-remove', './remove.js');
  const result = removePlugin('to-remove');
  expect(result).toBe(true);
  expect(getPlugin('to-remove')).toBeNull();
});

test('removePlugin returns false for unknown plugin', () => {
  expect(removePlugin('ghost')).toBe(false);
});
