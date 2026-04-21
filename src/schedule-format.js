const { c } = require('./format');

function formatScheduleList(schedules) {
  if (!schedules.length) return c('dim', 'No schedules defined.');
  const lines = [c('bold', 'Schedules:')];
  for (const s of schedules) {
    lines.push(`  ${c('cyan', s.name)}  every ${c('yellow', s.interval)}  → snapshot: ${c('green', s.snapshotName)}`);
  }
  return lines.join('\n');
}

function formatScheduleAdded(entry) {
  return `${c('green', '✔')} Schedule ${c('cyan', entry.name)} set to run every ${c('yellow', entry.interval)} on snapshot ${c('green', entry.snapshotName)}.`;
}

function formatScheduleRemoved(name) {
  return `${c('red', '✖')} Schedule ${c('cyan', name)} removed.`;
}

function formatScheduleNotFound(name) {
  return `${c('red', 'Error:')} Schedule ${c('cyan', name)} not found.`;
}

/**
 * Formats a message for when a schedule is triggered/executed.
 * @param {object} entry - The schedule entry that was triggered.
 * @param {string} entry.name - The schedule name.
 * @param {string} entry.snapshotName - The snapshot the schedule targets.
 * @returns {string} Formatted trigger message.
 */
function formatScheduleTriggered(entry) {
  return `${c('yellow', '⏱')} Schedule ${c('cyan', entry.name)} triggered snapshot ${c('green', entry.snapshotName)}.`;
}

module.exports = { formatScheduleList, formatScheduleAdded, formatScheduleRemoved, formatScheduleNotFound, formatScheduleTriggered };
