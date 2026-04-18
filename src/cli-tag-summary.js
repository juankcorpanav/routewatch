const { loadSnapshot } = require('./snapshot');
const { buildTagSummary, formatTagSummary } = require('./tag-summary');

function printTagSummaryUsage() {
  console.log(`
Usage: routewatch tag-summary <snapshot-name>

Print a summary of routes grouped by tag for a given snapshot.

Arguments:
  snapshot-name   Name of the snapshot to summarize

Example:
  routewatch tag-summary production-2024-01-15
`);
}

async function handleTagSummary(args) {
  if (!args || args.length === 0 || args[0] === '--help') {
    printTagSummaryUsage();
    return;
  }

  const snapshotName = args[0];

  let snapshot;
  try {
    snapshot = await loadSnapshot(snapshotName);
  } catch (err) {
    console.error(`Error: could not load snapshot "${snapshotName}": ${err.message}`);
    process.exit(1);
  }

  const summary = buildTagSummary(snapshot);

  if (summary.length === 0) {
    console.log('No routes found in snapshot.');
    return;
  }

  console.log(formatTagSummary(summary));
  console.log(`\nTotal tags: ${summary.length}`);
  console.log(`Total routes: ${summary.reduce((sum, e) => sum + e.count, 0)}`);
}

module.exports = { printTagSummaryUsage, handleTagSummary };
