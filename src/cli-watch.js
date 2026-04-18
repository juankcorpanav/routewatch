const { watchSnapshot, DEFAULT_INTERVAL } = require('./watch');
const { saveSnapshot } = require('./snapshot');
const { assertValidSnapshot } = require('./validate');

function printWatchUsage() {
  console.log(`
Usage: routewatch watch <snapshot-name> [options]

Options:
  --interval <ms>     Polling interval in milliseconds (default: ${DEFAULT_INTERVAL})
  --method <METHOD>   Filter by HTTP method
  --prefix <prefix>   Filter by path prefix
  --tag <tag>         Filter by tag
  --silent            Suppress output (only trigger callbacks)

Example:
  routewatch watch production --interval 10000 --method GET
`);
}

function parseWatchArgs(argv) {
  const args = argv.slice(3);
  const name = args[0];
  const options = {
    interval: DEFAULT_INTERVAL,
    filters: {},
    silent: false,
  };

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--interval' && args[i + 1]) {
      options.interval = parseInt(args[++i], 10);
    } else if (args[i] === '--method' && args[i + 1]) {
      options.filters.method = args[++i];
    } else if (args[i] === '--prefix' && args[i + 1]) {
      options.filters.prefix = args[++i];
    } else if (args[i] === '--tag' && args[i + 1]) {
      options.filters.tag = args[++i];
    } else if (args[i] === '--silent') {
      options.silent = true;
    }
  }

  return { name, options };
}

function handleWatch(argv) {
  const { name, options } = parseWatchArgs(argv);

  if (!name) {
    printWatchUsage();
    process.exit(1);
  }

  console.log(`[routewatch] Watching snapshot "${name}" every ${options.interval}ms...`);

  const watcher = watchSnapshot(name, options);

  process.on('SIGINT', () => {
    console.log('\n[routewatch] Stopped watching.');
    watcher.stop();
    process.exit(0);
  });
}

module.exports = { printWatchUsage, parseWatchArgs, handleWatch };
