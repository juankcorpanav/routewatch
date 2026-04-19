const { loadSnapshot } = require('./snapshot');
const { diffSnapshots } = require('./diff');
const { applyFilters } = require('./filter');

function compareSnapshots(nameA, nameB, filters = {}) {
  const snapshotA = loadSnapshot(nameA);
  const snapshotB = loadSnapshot(nameB);
  if (!snapshotA) throw new Error(`Snapshot not found: ${nameA}`);
  if (!snapshotB) throw new Error(`Snapshot not found: ${nameB}`);
  const routesA = filters ? applyFilters(snapshotA.routes, filters) : snapshotA.routes;
  const routesB = filters ? applyFilters(snapshotB.routes, filters) : snapshotB.routes;
  const diff = diffSnapshots(routesA, routesB);
  return { nameA, nameB, diff, meta: { a: snapshotA.meta, b: snapshotB.meta } };
}

function compareSummary(result) {
  const { added, removed, changed } = result.diff;
  return {
    added: added.length,
    removed: removed.length,
    changed: changed.length,
    total: added.length + removed.length + changed.length
  };
}

module.exports = { compareSnapshots, compareSummary };
