const { compareSnapshots, compareSummary } = require('./snapshot-compare');
const { formatDiffSummary } = require('./format');
const { formatCompareResult, formatCompareEmpty } = require('./snapshot-compare-format');
const { parseFlags } = require('./cli');

function printCompareUsage() {
  console.log('Usage: routewatch compare <snapshotA> <snapshotB> [--method=GET] [--prefix=/api] [--tag=users]');
  console.log('');
  console.log('Options:');
  console.log('  --method=METHOD   Filter by HTTP method');
  console.log('  --prefix=PREFIX   Filter by path prefix');
  console.log('  --tag=TAG         Filter by tag');
  console.log('  --verbose         Show full diff details');
}

function handleCompare(args) {
  const [nameA, nameB, ...rest] = args;
  if (!nameA || !nameB) {
    printCompareUsage();
    process.exit(1);
  }

  const flags = {};
  rest.forEach(arg => {
    const m = arg.match(/^--(\w+)=(.+)$/);
    if (m) flags[m[1]] = m[2];
    if (arg === '--verbose') flags.verbose = true;
  });

  const filters = {};
  if (flags.method) filters.method = flags.method;
  if (flags.prefix) filters.prefix = flags.prefix;
  if (flags.tag) filters.tag = flags.tag;

  try {
    const result = compareSnapshots(nameA, nameB, filters);
    const summary = compareSummary(result);
    if (summary.total === 0) {
      console.log(formatCompareEmpty());
    } else {
      console.log(formatCompareResult(result, summary));
      if (flags.verbose) {
        console.log(formatDiffSummary(result.diff));
      }
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { printCompareUsage, handleCompare };
