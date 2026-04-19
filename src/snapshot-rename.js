const { loadSnapshot, saveSnapshot, listSnapshots } = require('./snapshot');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(process.cwd(), '.routewatch', 'snapshots');

function snapshotExists(name) {
  const names = listSnapshots();
  return names.includes(name);
}

function renameSnapshot(oldName, newName) {
  if (!snapshotExists(oldName)) {
    return { ok: false, error: `Snapshot '${oldName}' not found` };
  }
  if (snapshotExists(newName)) {
    return { ok: false, error: `Snapshot '${newName}' already exists` };
  }
  const data = loadSnapshot(oldName);
  saveSnapshot(newName, data.routes);
  const oldPath = path.join(SNAPSHOT_DIR, `${oldName}.json`);
  fs.unlinkSync(oldPath);
  return { ok: true, oldName, newName };
}

function copySnapshot(srcName, destName) {
  if (!snapshotExists(srcName)) {
    return { ok: false, error: `Snapshot '${srcName}' not found` };
  }
  if (snapshotExists(destName)) {
    return { ok: false, error: `Snapshot '${destName}' already exists` };
  }
  const data = loadSnapshot(srcName);
  saveSnapshot(destName, data.routes);
  return { ok: true, srcName, destName };
}

function deleteSnapshot(name) {
  if (!snapshotExists(name)) {
    return { ok: false, error: `Snapshot '${name}' not found` };
  }
  const filePath = path.join(SNAPSHOT_DIR, `${name}.json`);
  fs.unlinkSync(filePath);
  return { ok: true, name };
}

module.exports = { snapshotExists, renameSnapshot, copySnapshot, deleteSnapshot };
