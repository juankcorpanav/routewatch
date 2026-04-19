const { loadConfig, setConfigValue, resetConfig, DEFAULTS } = require('./config');

function printConfigUsage() {
  console.log(`
Usage: routewatch config <subcommand> [key] [value]

Subcommands:
  list                  Show all config values
  get <key>             Get a specific config value
  set <key> <value>     Set a config value
  reset                 Reset config to defaults

Valid keys: ${Object.keys(DEFAULTS).join(', ')}
`);
}

function handleConfig(args) {
  const [sub, key, value] = args;

  if (!sub || sub === 'list') {
    const config = loadConfig();
    console.log('\nCurrent configuration:\n');
    for (const [k, v] of Object.entries(config)) {
      const isDefault = v === DEFAULTS[k];
      console.log(`  ${k}: ${v}${isDefault ? ' (default)' : ''}`);
    }
    console.log();
    return;
  }

  if (sub === 'get') {
    if (!key) { printConfigUsage(); return; }
    const config = loadConfig();
    if (!(key in config)) {
      console.error(`Unknown config key: ${key}`);
      process.exit(1);
    }
    console.log(`${key}: ${config[key]}`);
    return;
  }

  if (sub === 'set') {
    if (!key || value === undefined) { printConfigUsage(); return; }
    if (!(key in DEFAULTS)) {
      console.error(`Unknown config key: ${key}`);
      console.error(`Valid keys: ${Object.keys(DEFAULTS).join(', ')}`);
      process.exit(1);
    }
    try {
      const parsed = isNaN(value) ? value : Number(value);
      setConfigValue(key, parsed);
      console.log(`Set ${key} = ${parsed}`);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
    return;
  }

  if (sub === 'reset') {
    resetConfig();
    console.log('Config reset to defaults.');
    return;
  }

  printConfigUsage();
}

module.exports = { printConfigUsage, handleConfig };
