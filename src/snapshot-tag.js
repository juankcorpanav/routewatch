const { loadSnapshot, saveSnapshot } = require('./snapshot');

function getTagsForSnapshot(snapshot) {
  return snapshot.tags || [];
}

function addTagToSnapshot(snapshot, tag) {
  const tags = new Set(getTagsForSnapshot(snapshot));
  tags.add(tag);
  return { ...snapshot, tags: Array.from(tags) };
}

function removeTagFromSnapshot(snapshot, tag) {
  const tags = getTagsForSnapshot(snapshot).filter(t => t !== tag);
  return { ...snapshot, tags };
}

function hasTag(snapshot, tag) {
  return getTagsForSnapshot(snapshot).includes(tag);
}

function filterSnapshotsByTag(snapshots, tag) {
  return snapshots.filter(s => hasTag(s, tag));
}

async function tagSnapshot(name, tag) {
  const snapshot = await loadSnapshot(name);
  if (!snapshot) throw new Error(`Snapshot not found: ${name}`);
  const updated = addTagToSnapshot(snapshot, tag);
  await saveSnapshot(name, updated);
  return updated;
}

async function untagSnapshot(name, tag) {
  const snapshot = await loadSnapshot(name);
  if (!snapshot) throw new Error(`Snapshot not found: ${name}`);
  const updated = removeTagFromSnapshot(snapshot, tag);
  await saveSnapshot(name, updated);
  return updated;
}

module.exports = {
  getTagsForSnapshot,
  addTagToSnapshot,
  removeTagFromSnapshot,
  hasTag,
  filterSnapshotsByTag,
  tagSnapshot,
  untagSnapshot,
};
