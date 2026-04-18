const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = '.routewatch';

function ensureSnapshotDir() {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }
}

function saveSnapshot(name, routes) {
  ensureSnapshotDir();
  const snapshot = {
    name,
    timestamp: new Date().toISOString(),
    routes,
  };
  const filePath = path.join(SNAPSHOT_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
  return filePath;
}

function loadSnapshot(name) {
  const filePath = path.join(SNAPSHOT_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Snapshot "${name}" not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function listSnapshots() {
  ensureSnapshotDir();
  return fs.readdirSync(SNAPSHOT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

module.exports = { saveSnapshot, loadSnapshot, listSnapshots };
