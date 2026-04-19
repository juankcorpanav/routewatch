// notify.js — send alerts when route diffs exceed thresholds

const { buildStats } = require('./stats');

const DEFAULT_THRESHOLDS = {
  added: Infinity,
  removed: Infinity,
  changed: Infinity,
  total: Infinity,
};

function buildNotifyThresholds(config = {}) {
  return { ...DEFAULT_THRESHOLDS, ...config };
}

function checkThresholds(diff, thresholds) {
  const alerts = [];
  const added = diff.filter(d => d.type === 'added').length;
  const removed = diff.filter(d => d.type === 'removed').length;
  const changed = diff.filter(d => d.type === 'changed').length;
  const total = added + removed + changed;

  if (added > thresholds.added) alerts.push(`Added routes (${added}) exceeds threshold (${thresholds.added})`);
  if (removed > thresholds.removed) alerts.push(`Removed routes (${removed}) exceeds threshold (${thresholds.removed})`);
  if (changed > thresholds.changed) alerts.push(`Changed routes (${changed}) exceeds threshold (${thresholds.changed})`);
  if (total > thresholds.total) alerts.push(`Total changes (${total}) exceeds threshold (${thresholds.total})`);

  return alerts;
}

function formatNotifyAlerts(alerts, diff) {
  if (alerts.length === 0) return null;
  const lines = ['⚠️  RouteWatch Threshold Alerts:', ...alerts.map(a => `  • ${a}`)];
  return lines.join('\n');
}

function shouldNotify(diff, thresholds) {
  return checkThresholds(diff, thresholds).length > 0;
}

module.exports = { buildNotifyThresholds, checkThresholds, formatNotifyAlerts, shouldNotify };
