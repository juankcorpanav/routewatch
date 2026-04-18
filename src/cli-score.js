// CLI handler for the `score` command — prints snapshot health score

const { loadSnapshot } = require('./snapshot');
const { buildScore, formatScore } = require('./score');
const { assertValidSnapshot } = require('./validate');

function printScoreUsage() {
  console.log(`
Usage: routewatch score <snapshot-name>

Prints a health score (0-100) for the given snapshot based on:
  - Lint issues (missing tags, descriptions, duplicate routes)
  - Percentage of deprecated routes

Options:
  --json    Output raw score data as JSON
`.trim());
}

async function handleScore(args) {
  const flags = args.filter((a) => a.startsWith('--'));
  const positional = args.filter((a) => !a.startsWith('--'));

  if (!positional.length) {
    printScoreUsage();
    process.exit(1);
  }

  const name = positional[0];
  const jsonMode = flags.includes('--json');

  let snapshot;
  try {
    snapshot = await loadSnapshot(name);
  } catch (err) {
    console.error(`Error loading snapshot "${name}": ${err.message}`);
    process.exit(1);
  }

  try {
    assertValidSnapshot(snapshot);
  } catch (err) {
    console.error(`Invalid snapshot: ${err.message}`);
    process.exit(1);
  }

  const scoreData = buildScore(snapshot);

  if (jsonMode) {
    console.log(JSON.stringify(scoreData, null, 2));
  } else {
    console.log(formatScore(scoreData));
  }
}

module.exports = { printScoreUsage, handleScore };
