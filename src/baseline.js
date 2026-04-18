const fs = require('fs');
const path = require('path');
const { loadSnapshot } = require('./snapshot');

const BASELINE_FILE = path.join(process.cwd(), '.routewatch', 'baseline.json');

function setBaseline(snapshotName) {
  const snapshot = loadSnapshot(snapshotName);
  if (!snapshot) throw new Error(`Snapshot not found: ${snapshotName}`);
  const dir = path.dirname(BASELINE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(BASELINE_FILE, JSON.stringify({ name: snapshotName, snapshot, setAt: new Date().toISOString() }, null, 2));
  return snapshotName;
}

function getBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function clearBaseline() {
  if (fs.existsSync(BASELINE_FILE)) fs.unlinkSync(BASELINE_FILE);
}

function hasBaseline() {
  return fs.existsSync(BASELINE_FILE);
}

module.exports = { setBaseline, getBaseline, clearBaseline, hasBaseline, BASELINE_FILE };
