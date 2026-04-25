const fs = require('fs');
const path = require('path');

const META_DIR = path.join('.routewatch', 'meta');

function ensureMetaDir() {
  if (!fs.existsSync(META_DIR)) {
    fs.mkdirSync(META_DIR, { recursive: true });
  }
}

function metaFilePath(snapshotName) {
  return path.join(META_DIR, `${snapshotName}.meta.json`);
}

function loadMeta(snapshotName) {
  const filePath = metaFilePath(snapshotName);
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function saveMeta(snapshotName, meta) {
  ensureMetaDir();
  fs.writeFileSync(metaFilePath(snapshotName), JSON.stringify(meta, null, 2));
}

function setMetaField(snapshotName, key, value) {
  const meta = loadMeta(snapshotName);
  meta[key] = value;
  meta.updatedAt = new Date().toISOString();
  saveMeta(snapshotName, meta);
  return meta;
}

function getMetaField(snapshotName, key) {
  const meta = loadMeta(snapshotName);
  return meta[key];
}

function removeMetaField(snapshotName, key) {
  const meta = loadMeta(snapshotName);
  if (!(key in meta)) return null;
  delete meta[key];
  meta.updatedAt = new Date().toISOString();
  saveMeta(snapshotName, meta);
  return meta;
}

function clearMeta(snapshotName) {
  const filePath = metaFilePath(snapshotName);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

module.exports = {
  ensureMetaDir,
  metaFilePath,
  loadMeta,
  saveMeta,
  setMetaField,
  getMetaField,
  removeMetaField,
  clearMeta,
};
