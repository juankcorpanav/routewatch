const { pinSnapshot, unpinSnapshot, listPins } = require('./snapshot-pin');
const { formatPinned, formatUnpinned, formatPinNotFound, formatPinList } = require('./snapshot-pin-format');

function printPinUsage() {
  console.log(`
Usage: routewatch pin <command> [options]

Commands:
  add <snapshot> [--label <label>]   Pin a snapshot
  remove <snapshot>                  Unpin a snapshot
  list                               List all pinned snapshots

Examples:
  routewatch pin add v1.0 --label "Stable release"
  routewatch pin remove v1.0
  routewatch pin list
`);
}

function handlePin(args) {
  const [cmd, name, ...rest] = args;

  if (!cmd || cmd === '--help' || cmd === '-h') {
    printPinUsage();
    return;
  }

  if (cmd === 'list') {
    const pins = listPins();
    console.log(formatPinList(pins));
    return;
  }

  if (cmd === 'add') {
    if (!name) {
      console.error('Error: snapshot name required.');
      process.exit(1);
    }
    let label = null;
    const labelIdx = rest.indexOf('--label');
    if (labelIdx !== -1 && rest[labelIdx + 1]) {
      label = rest[labelIdx + 1];
    }
    const pin = pinSnapshot(name, label);
    console.log(formatPinned(pin));
    return;
  }

  if (cmd === 'remove') {
    if (!name) {
      console.error('Error: snapshot name required.');
      process.exit(1);
    }
    const removed = unpinSnapshot(name);
    if (removed) {
      console.log(formatUnpinned(name));
    } else {
      console.log(formatPinNotFound(name));
    }
    return;
  }

  console.error(`Unknown pin command: ${cmd}`);
  printPinUsage();
  process.exit(1);
}

module.exports = { printPinUsage, handlePin };
