// cli-env.js — CLI handler for environment management

const { setEnv, getEnv, removeEnv, listEnvs } = require('./env');

function printEnvUsage() {
  console.log(`
Usage: routewatch env <subcommand> [options]

Subcommands:
  set <name> <url>    Register a named environment
  get <name>          Show details for an environment
  remove <name>       Remove a named environment
  list                List all registered environments
`);
}

function handleEnv(args) {
  const [sub, ...rest] = args;

  if (!sub || sub === '--help' || sub === '-h') {
    printEnvUsage();
    return;
  }

  if (sub === 'set') {
    const [name, url] = rest;
    if (!name || !url) {
      console.error('Error: set requires <name> and <url>');
      process.exit(1);
    }
    const env = setEnv(name, url);
    console.log(`Environment '${env.name}' set to ${env.url}`);
    return;
  }

  if (sub === 'get') {
    const [name] = rest;
    if (!name) { console.error('Error: get requires <name>'); process.exit(1); }
    const env = getEnv(name);
    if (!env) { console.error(`No environment named '${name}'`); process.exit(1); }
    console.log(`${env.name}: ${env.url} (created ${env.createdAt})`);
    return;
  }

  if (sub === 'remove') {
    const [name] = rest;
    if (!name) { console.error('Error: remove requires <name>'); process.exit(1); }
    const removed = removeEnv(name);
    if (!removed) { console.error(`No environment named '${name}'`); process.exit(1); }
    console.log(`Environment '${name}' removed.`);
    return;
  }

  if (sub === 'list') {
    const envs = listEnvs();
    if (envs.length === 0) { console.log('No environments registered.'); return; }
    envs.forEach(e => console.log(`  ${e.name.padEnd(16)} ${e.url}`));
    return;
  }

  console.error(`Unknown subcommand: ${sub}`);
  printEnvUsage();
  process.exit(1);
}

module.exports = { printEnvUsage, handleEnv };
