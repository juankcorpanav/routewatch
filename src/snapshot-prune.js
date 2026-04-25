const { listSnapshots, loadSnapshot } = require('./snapshot');
const fs = require('fs');
const path = require('path');

const SNAPSHOTS_DIR = path.join(process.cwd(), '.routewatch', 'snapshots');

/**
 * Returns snapshots older than the given age in days.
 */
function findStaleSnapshots(snapshots, maxAgeDays) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  return snapshots.filter((name) => {
    try {
      const snap = loadSnapshot(name);
      const ts = snap.timestamp ? new Date(snap.timestamp).getTime() : 0;
      return ts < cutoff;
    } catch {
      return false;
    }
  });
}

/**
 * Returns snapshots beyond the keep-last-N limit, sorted oldest first.
 */
function findExcessSnapshots(snapshots, keepLast) {
  if (snapshots.length <= keepLast) return [];
  const sorted = [...snapshots].sort((a, b) => {
    try {
      const tA = new Date(loadSnapshot(a).timestamp).getTime();
      const tB = new Date(loadSnapshot(b).timestamp).getTime();
      return tA - tB;
    } catch {
      return 0;
    }
  });
  return sorted.slice(0, sorted.length - keepLast);
}

/**
 * Deletes a snapshot file from disk.
 */
function pruneSnapshot(name) {
  const filePath = path.join(SNAPSHOTS_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) throw new Error(`Snapshot not found: ${name}`);
  fs.unlinkSync(filePath);
  return name;
}

/**
 * Runs a prune pass: removes stale and/or excess snapshots.
 * Returns the list of pruned snapshot names.
 */
function pruneSnapshots({ maxAgeDays, keepLast, dryRun = false } = {}) {
  const all = listSnapshots();
  const toDelete = new Set();

  if (maxAgeDays != null) {
    findStaleSnapshots(all, maxAgeDays).forEach((n) => toDelete.add(n));
  }
  if (keepLast != null) {
    findExcessSnapshots(all, keepLast).forEach((n) => toDelete.add(n));
  }

  const targets = [...toDelete];
  if (!dryRun) targets.forEach(pruneSnapshot);
  return targets;
}

module.exports = {
  findStaleSnapshots,
  findExcessSnapshots,
  pruneSnapshot,
  pruneSnapshots,
};
