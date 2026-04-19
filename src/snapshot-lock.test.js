const fs = require('fs');
const path = require('path');
const { lockSnapshot, unlockSnapshot, isLocked, getLock, listLocks } = require('./snapshot-lock');

const LOCK_DIR = path.join('.routewatch', 'locks');

function cleanup() {
  if (fs.existsSync(LOCK_DIR)) fs.rmSync(LOCK_DIR, { recursive: true });
}

beforeEach(cleanup);
afterAll(cleanup);

test('lockSnapshot creates a lock file', () => {
  const lock = lockSnapshot('v1', 'production freeze');
  expect(lock.snapshotName).toBe('v1');
  expect(lock.reason).toBe('production freeze');
  expect(lock.lockedAt).toBeDefined();
  expect(fs.existsSync(path.join(LOCK_DIR, 'v1.lock'))).toBe(true);
});

test('isLocked returns true when locked', () => {
  lockSnapshot('v2');
  expect(isLocked('v2')).toBe(true);
});

test('isLocked returns false when not locked', () => {
  expect(isLocked('nonexistent')).toBe(false);
});

test('getLock returns lock data', () => {
  lockSnapshot('v3', 'do not touch');
  const lock = getLock('v3');
  expect(lock.snapshotName).toBe('v3');
  expect(lock.reason).toBe('do not touch');
});

test('getLock returns null for unlocked snapshot', () => {
  expect(getLock('missing')).toBeNull();
});

test('unlockSnapshot removes lock file', () => {
  lockSnapshot('v4');
  const result = unlockSnapshot('v4');
  expect(result).toBe(true);
  expect(isLocked('v4')).toBe(false);
});

test('unlockSnapshot returns false if not locked', () => {
  expect(unlockSnapshot('ghost')).toBe(false);
});

test('listLocks returns all active locks', () => {
  lockSnapshot('a');
  lockSnapshot('b', 'reason b');
  const locks = listLocks();
  expect(locks.length).toBe(2);
  const names = locks.map(l => l.snapshotName);
  expect(names).toContain('a');
  expect(names).toContain('b');
});
