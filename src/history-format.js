const { c } = require('./format');

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function formatHistoryEntry(entry, index) {
  const num = c(`${String(index + 1).padStart(3)}.`, 'dim');
  const cmd = c(entry.command, 'cyan');
  const ts = c(formatTimestamp(entry.timestamp), 'dim');
  const args = Object.entries(entry.args || {})
    .map(([k, v]) => `${c(k, 'yellow')}=${v}`)
    .join(' ');
  return `${num} ${cmd} ${args}  ${ts}`;
}

function formatHistoryList(entries) {
  if (!entries.length) return c('No command history found.', 'dim');
  const header = c('Command History', 'bold');
  const lines = entries.map((e, i) => formatHistoryEntry(e, i));
  return [header, ...lines].join('\n');
}

function formatHistoryCleared() {
  return c('Command history cleared.', 'green');
}

module.exports = { formatHistoryEntry, formatHistoryList, formatHistoryCleared };
