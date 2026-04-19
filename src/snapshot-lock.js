const fs = require('fs');
const path = require('path');

const LOCK_DIR = path.join('.routewatch', 'locks');

function ensureLockDir() {
  if (!fs.existsSync(LOCK_DIR)) fs.mkdirSync(LOCK_DIR, { recursive: true });
}

function lockFilePath(snapshotName) {
  return path.join(LOCK_DIR, `${snapshotName}.lock`);
}

function lockSnapshot(snapshotName, reason = '') {
  ensureLockDir();
  const lockFile = lockFilePath(snapshotName);
  const data = { snapshotName, reason, lockedAt: new Date().toISOString() };
  fs.writeFileSync(lockFile, JSON.stringify(data, null, 2));
  return data;
}

function unlockSnapshot(snapshotName) {
  const lockFile = lockFilePath(snapshotName);
  if (!fs.existsSync(lockFile)) return false;
  fs.unlinkSync(lockFile);
  return true;
}

function isLocked(snapshotName) {
  return fs.existsSync(lockFilePath(snapshotName));
}

function getLock(snapshotName) {
  const lockFile = lockFilePath(snapshotName);
  if (!fs.existsSync(lockFile)) return null;
  return JSON.parse(fs.readFileSync(lockFile, 'utf-8'));
}

function listLocks() {
  ensureLockDir();
  return fs.readdirSync(LOCK_DIR)
    .filter(f => f.endsWith('.lock'))
    .map(f => JSON.parse(fs.readFileSync(path.join(LOCK_DIR, f), 'utf-8')));
}

module.exports = { lockSnapshot, unlockSnapshot, isLocked, getLock, listLocks };
