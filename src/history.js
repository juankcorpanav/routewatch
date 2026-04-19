const fs = require('fs');
const path = require('path');

const HISTORY_DIR = path.join(process.cwd(), '.routewatch', 'history');
const HISTORY_FILE = path.join(HISTORY_DIR, 'commands.json');
const MAX_HISTORY = 100;

function ensureHistoryDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

function loadHistory() {
  ensureHistoryDir();
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  ensureHistoryDir();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2));
}

function addHistoryEntry(command, args = {}, meta = {}) {
  const entries = loadHistory();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    command,
    args,
    meta
  };
  entries.unshift(entry);
  if (entries.length > MAX_HISTORY) entries.splice(MAX_HISTORY);
  saveHistory(entries);
  return entry;
}

function clearHistory() {
  saveHistory([]);
}

function getRecentHistory(limit = 10) {
  return loadHistory().slice(0, limit);
}

module.exports = { loadHistory, addHistoryEntry, clearHistory, getRecentHistory };
