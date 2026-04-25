const { diffSnapshots } = require('./diff');

/**
 * Build a high-level numeric summary from a diff result.
 * @param {object} diff - Result of diffSnapshots()
 * @returns {object} summary counts
 */
function buildDiffSummary(diff) {
  return {
    added: diff.added.length,
    removed: diff.removed.length,
    changed: diff.changed.length,
    total: diff.added.length + diff.removed.length + diff.changed.length,
  };
}

/**
 * Compute a percentage-based change rate relative to the base snapshot size.
 * @param {object} summary - from buildDiffSummary()
 * @param {number} baseCount - number of routes in the base snapshot
 * @returns {number} change rate as a value between 0 and 1
 */
function computeChangeRate(summary, baseCount) {
  if (!baseCount || baseCount === 0) return 0;
  return summary.total / baseCount;
}

/**
 * Classify the diff as 'stable', 'minor', 'moderate', or 'breaking'.
 * @param {object} summary - from buildDiffSummary()
 * @param {number} baseCount
 * @returns {string} classification label
 */
function classifyDiff(summary, baseCount) {
  const rate = computeChangeRate(summary, baseCount);
  if (summary.removed > 0 || rate > 0.3) return 'breaking';
  if (rate > 0.1) return 'moderate';
  if (rate > 0) return 'minor';
  return 'stable';
}

/**
 * Build a full diff summary object combining counts, rate, and classification.
 * @param {Array} baseRoutes
 * @param {Array} headRoutes
 * @returns {object}
 */
function buildFullDiffSummary(baseRoutes, headRoutes) {
  const diff = diffSnapshots(baseRoutes, headRoutes);
  const summary = buildDiffSummary(diff);
  const rate = computeChangeRate(summary, baseRoutes.length);
  const classification = classifyDiff(summary, baseRoutes.length);
  return {
    ...summary,
    baseCount: baseRoutes.length,
    headCount: headRoutes.length,
    changeRate: parseFloat(rate.toFixed(4)),
    classification,
  };
}

module.exports = {
  buildDiffSummary,
  computeChangeRate,
  classifyDiff,
  buildFullDiffSummary,
};
