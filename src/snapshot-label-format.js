const { c } = require('./format');

function formatLabelList(snapshotName, labels) {
  if (!labels || labels.length === 0) {
    return c(`No labels for snapshot "${snapshotName}".`, 'yellow');
  }
  const header = c(`Labels for "${snapshotName}":`, 'cyan');
  const items = labels.map(l => `  ${c('•', 'blue')} ${l}`).join('\n');
  return `${header}\n${items}`;
}

function formatLabelAdded(snapshotName, label) {
  return c(`Label "${label}" added to snapshot "${snapshotName}".`, 'green');
}

function formatLabelRemoved(snapshotName, label) {
  return c(`Label "${label}" removed from snapshot "${snapshotName}".`, 'yellow');
}

function formatLabelNotFound(snapshotName, label) {
  return c(`Label "${label}" not found on snapshot "${snapshotName}".`, 'red');
}

function formatLabelCleared(snapshotName) {
  return c(`All labels cleared from snapshot "${snapshotName}".`, 'yellow');
}

function formatSnapshotsByLabel(label, snapshots) {
  if (!snapshots || snapshots.length === 0) {
    return c(`No snapshots found with label "${label}".`, 'yellow');
  }
  const header = c(`Snapshots with label "${label}":`, 'cyan');
  const items = snapshots.map(s => `  ${c('•', 'blue')} ${s}`).join('\n');
  return `${header}\n${items}`;
}

module.exports = {
  formatLabelList,
  formatLabelAdded,
  formatLabelRemoved,
  formatLabelNotFound,
  formatLabelCleared,
  formatSnapshotsByLabel
};
