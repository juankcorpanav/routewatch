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

function diffSnapshots(oldSnapshot, newSnapshot) {
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
