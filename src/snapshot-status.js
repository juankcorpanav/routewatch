const { isLocked } = require('./snapshot-lock');
const { isPinned } = require('./snapshot-pin');
const { getBaseline } = require('./baseline');
const { getTagsForSnapshot } = require('./snapshot-tag');
const { loadNotes } = require('./snapshot-note');

/**
 * Build a status object for a given snapshot name.
 * Aggregates lock, pin, baseline, tags, and notes info.
 */
function buildSnapshotStatus(name) {
  const locked = isLocked(name);
  const pinned = isPinned(name);
  const baseline = getBaseline();
  const isBaseline = baseline === name;
  const tags = getTagsForSnapshot(name);
  const notes = loadNotes(name);

  return {
    name,
    locked,
    pinned,
    isBaseline,
    tags,
    noteCount: notes.length,
  };
}

/**
 * Format a snapshot status object for display.
 */
function formatSnapshotStatus(status) {
  const lines = [];
  lines.push(`Snapshot: ${status.name}`);
  lines.push(`  Locked:   ${status.locked ? 'yes' : 'no'}`);
  lines.push(`  Pinned:   ${status.pinned ? 'yes' : 'no'}`);
  lines.push(`  Baseline: ${status.isBaseline ? 'yes' : 'no'}`);
  lines.push(
    `  Tags:     ${
      status.tags.length > 0 ? status.tags.join(', ') : '(none)'
    }`
  );
  lines.push(`  Notes:    ${status.noteCount}`);
  return lines.join('\n');
}

module.exports = { buildSnapshotStatus, formatSnapshotStatus };
