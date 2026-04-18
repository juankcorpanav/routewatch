// format.js — output formatting for route diffs and snapshots

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

function c(color, text) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function formatAdded(route) {
  return c('green', `+ [${route.method}] ${route.path}`);
}

function formatRemoved(route) {
  return c('red', `- [${route.method}] ${route.path}`);
}

function formatChanged(route, changes) {
  const lines = [c('yellow', `~ [${route.method}] ${route.path}`)];
  for (const [field, { before, after }] of Object.entries(changes)) {
    lines.push(`    ${c('dim', field + ':')} ${c('red', String(before))} → ${c('green', String(after))}`);
  }
  return lines.join('\n');
}

function formatDiffSummary(diff) {
  const lines = [];

  if (diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0) {
    lines.push(c('cyan', 'No changes detected.'));
    return lines.join('\n');
  }

  for (const route of diff.added) lines.push(formatAdded(route));
  for (const route of diff.removed) lines.push(formatRemoved(route));
  for (const { route, changes } of diff.changed) lines.push(formatChanged(route, changes));

  const summary = [
    c('bold', '\nSummary:'),
    c('green', `  Added:   ${diff.added.length}`),
    c('red',   `  Removed: ${diff.removed.length}`),
    c('yellow', `  Changed: ${diff.changed.length}`),
  ];
  lines.push(...summary);

  return lines.join('\n');
}

function formatSnapshotList(snapshots) {
  if (snapshots.length === 0) return c('dim', 'No snapshots found.');
  return snapshots
    .map((name, i) => `  ${c('dim', String(i + 1) + '.')} ${c('cyan', name)}`)
    .join('\n');
}

module.exports = { formatAdded, formatRemoved, formatChanged, formatDiffSummary, formatSnapshotList };
