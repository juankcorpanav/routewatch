// cli-alias.js — CLI handler for alias commands
const { setAlias, getAlias, removeAlias, listAliases } = require('./alias');

function printAliasUsage() {
  console.log(`
Usage: routewatch alias <subcommand> [options]

Subcommands:
  set <alias> <snapshot>   Assign an alias to a snapshot name
  get <alias>              Resolve an alias to its snapshot name
  remove <alias>           Remove an alias
  list                     List all aliases
`);
}

function handleAlias(args) {
  const [sub, ...rest] = args;

  if (!sub || sub === '--help' || sub === '-h') {
    printAliasUsage();
    return;
  }

  if (sub === 'set') {
    const [alias, snapshot] = rest;
    if (!alias || !snapshot) {
      console.error('Usage: routewatch alias set <alias> <snapshot>');
      process.exit(1);
    }
    setAlias(alias, snapshot);
    console.log(`Alias '${alias}' -> '${snapshot}' saved.`);
    return;
  }

  if (sub === 'get') {
    const [alias] = rest;
    if (!alias) { console.error('Provide an alias name.'); process.exit(1); }
    const name = getAlias(alias);
    if (!name) { console.log(`No alias found for '${alias}'.`); }
    else { console.log(`${alias} -> ${name}`); }
    return;
  }

  if (sub === 'remove') {
    const [alias] = rest;
    if (!alias) { console.error('Provide an alias name.'); process.exit(1); }
    removeAlias(alias);
    console.log(`Alias '${alias}' removed.`);
    return;
  }

  if (sub === 'list') {
    const aliases = listAliases();
    const entries = Object.entries(aliases);
    if (entries.length === 0) { console.log('No aliases defined.'); return; }
    entries.forEach(([a, s]) => console.log(`  ${a} -> ${s}`));
    return;
  }

  console.error(`Unknown alias subcommand: ${sub}`);
  printAliasUsage();
  process.exit(1);
}

module.exports = { printAliasUsage, handleAlias };
