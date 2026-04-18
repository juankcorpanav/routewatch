// Computes a health score for a snapshot based on lint, stats, and validation

const { lintSnapshot } = require('./lint');
const { buildStats } = require('./stats');

function computeLintPenalty(lintResults) {
  const { missingTags = [], missingDescriptions = [], duplicates = [] } = lintResults;
  return missingTags.length * 3 + missingDescriptions.length * 2 + duplicates.length * 5;
}

function computeDeprecatedPenalty(stats) {
  const total = stats.totalRoutes || 1;
  const ratio = (stats.deprecated || 0) / total;
  return Math.round(ratio * 20);
}

function buildScore(snapshot) {
  const lintResults = lintSnapshot(snapshot);
  const stats = buildStats(snapshot);

  const lintPenalty = computeLintPenalty(lintResults);
  const deprecatedPenalty = computeDeprecatedPenalty(stats);
  const totalPenalty = lintPenalty + deprecatedPenalty;

  const raw = Math.max(0, 100 - totalPenalty);
  const grade =
    raw >= 90 ? 'A' :
    raw >= 75 ? 'B' :
    raw >= 60 ? 'C' :
    raw >= 40 ? 'D' : 'F';

  return { score: raw, grade, lintPenalty, deprecatedPenalty, stats, lintResults };
}

function formatScore({ score, grade, lintPenalty, deprecatedPenalty, stats }) {
  const lines = [
    `Health Score: ${score}/100 (${grade})`,
    `  Total routes : ${stats.totalRoutes}`,
    `  Deprecated   : ${stats.deprecated}`,
    `  Lint penalty : -${lintPenalty}`,
    `  Deprecated % : -${deprecatedPenalty}`,
  ];
  return lines.join('\n');
}

module.exports = { buildScore, formatScore, computeLintPenalty, computeDeprecatedPenalty };
