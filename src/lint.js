// Lint snapshot routes for common issues

function lintMissingTags(routes) {
  return routes
    .filter(r => !r.tags || r.tags.length === 0)
    .map(r => ({ route: `${r.method} ${r.path}`, issue: 'missing tags' }));
}

function lintMissingDescription(routes) {
  return routes
    .filter(r => !r.description || r.description.trim() === '')
    .map(r => ({ route: `${r.method} ${r.path}`, issue: 'missing description' }));
}

function lintDuplicateRoutes(routes) {
  const seen = new Set();
  const dupes = [];
  for (const r of routes) {
    const key = `${r.method.toUpperCase()} ${r.path}`;
    if (seen.has(key)) {
      dupes.push({ route: key, issue: 'duplicate route' });
    } else {
      seen.add(key);
    }
  }
  return dupes;
}

function lintSnapshot(snapshot) {
  const routes = snapshot.routes || [];
  return [
    ...lintMissingTags(routes),
    ...lintMissingDescription(routes),
    ...lintDuplicateRoutes(routes),
  ];
}

function formatLintResults(results) {
  if (results.length === 0) return 'No lint issues found.';
  return results
    .map(r => `  [${r.issue}] ${r.route}`)
    .join('\n');
}

module.exports = {
  lintMissingTags,
  lintMissingDescription,
  lintDuplicateRoutes,
  lintSnapshot,
  formatLintResults,
};
