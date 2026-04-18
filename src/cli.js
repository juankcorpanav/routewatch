#!/usr/bin/env node
const { saveSnapshot, loadSnapshot, listSnapshots } = require('./snapshot');

const [,, command, ...args] = process.argv;

function printUsage() {
  console.log(`
routewatch — API route snapshot manager

Usage:
  routewatch save <name> <routes-json>   Save a route snapshot
  routewatch load <name>                 Print a saved snapshot
  routewatch list                        List all snapshots
`);
}

function handleSave([name, routesJson]) {
  if (!name || !routesJson) {
    console.error('Usage: routewatch save <name> <routes-json>');
    process.exit(1);
  }
  let routes;
  try {
    routes = JSON.parse(routesJson);
  } catch {
    console.error('Error: routes-json must be valid JSON');
    process.exit(1);
  }
  const filePath = saveSnapshot(name, routes);
  console.log(`Snapshot "${name}" saved to ${filePath}`);
}

function handleLoad([name]) {
  if (!name) {
    console.error('Usage: routewatch load <name>');
    process.exit(1);
  }
  try {
    const snapshot = loadSnapshot(name);
    console.log(JSON.stringify(snapshot, null, 2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function handleList() {
  const names = listSnapshots();
  if (names.length === 0) {
    console.log('No snapshots found.');
  } else {
    console.log('Saved snapshots:');
    names.forEach(n => console.log(`  - ${n}`));
  }
}

switch (command) {
  case 'save':   handleSave(args); break;
  case 'load':   handleLoad(args); break;
  case 'list':   handleList(); break;
  default:       printUsage();
}
