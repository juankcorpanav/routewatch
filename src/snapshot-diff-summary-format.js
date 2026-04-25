const { c } = require('./format');

const CLASSIFICATION_COLORS = {
  stable: 'green',
  minor: 'cyan',
  moderate: 'yellow',
  breaking: 'red',
};

/**
 * Format a single stat line for the summary table.
 */
function formatStatLine(label, value, colorFn) {
  const val = colorFn ? colorFn(String(value)) : String(value);
  return `  ${label.padEnd(16)} ${val}`;
}

/**
 * Format the classification badge.
 * @param {string} classification
 * @returns {string}
 */
function formatClassification(classification) {
  const color = CLASSIFICATION_COLORS[classification] || 'white';
  return c[color] ? c[color](`[${classification.toUpperCase()}]`) : `[${classification.toUpperCase()}]`;
}

/**
 * Format the full diff summary block for display in the terminal.
 * @param {object} summary - from buildFullDiffSummary()
 * @returns {string}
 */
function formatDiffSummaryBlock(summary) {
  const badge = formatClassification(summary.classification);
  const lines = [
    `Diff Summary ${badge}`,
    '',
    formatStatLine('Added:', summary.added, c.green),
    formatStatLine('Removed:', summary.removed, c.red),
    formatStatLine('Changed:', summary.changed, c.yellow),
    formatStatLine('Total changes:', summary.total, c.white),
    '',
    formatStatLine('Base routes:', summary.baseCount, null),
    formatStatLine('Head routes:', summary.headCount, null),
    formatStatLine('Change rate:', `${(summary.changeRate * 100).toFixed(1)}%`, null),
  ];
  return lines.join('\n');
}

module.exports = {
  formatClassification,
  formatDiffSummaryBlock,
};
