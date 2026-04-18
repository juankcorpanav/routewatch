// search.js — filter routes by keyword across method, path, tag, description

/**
 * Check if a string value includes the query (case-insensitive)
 */
function matchesQuery(value, query) {
  if (typeof value !== 'string') return false;
  return value.toLowerCase().includes(query.toLowerCase());
}

/**
 * Search routes in a snapshot by a keyword.
 * Matches against: method, path, tag, description
 * @param {object} snapshot
 * @param {string} query
 * @returns {Array} matching routes
 */
function searchRoutes(snapshot, query) {
  if (!snapshot || !Array.isArray(snapshot.routes)) return [];
  if (!query || query.trim() === '') return snapshot.routes;

  return snapshot.routes.filter(route => {
    return (
      matchesQuery(route.method, query) ||
      matchesQuery(route.path, query) ||
      matchesQuery(route.tag, query) ||
      matchesQuery(route.description, query)
    );
  });
}

/**
 * Format search results for CLI output
 * @param {Array} routes
 * @param {string} query
 * @returns {string}
 */
function formatSearchResults(routes, query) {
  if (routes.length === 0) {
    return `No routes matched "${query}".`;
  }
  const lines = [`Search results for "${query}" (${routes.length} match${routes.length === 1 ? '' : 'es'}):`, ''];
  for (const route of routes) {
    const tag = route.tag ? ` [${route.tag}]` : '';
    const desc = route.description ? ` — ${route.description}` : '';
    lines.push(`  ${(route.method || 'ANY').toUpperCase().padEnd(7)} ${route.path}${tag}${desc}`);
  }
  return lines.join('\n');
}

module.exports = { matchesQuery, searchRoutes, formatSearchResults };
