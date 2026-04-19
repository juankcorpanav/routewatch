const fs = require('fs');
const path = require('path');
const { loadSnapshot, listSnapshots } = require('./snapshot');

const ARCHIVE_DIR = path.join('.routewatch', 'archive');

function ensureArchiveDir() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }
}

function archiveSnapshot(name) {
  ensureArchiveDir();
  const snapshot = loadSnapshot(name);
  if (!snapshot) throw new Error(`Snapshot not found: ${name}`);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const archiveName = `${name}__${timestamp}.json`;
  const archivePath = path.join(ARCHIVE_DIR, archiveName);
  fs.writeFileSync(archivePath, JSON.stringify(snapshot, null, 2));
  return archiveName;
}

function listArchives() {
  ensureArchiveDir();
  return fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function loadArchive(archiveName) {
  const archivePath = path.join(ARCHIVE_DIR, `${archiveName}.json`);
  if (!fs.existsSync(archivePath)) return null;
  return JSON.parse(fs.readFileSync(archivePath, 'utf8'));
}

function deleteArchive(archiveName) {
  const archivePath = path.join(ARCHIVE_DIR, `${archiveName}.json`);
  if (!fs.existsSync(archivePath)) return false;
  fs.unlinkSync(archivePath);
  return true;
}

function archiveAll() {
  const names = listSnapshots();
  return names.map(name => ({ name, archive: archiveSnapshot(name) }));
}

module.exports = { ensureArchiveDir, archiveSnapshot, listArchives, loadArchive, deleteArchive, archiveAll, ARCHIVE_DIR };
