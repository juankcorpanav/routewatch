const { c } = require('./format');

function formatTagList(snapshot, tags) {
  if (!tags || tags.length === 0) {
    return c(`No tags for snapshot '${snapshot}'.`, 'yellow');
  }
  const tagList = tags.map(t => c(t, 'cyan')).join(', ');
  return `Tags for ${c(snapshot, 'bold')}: ${tagList}`;
}

function formatTagAdded(snapshot, tag) {
  return c(`Tag '${tag}' added to snapshot '${snapshot}'.`, 'green');
}

function formatTagRemoved(snapshot, tag) {
  return c(`Tag '${tag}' removed from snapshot '${snapshot}'.`, 'yellow');
}

function formatTagNotFound(snapshot, tag) {
  return c(`Tag '${tag}' not found on snapshot '${snapshot}'.`, 'red');
}

function formatSnapshotsByTag(tag, snapshots) {
  if (!snapshots || snapshots.length === 0) {
    return c(`No snapshots found with tag '${tag}'.`, 'yellow');
  }
  const lines = [`Snapshots tagged ${c(tag, 'cyan')}:`];
  for (const s of snapshots) {
    lines.push(`  - ${c(s, 'bold')}`);
  }
  return lines.join('\n');
}

module.exports = {
  formatTagList,
  formatTagAdded,
  formatTagRemoved,
  formatTagNotFound,
  formatSnapshotsByTag,
};
