const fs = require('fs');
const path = require('path');
const { assertValidSnapshot } = require('./validate');

const SNAPSHOT_DIR = path.resolve(process.cwd(), '.routewatch', 'snapshots');

function ensureSnapshotDir() {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

function saveSnapshot(name, routes) {
  ensureSnapshotDir();
  const snapshot = {
    name,
    timestamp: new Date().toISOString(),
    routes,
  };
  assertValidSnapshot(snapshot);
  const filepath = path.join(SNAPSHOT_DIR, `${name}.json`);
  fs.writeFileSync(filepath, JSON.stringify(snapshot, null, 2));
  return filepath;
}

function loadSnapshot(name) {
  const filepath = path.join(SNAPSHOT_DIR, `${name}.json`);
  if (!fs.existsSync(filepath)) {
    throw new Error(`Snapshot '${name}' not found`);
  }
  const raw = fs.readFileSync(filepath, 'utf8');
  const snapshot = JSON.parse(raw);
  assertValidSnapshot(snapshot);
  return snapshot;
}

function listSnapshots() {
  if (!fs.existsSync(SNAPSHOT_DIR)) return [];
  return fs
    .readdirSync(SNAPSHOT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace(/\.json$/, ''));
}

module.exports = { ensureSnapshotDir, saveSnapshot, loadSnapshot, listSnapshots };
