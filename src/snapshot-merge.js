// snapshot-merge.js — merge multiple snapshots into one combined snapshot

function mergeSnapshots(snapshots, { onConflict = 'last' } = {}) {
  if (!Array.isArray(snapshots) || snapshots.length === 0) {
    throw new Error('mergeSnapshots requires a non-empty array of snapshots');
  }

  const routeMap = new Map();

  for (const snapshot of snapshots) {
    if (!Array.isArray(snapshot.routes)) {
      throw new Error('Each snapshot must have a routes array');
    }
    for (const route of snapshot.routes) {
      const key = `${route.method}:${route.path}`;
      if (!routeMap.has(key) || onConflict === 'last') {
        routeMap.set(key, { ...route });
      } else if (onConflict === 'first') {
        // keep existing
      } else if (onConflict === 'merge') {
        const existing = routeMap.get(key);
        routeMap.set(key, { ...existing, ...route });
      }
    }
  }

  return {
    name: snapshots.map(s => s.name).filter(Boolean).join('+'),
    timestamp: new Date().toISOString(),
    routes: Array.from(routeMap.values()),
  };
}

function formatMergeSummary(merged, sources) {
  const lines = [
    `Merged ${sources.length} snapshots → ${merged.routes.length} routes`,
    `Sources: ${sources.map(s => s.name || '(unnamed)').join(', ')}`,
    `Result:  ${merged.name}`,
  ];
  return lines.join('\n');
}

module.exports = { mergeSnapshots, formatMergeSummary };
