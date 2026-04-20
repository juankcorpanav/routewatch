const { addSnapshotToGroup, removeSnapshotFromGroup, getGroup, listGroups, deleteGroup } = require('./snapshot-group');
const { formatGroupList, formatGroupAdded, formatGroupRemoved, formatGroupDeleted, formatGroupNotFound, formatGroupMembers } = require('./snapshot-group-format');

function printGroupUsage() {
  console.log([
    'Usage: routewatch group <subcommand> [args]',
    '',
    'Subcommands:',
    '  add <group> <snapshot>    Add snapshot to group',
    '  remove <group> <snapshot> Remove snapshot from group',
    '  list [group]              List all groups or members of a group',
    '  delete <group>            Delete a group',
  ].join('\n'));
}

function handleGroup(args) {
  const [sub, ...rest] = args;

  if (!sub || sub === '--help') {
    printGroupUsage();
    return;
  }

  if (sub === 'add') {
    const [groupName, snapshotName] = rest;
    if (!groupName || !snapshotName) {
      console.error('Usage: routewatch group add <group> <snapshot>');
      process.exit(1);
    }
    addSnapshotToGroup(groupName, snapshotName);
    console.log(formatGroupAdded(groupName, snapshotName));
    return;
  }

  if (sub === 'remove') {
    const [groupName, snapshotName] = rest;
    if (!groupName || !snapshotName) {
      console.error('Usage: routewatch group remove <group> <snapshot>');
      process.exit(1);
    }
    const result = removeSnapshotFromGroup(groupName, snapshotName);
    if (result === null) {
      console.log(formatGroupNotFound(groupName));
    } else {
      console.log(formatGroupRemoved(groupName, snapshotName));
    }
    return;
  }

  if (sub === 'list') {
    const [groupName] = rest;
    if (groupName) {
      const members = getGroup(groupName);
      if (!members) {
        console.log(formatGroupNotFound(groupName));
      } else {
        console.log(formatGroupMembers(groupName, members));
      }
    } else {
      const groups = listGroups();
      console.log(formatGroupList(groups));
    }
    return;
  }

  if (sub === 'delete') {
    const [groupName] = rest;
    if (!groupName) {
      console.error('Usage: routewatch group delete <group>');
      process.exit(1);
    }
    const ok = deleteGroup(groupName);
    if (!ok) {
      console.log(formatGroupNotFound(groupName));
    } else {
      console.log(formatGroupDeleted(groupName));
    }
    return;
  }

  console.error(`Unknown subcommand: ${sub}`);
  printGroupUsage();
  process.exit(1);
}

module.exports = { printGroupUsage, handleGroup };
