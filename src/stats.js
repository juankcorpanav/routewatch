// Compute statistics from a snapshot's routes

function countByMethod(routes) {
  const counts = {};
  for (const route of routes) {
    const method = (route.method || 'UNKNOWN').toUpperCase();
    counts[method] = (counts[method] || 0) + 1;
  }
  return counts;
}

function countByTag(routes) {
  const counts = {};
  for (const route of routes) {
    const tags = Array.isArray(route.tags) ? route.tags : ['untagged'];
    for (const tag of tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return counts;
}

function countDeprecated(routes) {
  return routes.filter(r => r.deprecated === true).length;
}

function buildStats(snapshot) {
  const routes = snapshot.routes || [];
  return {
    total: routes.length,
    byMethod: countByMethod(routes),
    byTag: countByTag(routes),
    deprecated: countDeprecated(routes),
  };
}

function formatStats(stats) {
  const lines = [];
  lines.push(`Total routes : ${stats.total}`);
  lines.push(`Deprecated   : ${stats.deprecated}`);
  lines.push('By method:');
  for (const [method, count] of Object.entries(stats.byMethod).sort()) {
    lines.push(`  ${method.padEnd(8)} ${count}`);
  }
  lines.push('By tag:');
  for (const [tag, count] of Object.entries(stats.byTag).sort()) {
    lines.push(`  ${tag.padEnd(20)} ${count}`);
  }
  return lines.join('\n');
}

module.exports = { countByMethod, countByTag, countDeprecated, buildStats, formatStats };
