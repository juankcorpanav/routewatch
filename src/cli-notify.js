// cli-notify.js — CLI handler for routewatch notify threshold checks

const { loadSnapshot } = require('./snapshot');
const { diffSnapshots } = require('./diff');
const { buildNotifyThresholds, checkThresholds, formatNotifyAlerts } = require('./notify');

function printNotifyUsage() {
  console.log('Usage: routewatch notify <snapshot1> <snapshot2> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --added <n>    Alert if added routes exceed n');
  console.log('  --removed <n>  Alert if removed routes exceed n');
  console.log('  --changed <n>  Alert if changed routes exceed n');
  console.log('  --total <n>    Alert if total changes exceed n');
}

function parseNotifyArgs(args) {
  const [snap1, snap2, ...rest] = args;
  const config = {};
  for (let i = 0; i < rest.length; i++) {
    const flag = rest[i];
    const val = parseInt(rest[i + 1], 10);
    if (flag === '--added' && !isNaN(val)) { config.added = val; i++; }
    else if (flag === '--removed' && !isNaN(val)) { config.removed = val; i++; }
    else if (flag === '--changed' && !isNaN(val)) { config.changed = val; i++; }
    else if (flag === '--total' && !isNaN(val)) { config.total = val; i++; }
  }
  return { snap1, snap2, config };
}

async function handleNotify(args) {
  if (!args || args.length < 2) {
    printNotifyUsage();
    return;
  }

  const { snap1, snap2, config } = parseNotifyArgs(args);

  const a = await loadSnapshot(snap1);
  const b = await loadSnapshot(snap2);

  if (!a || !b) {
    console.error('Could not load one or both snapshots.');
    process.exit(1);
  }

  const diff = diffSnapshots(a, b);
  const thresholds = buildNotifyThresholds(config);
  const alerts = checkThresholds(diff, thresholds);
  const output = formatNotifyAlerts(alerts, diff);

  if (output) {
    console.log(output);
    process.exit(1);
  } else {
    console.log('✅ All route change thresholds are within limits.');
  }
}

module.exports = { printNotifyUsage, parseNotifyArgs, handleNotify };
