const { setBaseline, getBaseline, clearBaseline, hasBaseline } = require('./baseline');

function printBaselineUsage() {
  console.log('Usage: routewatch baseline <subcommand> [options]');
  console.log('');
  console.log('Subcommands:');
  console.log('  set <snapshot>   Set a snapshot as the baseline for comparisons');
  console.log('  get              Show the current baseline info');
  console.log('  clear            Remove the current baseline');
  console.log('');
}

function handleBaseline(args) {
  const [sub, snapshotName] = args;

  if (!sub || sub === '--help' || sub === '-h') {
    printBaselineUsage();
    return;
  }

  if (sub === 'set') {
    if (!snapshotName) {
      console.error('Error: snapshot name required for baseline set');
      process.exit(1);
    }
    try {
      setBaseline(snapshotName);
      console.log(`Baseline set to snapshot: ${snapshotName}`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  if (sub === 'get') {
    if (!hasBaseline()) {
      console.log('No baseline set.');
      return;
    }
    const baseline = getBaseline();
    console.log(`Baseline snapshot : ${baseline.name}`);
    console.log(`Set at            : ${baseline.setAt}`);
    const count = baseline.snapshot?.routes?.length ?? 0;
    console.log(`Routes            : ${count}`);
    return;
  }

  if (sub === 'clear') {
    clearBaseline();
    console.log('Baseline cleared.');
    return;
  }

  console.error(`Unknown subcommand: ${sub}`);
  printBaselineUsage();
  process.exit(1);
}

module.exports = { printBaselineUsage, handleBaseline };
