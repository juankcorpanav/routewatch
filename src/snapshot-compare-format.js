const { c } = require('./format');

function formatCompareHeader(nameA, nameB) {
  return `${c('Comparing', 'cyan')} ${c(nameA, 'yellow')} → ${c(nameB, 'yellow')}`;
}

function formatCompareSummary(summary) {
  const parts = [];
  if (summary.added) parts.push(c(`+${summary.added} added`, 'green'));
  if (summary.removed) parts.push(c(`-${summary.removed} removed`, 'red'));
  if (summary.changed) parts.push(c(`~${summary.changed} changed`, 'yellow'));
  if (!parts.length) return c('No differences found.', 'gray');
  return parts.join('  ');
}

function formatCompareEmpty() {
  return c('Snapshots are identical.', 'green');
}

function formatCompareResult(result, summary) {
  const lines = [];
  lines.push(formatCompareHeader(result.nameA, result.nameB));
  lines.push(formatCompareSummary(summary));
  return lines.join('\n');
}

module.exports = { formatCompareHeader, formatCompareSummary, formatCompareEmpty, formatCompareResult };
