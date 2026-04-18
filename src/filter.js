/**
 * filter.js — utilities for filtering routes in snapshots
 */

/**
 * Filter routes by HTTP method (e.g. 'GET', 'POST')
 * @param {Object[]} routes
 * @param {string} method
 * @returns {Object[]}
 */
function filterByMethod(routes, method) {
  if (!method) return routes;
  const upper = method.toUpperCase();
  return routes.filter(r => r.method && r.method.toUpperCase() === upper);
}

/**
 * Filter routes by path prefix (e.g. '/api/v1')
 * @param {Object[]} routes
 * @param {string} prefix
 * @returns {Object[]}
 */
function filterByPrefix(routes, prefix) {
  if (!prefix) return routes;
  return routes.filter(r => r.path && r.path.startsWith(prefix));
}

/**
 * Filter routes by tag (if routes have a tags array)
 * @param {Object[]} routes
 * @param {string} tag
 * @returns {Object[]}
 */
function filterByTag(routes, tag) {
  if (!tag) return routes;
  return routes.filter(r => Array.isArray(r.tags) && r.tags.includes(tag));
}

/**
 * Apply a set of filter options to a route list
 * @param {Object[]} routes
 * @param {{ method?: string, prefix?: string, tag?: string }} opts
 * @returns {Object[]}
 */
function applyFilters(routes, opts = {}) {
  let result = routes;
  if (opts.method) result = filterByMethod(result, opts.method);
  if (opts.prefix) result = filterByPrefix(result, opts.prefix);
  if (opts.tag)    result = filterByTag(result, opts.tag);
  return result;
}

module.exports = { filterByMethod, filterByPrefix, filterByTag, applyFilters };
