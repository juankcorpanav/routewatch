const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(process.cwd(), '.routewatch', 'cache');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function buildCacheKey(url) {
  return Buffer.from(url).toString('base64').replace(/[/+=]/g, '_');
}

function saveCache(url, data) {
  ensureCacheDir();
  const key = buildCacheKey(url);
  const entry = { url, timestamp: Date.now(), data };
  fs.writeFileSync(path.join(CACHE_DIR, `${key}.json`), JSON.stringify(entry, null, 2));
}

function loadCache(url, maxAgeMs = 60000) {
  ensureCacheDir();
  const key = buildCacheKey(url);
  const file = path.join(CACHE_DIR, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  const entry = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (Date.now() - entry.timestamp > maxAgeMs) return null;
  return entry.data;
}

function clearCache(url) {
  ensureCacheDir();
  if (url) {
    const file = path.join(CACHE_DIR, `${buildCacheKey(url)}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } else {
    for (const f of fs.readdirSync(CACHE_DIR)) {
      fs.unlinkSync(path.join(CACHE_DIR, f));
    }
  }
}

function listCache() {
  ensureCacheDir();
  return fs.readdirSync(CACHE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(CACHE_DIR, f), 'utf8')))
    .map(({ url, timestamp }) => ({ url, timestamp, age: Date.now() - timestamp }));
}

module.exports = { ensureCacheDir, buildCacheKey, saveCache, loadCache, clearCache, listCache };
