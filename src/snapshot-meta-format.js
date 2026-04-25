const { c } = require('./format');

function formatMetaList(snapshotName, meta) {
  const keys = Object.keys(meta).filter(k => k !== 'updatedAt');
  if (keys.length === 0) {
    return c('dim', `No metadata for snapshot "${snapshotName}".`);
  }
  const lines = [c('bold', `Metadata for "${snapshotName}":`)]
  for (const key of keys) {
    lines.push(`  ${c('cyan', key)}: ${meta[key]}`);
  }
  if (meta.updatedAt) {
    lines.push(c('dim', `  Last updated: ${meta.updatedAt}`));
  }
  return lines.join('\n');
}

function formatMetaSet(snapshotName, key, value) {
  return `${c('green', '✔')} Set ${c('cyan', key)} = ${c('yellow', String(value))} on "${snapshotName}".`;
}

function formatMetaRemoved(snapshotName, key) {
  return `${c('yellow', '–')} Removed ${c('cyan', key)} from "${snapshotName}".`;
}

function formatMetaNotFound(snapshotName, key) {
  return c('red', `Field "${key}" not found on snapshot "${snapshotName}".`);
}

function formatMetaCleared(snapshotName) {
  return c('yellow', `All metadata cleared for "${snapshotName}".`);
}

module.exports = {
  formatMetaList,
  formatMetaSet,
  formatMetaRemoved,
  formatMetaNotFound,
  formatMetaCleared,
};
