const { loadHistory, clearHistory, getRecentHistory } = require('./history');
const { formatHistoryList, formatHistoryCleared } = require('./history-format');

function printHistoryUsage() {
  console.log(`
Usage: routewatch history <subcommand> [options]

Subcommands:
  list [--limit <n>]   Show recent command history (default: 20)
  clear                Clear all command history

Examples:
  routewatch history list
  routewatch history list --limit 5
  routewatch history clear
`);
}

function parseHistoryArgs(argv) {
  const [sub, ...rest] = argv;
  const opts = { limit: 20 };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--limit' && rest[i + 1]) {
      opts.limit = parseInt(rest[i + 1], 10) || 20;
      i++;
    }
  }
  return { sub, opts };
}

function handleHistory(argv) {
  if (!argv.length || argv[0] === '--help' || argv[0] === '-h') {
    printHistoryUsage();
    return;
  }

  const { sub, opts } = parseHistoryArgs(argv);

  if (sub === 'list') {
    const entries = getRecentHistory(opts.limit);
    console.log(formatHistoryList(entries));
    return;
  }

  if (sub === 'clear') {
    clearHistory();
    console.log(formatHistoryCleared());
    return;
  }

  console.error(`Unknown subcommand: ${sub}`);
  printHistoryUsage();
  process.exit(1);
}

module.exports = { printHistoryUsage, parseHistoryArgs, handleHistory };
