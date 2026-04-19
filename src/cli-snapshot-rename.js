const { renameSnapshot, copySnapshot, deleteSnapshot } = require('./snapshot-rename');
const { formatRenamed, formatCopied, formatDeleted, formatSnapshotError } = require('./snapshot-rename-format');

function printSnapshotRenameUsage() {
  console.log('Usage:');
  console.log('  routewatch snapshot rename <old> <new>   Rename a snapshot');
  console.log('  routewatch snapshot copy <src> <dest>    Copy a snapshot');
  console.log('  routewatch snapshot delete <name>        Delete a snapshot');
}

function handleSnapshotRename(args) {
  const [sub, ...rest] = args;

  if (!sub || sub === '--help' || sub === '-h') {
    printSnapshotRenameUsage();
    return;
  }

  if (sub === 'rename') {
    const [oldName, newName] = rest;
    if (!oldName || !newName) {
      console.error(formatSnapshotError('rename requires <old> and <new> arguments'));
      process.exit(1);
    }
    const result = renameSnapshot(oldName, newName);
    if (!result.ok) {
      console.error(formatSnapshotError(result.error));
      process.exit(1);
    }
    console.log(formatRenamed(oldName, newName));
    return;
  }

  if (sub === 'copy') {
    const [srcName, destName] = rest;
    if (!srcName || !destName) {
      console.error(formatSnapshotError('copy requires <src> and <dest> arguments'));
      process.exit(1);
    }
    const result = copySnapshot(srcName, destName);
    if (!result.ok) {
      console.error(formatSnapshotError(result.error));
      process.exit(1);
    }
    console.log(formatCopied(srcName, destName));
    return;
  }

  if (sub === 'delete') {
    const [name] = rest;
    if (!name) {
      console.error(formatSnapshotError('delete requires <name> argument'));
      process.exit(1);
    }
    const result = deleteSnapshot(name);
    if (!result.ok) {
      console.error(formatSnapshotError(result.error));
      process.exit(1);
    }
    console.log(formatDeleted(name));
    return;
  }

  console.error(formatSnapshotError(`Unknown subcommand: ${sub}`));
  printSnapshotRenameUsage();
  process.exit(1);
}

module.exports = { printSnapshotRenameUsage, handleSnapshotRename };
