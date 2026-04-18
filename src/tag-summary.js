// Summarize routes grouped by tag across a snapshot

function groupByTag(routes) {
  const groups = {};
  for (const route of routes) {
    const tag = route.tag || 'untagged';
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(route);
  }
  return groups;
}

function countByMethod(routes) {
  const counts = {};
  for (const route of routes) {
    const method = (route.method || 'UNKNOWN').toUpperCase();
    counts[method] = (counts[method] || 0) + 1;
  }
  return counts;
}

function buildTagSummary(snapshot) {
  const routes = snapshot.routes || [];
  const groups = groupByTag(routes);
  const summary = [];

  for (const [tag, tagRoutes] of Object.entries(groups)) {
    summary.push({
      tag,
      count: tagRoutes.length,
      methods: countByMethod(tagRoutes),
    });
  }

  summary.sort((a, b) => a.tag.localeCompare(b.tag));
  return summary;
}

function formatTagSummary(summary) {
  const lines = ['Tag Summary:', ''];
  for (const entry of summary) {
    const methodStr = Object.entries(entry.methods)
      .map(([m, c]) => `${m}:${c}`)
      .join(' ');
    lines.push(`  ${entry.tag} (${entry.count} routes) — ${methodStr}`);
  }
  return lines.join('\n');
}

module.exports = { groupByTag, countByMethod, buildTagSummary, formatTagSummary };
