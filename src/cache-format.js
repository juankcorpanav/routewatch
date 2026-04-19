const { c } = require('./format');

function formatCacheEntry({ url, timestamp, age }) {
  const ageStr = age < 60000
    ? `${Math.floor(age / 1000)}s ago`
    : `${Math.floor(age / 60000)}m ago`;
  const date = new Date(timestamp).toISOString();
  return `  ${c(url, 'cyan')} — cached ${c(ageStr, 'yellow')} (${date})`;
}

function formatCacheList(entries) {
  if (!entries.length) return c('No cached entries.', 'gray');
  const lines = [c(`Cached entries (${entries.length}):`, 'bold')];
  for (const entry of entries) lines.push(formatCacheEntry(entry));
  return lines.join('\n');
}

function formatCacheHit(url) {
  return c(`[cache hit] `, 'green') + c(url, 'cyan');
}

function formatCacheMiss(url) {
  return c(`[cache miss] `, 'yellow') + c(url, 'cyan');
}

function formatCacheCleared(url) {
  if (url) return c(`Cleared cache for: `, 'red') + c(url, 'cyan');
  return c('All cache entries cleared.', 'red');
}

module.exports = { formatCacheEntry, formatCacheList, formatCacheHit, formatCacheMiss, formatCacheCleared };
