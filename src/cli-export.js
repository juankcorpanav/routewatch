const fs = require('fs');
const path = require('path');
const { loadSnapshot } = require('./snapshot');
const { diffSnapshots } = require('./diff');
const { exportDiff } = require('./export');

function printExportUsage() {
  console.log('Usage: routewatch export <snapshot-a> <snapshot-b> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --format <json|csv|markdown>   Output format (default: json)');
  console.log('  --out <file>                   Write output to file instead of stdout');
  console.log('');
}

function parseExportArgs(args) {
  const opts = { format: 'json', out: null, snapshotA: null, snapshotB: null };
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--format' && args[i + 1]) {
      opts.format = args[++i];
    } else if (args[i] === '--out' && args[i + 1]) {
      opts.out = args[++i];
    } else if (!args[i].startsWith('--')) {
      positional.push(args[i]);
    }
  }

  opts.snapshotA = positional[0] || null;
  opts.snapshotB = positional[1] || null;
  return opts;
}

async function handleExport(args) {
  const opts = parseExportArgs(args);

  if (!opts.snapshotA || !opts.snapshotB) {
    printExportUsage();
    process.exit(1);
  }

  let snapA, snapB;
  try {
    snapA = await loadSnapshot(opts.snapshotA);
    snapB = await loadSnapshot(opts.snapshotB);
  } catch (err) {
    console.error(`Error loading snapshots: ${err.message}`);
    process.exit(1);
  }

  const diff = diffSnapshots(snapA, snapB);
  const output = exportDiff(diff, opts.format);

  if (opts.out) {
    fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true });
    fs.writeFileSync(opts.out, output, 'utf8');
    console.log(`Exported diff to ${opts.out}`);
  } else {
    console.log(output);
  }
}

module.exports = { handleExport, parseExportArgs, printExportUsage };
