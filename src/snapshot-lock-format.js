const { c } = require('./format');

function formatLocked(lock) {
  const reason = lock.reason ? ` — ${lock.reason}` : '';
  return `${c('🔒 Locked:', 'yellow')} ${c(lock.snapshotName, 'cyan')}${reason} (${lock.lockedAt})`;
}

function formatUnlocked(snapshotName) {
  return `${c('🔓 Unlocked:', 'green')} ${c(snapshotName, 'cyan')}`;
}

function formatLockNotFound(snapshotName) {
  return `${c('✗', 'red')} No lock found for ${c(snapshotName, 'cyan')}`;
}

function formatLockList(locks) {
  if (!locks.length) return c('No snapshots are currently locked.', 'dim');
  const lines = locks.map(l => {
    const reason = l.reason ? ` — ${l.reason}` : '';
    return `  ${c('🔒', 'yellow')} ${c(l.snapshotName, 'cyan')}${reason}`;
  });
  return [`${c('Locked snapshots:', 'bold')}`, ...lines].join('\n');
}

function formatLockStatus(snapshotName, locked) {
  return locked
    ? `${c(snapshotName, 'cyan')} is ${c('locked', 'yellow')}`
    : `${c(snapshotName, 'cyan')} is ${c('unlocked', 'green')}`;
}

module.exports = { formatLocked, formatUnlocked, formatLockNotFound, formatLockList, formatLockStatus };
