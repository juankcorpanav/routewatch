/**
 * Computes a diff between two route snapshots.
 * Each snapshot is expected to be an array of route objects with at least { method, path }.
 */

function normalizeKey(route) {
  return `${route.method.toUpperCase()} ${route.path}`;
}

function buildRouteMap(routes) {
  const map = {};
  for (const route of routes) {
    const key = normalizeKey(route);
    map[key] = route;
  }
  return map;
}

/**
 * Compares two route snapshots and returns the added, removed, and changed routes.
 *
 * @param {object} oldSnapshot - The previous snapshot, expected to have a `routes` array.
 * @param {object} newSnapshot - The current snapshot, expected to have a `routes` array.
 * @returns {{ added: object[], removed: object[], changed: object[] }}
 */
function diffSnapshots(oldSnapshot, newSnapshot) {
  if (!oldSnapshot || typeof oldSnapshot !== 'object') {
    throw new TypeError('oldSnapshot must be a non-null object');
  }
  if (!newSnapshot || typeof newSnapshot !== 'object') {
    throw new TypeError('newSnapshot must be a non-null object');
  }

  const oldMap = buildRouteMap(oldSnapshot.routes || []);
  const newMap = buildRouteMap(newSnapshot.routes || []);

  const added = [];
  const removed = [];
  const changed = [];

  for (const key of Object.keys(newMap)) {
    if (!oldMap[key]) {
      added.push(newMap[key]);
    } else {
      const oldRoute = oldMap[key];
      const newRoute = newMap[key];
      const differences = getFieldChanges(oldRoute, newRoute);
      if (differences.length > 0) {
        changed.push({ route: key, differences });
      }
    }
  }

  for (const key of Object.keys(oldMap)) {
    if (!newMap[key]) {
      removed.push(oldMap[key]);
    }
  }

  return { added, removed, changed };
}

/**
 * Returns a list of field-level changes between two route objects,
 * ignoring the identity fields `method` and `path`.
 *
 * @param {object} oldRoute
 * @param {object} newRoute
 * @returns {{ field: string, from: any, to: any }[]}
 */
function getFieldChanges(oldRoute, newRoute) {
  const ignoredKeys = new Set(['method', 'path']);
  const allKeys = new Set([...Object.keys(oldRoute), ...Object.keys(newRoute)]);
  const changes = [];

  for (const key of allKeys) {
    if (ignoredKeys.has(key)) continue;
    const oldVal = JSON.stringify(oldRoute[key]);
    const newVal = JSON.stringify(newRoute[key]);
    if (oldVal !== newVal) {
      changes.push({ field: key, from: oldRoute[key], to: newRoute[key] });
    }
  }

  return changes;
}

module.exports = { diffSnapshots, getFieldChanges };
