const { c } = require('./format');

function formatRenamed(oldName, newName) {
  return `${c('Renamed', 'cyan')} snapshot ${c(oldName, 'yellow')} → ${c(newName, 'green')}`;
}

function formatCopied(srcName, destName) {
  return `${c('Copied', 'cyan')} snapshot ${c(srcName, 'yellow')} → ${c(destName, 'green')}`;
}

function formatDeleted(name) {
  return `${c('Deleted', 'red')} snapshot ${c(name, 'yellow')}`;
}

function formatSnapshotError(error) {
  return `${c('Error:', 'red')} ${error}`;
}

module.exports = { formatRenamed, formatCopied, formatDeleted, formatSnapshotError };
