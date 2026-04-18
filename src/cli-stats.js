const { loadSnapshot } = require('./snapshot');
const { buildStats, formatStats } = require('./stats');

function printStatsUsage() {
  console.log('Usage: routewatch stats <snapshot-name>');
  console.log('');
  console.log('Display statistics for a saved snapshot.');
  console.log('');
  console.log('Arguments:');
  console.log('  snapshot-name   Name of the snapshot to analyse');
  console.log('');
  console.log('Example:');
  console.log('  routewatch stats production-2024-01-15');
}

async function handleStats(args) {
  if (!args || args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printStatsUsage();
    return;
  }

  const name = args[0];

  let snapshot;
  try {
    snapshot = await loadSnapshot(name);
  } catch (err) {
    console.error(`Error: could not load snapshot "${name}": ${err.message}`);
    process.exit(1);
  }

  const stats = buildStats(snapshot);
  console.log(`\nSnapshot: ${name}`);
  console.log('─'.repeat(40));
  console.log(formatStats(stats));
}

module.exports = { printStatsUsage, handleStats };
