const { registerPlugin, removePlugin, listPlugins, getPlugin } = require('./plugin');

function printPluginUsage() {
  console.log(`
Usage: routewatch plugin <subcommand> [options]

Subcommands:
  add <name> <path>   Register a plugin by name and module path
  remove <name>       Remove a registered plugin
  list                List all registered plugins
  info <name>         Show details for a plugin
`);
}

function handlePlugin(args) {
  const [sub, ...rest] = args;

  if (!sub || sub === '--help' || sub === '-h') {
    printPluginUsage();
    return;
  }

  if (sub === 'add') {
    const [name, modulePath] = rest;
    if (!name || !modulePath) {
      console.error('Usage: routewatch plugin add <name> <path>');
      process.exit(1);
    }
    const entry = registerPlugin(name, modulePath);
    console.log(`Plugin registered: ${entry.name} -> ${entry.modulePath}`);
    return;
  }

  if (sub === 'remove') {
    const [name] = rest;
    if (!name) {
      console.error('Usage: routewatch plugin remove <name>');
      process.exit(1);
    }
    const ok = removePlugin(name);
    if (ok) console.log(`Plugin removed: ${name}`);
    else console.error(`Plugin not found: ${name}`);
    return;
  }

  if (sub === 'list') {
    const plugins = listPlugins();
    if (plugins.length === 0) {
      console.log('No plugins registered.');
    } else {
      plugins.forEach(p => console.log(`  ${p.name}  ${p.modulePath}  (registered ${p.registeredAt})`));
    }
    return;
  }

  if (sub === 'info') {
    const [name] = rest;
    if (!name) {
      console.error('Usage: routewatch plugin info <name>');
      process.exit(1);
    }
    const entry = getPlugin(name);
    if (!entry) {
      console.error(`Plugin not found: ${name}`);
    } else {
      console.log(JSON.stringify(entry, null, 2));
    }
    return;
  }

  console.error(`Unknown subcommand: ${sub}`);
  printPluginUsage();
  process.exit(1);
}

module.exports = { printPluginUsage, handlePlugin };
