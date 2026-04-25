const { c } = require('./format');

function formatPruneList(names) {
  if (!names.length) return c('  No snapshots selected for pruning.', 'dim');
  return names.map((n) => `  ${c('–', 'yellow')} ${n}`).join('\n');
}

function formatPruneDryRun(names) {
  if (!names.length) return c('Dry run: nothing to prune.', 'dim');
  const lines = [
    c(`Dry run — would prune ${names.length} snapshot(s):`, 'yellow'),
    formatPruneList(names),
  ];
  return lines.join('\n');
}

function formatPruneSuccess(names) {
  if (!names.length) return c('Nothing to prune.', 'dim');
  const lines = [
    c(`Pruned ${names.length} snapshot(s):`, 'green'),
    formatPruneList(names),
  ];
  return lines.join('\n');
}

function formatPruneError(name, err) {
  return c(`Error pruning "${name}": ${err.message}`, 'red');
}

module.exports = {
  formatPruneList,
  formatPruneDryRun,
  formatPruneSuccess,
  formatPruneError,
};
