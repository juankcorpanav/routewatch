const { c } = require('./format');

function formatGroupList(groups) {
  const names = Object.keys(groups);
  if (names.length === 0) return c('dim', 'No groups defined.');
  return names.map(name => {
    const members = groups[name];
    return `${c('cyan', name)} (${members.length})\n` +
      members.map(s => `  ${c('dim', '-')} ${s}`).join('\n');
  }).join('\n');
}

function formatGroupAdded(groupName, snapshotName) {
  return `${c('green', '+')} Added ${c('yellow', snapshotName)} to group ${c('cyan', groupName)}.`;
}

function formatGroupRemoved(groupName, snapshotName) {
  return `${c('red', '-')} Removed ${c('yellow', snapshotName)} from group ${c('cyan', groupName)}.`;
}

function formatGroupDeleted(groupName) {
  return `${c('red', 'Deleted')} group ${c('cyan', groupName)}.`;
}

function formatGroupNotFound(groupName) {
  return c('red', `Group "${groupName}" not found.`);
}

function formatGroupMembers(groupName, members) {
  if (!members || members.length === 0) return c('dim', `Group "${groupName}" is empty.`);
  return `Group ${c('cyan', groupName)}:\n` +
    members.map(s => `  ${c('dim', '-')} ${s}`).join('\n');
}

module.exports = { formatGroupList, formatGroupAdded, formatGroupRemoved, formatGroupDeleted, formatGroupNotFound, formatGroupMembers };
