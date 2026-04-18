const { loadSnapshot } = require('./snapshot');
 const { lintSnapshot, formatLintResults } = require('./lint');

function printLintUsage() {
  console.log('Usage: routewatch lint <snapshot>');
  console.log('');
  console.log('Check a snapshot for common route issues.');
  console.log('');
  console.log('Options:');
  console.log('  --strict   Exit with code 1 if any issues found');
}

async function handleLint(args) {
  if (!args || args.length === 0 || args[0] === '--help') {
    printLintUsage();
    return;
  }

  const strict = args.includes('--strict');
  const snapshotName = args.find(a => !a.startsWith('--'));

  if (!snapshotName) {
    console.error('Error: snapshot name required.');
    process.exit(1);
  }

  let snapshot;
  try {
    snapshot = await loadSnapshot(snapshotName);
  } catch (e) {
    console.error(`Error loading snapshot "${snapshotName}": ${e.message}`);
    process.exit(1);
  }

  const results = lintSnapshot(snapshot);
  console.log(`Lint results for "${snapshotName}":`);
  console.log(formatLintResults(results));

  if (strict && results.length > 0) {
    process.exit(1);
  }
}

module.exports = { printLintUsage, handleLint };
