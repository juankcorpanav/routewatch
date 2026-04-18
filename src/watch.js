const fs = require('fs');
const path = require('path');
const { loadSnapshot, saveSnapshot } = require('./snapshot');
const { diffSnapshots } = require('./diff');
const { applyFilters } = require('./filter');
const { formatDiffSummary } = require('./format');

const DEFAULT_INTERVAL = 5000;

function parseSnapshotRoutes(snapshot) {
  return snapshot && Array.isArray(snapshot.routes) ? snapshot.routes : [];
}

function watchSnapshot(name, options = {}) {
  const {
    interval = DEFAULT_INTERVAL,
    filters = {},
    onChange = null,
    silent = false,
  } = options;

  let previousSnapshot = null;

  try {
    previousSnapshot = loadSnapshot(name);
  } catch (e) {
    if (!silent) console.log(`[routewatch] No existing snapshot for "${name}", starting fresh.`);
  }

  const timer = setInterval(() => {
    let currentSnapshot;
    try {
      currentSnapshot = loadSnapshot(name);
    } catch (e) {
      if (!silent) console.warn(`[routewatch] Could not load snapshot "${name}": ${e.message}`);
      return;
    }

    if (!previousSnapshot) {
      previousSnapshot = currentSnapshot;
      return;
    }

    const prevRoutes = applyFilters(parseSnapshotRoutes(previousSnapshot), filters);
    const currRoutes = applyFilters(parseSnapshotRoutes(currentSnapshot), filters);

    const diff = diffSnapshots(
      { ...previousSnapshot, routes: prevRoutes },
      { ...currentSnapshot, routes: currRoutes }
    );

    const hasChanges = diff.added.length || diff.removed.length || diff.changed.length;

    if (hasChanges) {
      if (!silent) console.log(formatDiffSummary(diff));
      if (typeof onChange === 'function') onChange(diff, previousSnapshot, currentSnapshot);
    }

    previousSnapshot = currentSnapshot;
  }, interval);

  return {
    stop: () => clearInterval(timer),
  };
}

module.exports = { watchSnapshot, DEFAULT_INTERVAL };
