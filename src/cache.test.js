const fs = require('fs');
const path = require('path');
const { saveCache, loadCache, clearCache, listCache, buildCacheKey } = require('./cache');

const CACHE_DIR = path.join(process.cwd(), '.routewatch', 'cache');

function cleanup() {
  if (fs.existsSync(CACHE_DIR)) fs.rmSync(CACHE_DIR, { recursive: true });
}

beforeEach(cleanup);
afterAll(cleanup);

test('buildCacheKey returns stable base64 key', () => {
  const key = buildCacheKey('http://example.com/api');
  expect(typeof key).toBe('string');
  expect(key).toBe(buildCacheKey('http://example.com/api'));
});

test('saveCache and loadCache round-trip', () => {
  const data = [{ method: 'GET', path: '/users' }];
  saveCache('http://example.com/api', data);
  const result = loadCache('http://example.com/api');
  expect(result).toEqual(data);
});

test('loadCache returns null for unknown url', () => {
  expect(loadCache('http://unknown.com')).toBeNull();
});

test('loadCache returns null when cache is expired', () => {
  const data = [{ method: 'POST', path: '/items' }];
  saveCache('http://example.com/old', data);
  const result = loadCache('http://example.com/old', 0);
  expect(result).toBeNull();
});

test('listCache returns saved entries', () => {
  saveCache('http://example.com/a', []);
  saveCache('http://example.com/b', []);
  const list = listCache();
  expect(list.length).toBe(2);
  expect(list.map(e => e.url)).toContain('http://example.com/a');
});

test('clearCache removes specific entry', () => {
  saveCache('http://example.com/x', []);
  clearCache('http://example.com/x');
  expect(loadCache('http://example.com/x')).toBeNull();
});

test('clearCache with no args removes all entries', () => {
  saveCache('http://example.com/1', []);
  saveCache('http://example.com/2', []);
  clearCache();
  expect(listCache().length).toBe(0);
});
