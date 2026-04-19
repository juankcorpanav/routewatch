const { buildRouteMap } = require('./diff');

/**
 * Split a snapshot into sub-snapshots by a given field (e.g. 'tag', 'method').
 * Returns an object keyed by the field value.
 */
function splitByField(snapshot, field) {
  const groups = {};
  for (const route of snapshot.routes) {
    const key = (route[field] || 'unknown').toString().toLowerCase();
    if (!groups[key]) {
      groups[key] = { ...snapshot, routes: [] };
    }
    groups[key].routes.push(route);
  }
  return groups;
}

/**
 * Split a snapshot into two halves: matching a predicate and not matching.
 */
function splitByPredicate(snapshot, predicate) {
  const matched = { ...snapshot, routes: [] };
  const unmatched = { ...snapshot, routes: [] };
  for (const route of snapshot.routes) {
    if (predicate(route)) {
      matched.routes.push(route);
    } else {
      unmatched.routes.push(route);
    }
  }
  return { matched, unmatched };
}

/**
 * Format a summary of a split operation.
 */
function formatSplitSummary(groups) {
  const lines = ['Split Summary:'];
  for (const [key, snap] of Object.entries(groups)) {
    lines.push(`  ${key}: ${snap.routes.length} route(s)`);
  }
  return lines.join('\n');
}

module.exports = { splitByField, splitByPredicate, formatSplitSummary };
