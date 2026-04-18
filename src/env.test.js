const fs = require('fs');
const path = require('path');
const { setEnv, getEnv, removeEnv, listEnvs, loadEnvs } = require('./env');

const ENV_FILE = path.resolve('.routewatch', 'environments.json');

function cleanup() {
  if (fs.existsSync(ENV_FILE)) fs.unlinkSync(ENV_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('setEnv stores environment', () => {
  const env = setEnv('prod', 'https://api.example.com');
  expect(env.name).toBe('prod');
  expect(env.url).toBe('https://api.example.com');
  expect(env.createdAt).toBeDefined();
});

test('getEnv retrieves stored environment', () => {
  setEnv('staging', 'https://staging.example.com');
  const env = getEnv('staging');
  expect(env).not.toBeNull();
  expect(env.url).toBe('https://staging.example.com');
});

test('getEnv returns null for unknown env', () => {
  expect(getEnv('unknown')).toBeNull();
});

test('removeEnv deletes environment', () => {
  setEnv('dev', 'http://localhost:3000');
  const result = removeEnv('dev');
  expect(result).toBe(true);
  expect(getEnv('dev')).toBeNull();
});

test('removeEnv returns false for missing env', () => {
  expect(removeEnv('ghost')).toBe(false);
});

test('listEnvs returns all environments', () => {
  setEnv('prod', 'https://api.example.com');
  setEnv('staging', 'https://staging.example.com');
  const list = listEnvs();
  expect(list.length).toBe(2);
  expect(list.map(e => e.name)).toContain('prod');
  expect(list.map(e => e.name)).toContain('staging');
});

test('setEnv throws on missing args', () => {
  expect(() => setEnv('', 'url')).toThrow();
  expect(() => setEnv('name', '')).toThrow();
});
