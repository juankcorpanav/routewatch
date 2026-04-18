const fs = require('fs');
const path = require('path');

const CHANGELOG_DIR = '.routewatch/changelogs';

function ensureChangelogDir() {
  if (!fs.existsSync(CHANGELOG_DIR)) {
    fs.mkdirSync(CHANGELOG_DIR, { recursive: true });
  }
}

function buildChangelogFilename(label) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const safe = label ? label.replace(/[^a-zA-Z0-9_-]/g, '_') : 'unnamed';
  return `${ts}__${safe}.json`;
}

function saveChangelog(label, diffResult) {
  ensureChangelogDir();
  const filename = buildChangelogFilename(label);
  const filepath = path.join(CHANGELOG_DIR, filename);
  const entry = { label, timestamp: new Date().toISOString(), diff: diffResult };
  fs.writeFileSync(filepath, JSON.stringify(entry, null, 2));
  return filepath;
}

function listChangelogs() {
  ensureChangelogDir();
  return fs.readdirSync(CHANGELOG_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse();
}

function loadChangelog(filename) {
  const filepath = path.join(CHANGELOG_DIR, filename);
  if (!fs.existsSync(filepath)) throw new Error(`Changelog not found: ${filename}`);
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function formatChangelogEntry(entry) {
  const { label, timestamp, diff } = entry;
  const lines = [
    `Changelog: ${label || 'unnamed'}`,
    `Recorded: ${timestamp}`,
    `Added: ${diff.added.length}  Removed: ${diff.removed.length}  Changed: ${diff.changed.length}`,
  ];
  return lines.join('\n');
}

module.exports = { ensureChangelogDir, buildChangelogFilename, saveChangelog, listChangelogs, loadChangelog, formatChangelogEntry };
