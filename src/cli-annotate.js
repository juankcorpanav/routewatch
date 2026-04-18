// cli-annotate.js — CLI handler for the annotate command

const { loadSnapshot, saveSnapshot } = require('./snapshot');
const { applyAnnotations } = require('./annotate');
const { assertValidSnapshot } = require('./validate');

function printAnnotateUsage() {
  console.log(`
Usage: routewatch annotate <snapshot> --rule <json> [--rule <json> ...]

Annotate routes in a snapshot using one or more rules.

Rule JSON format:
  {"method":"GET","annotations":{"cached":true}}
  {"prefix":"/admin","annotations":{"restricted":true}}
  {"tag":"internal","annotations":{"deprecated":true}}

Options:
  --rule   JSON rule object (repeatable)
  --help   Show this help message
`);
}

function parseAnnotateArgs(args) {
  const rules = [];
  let snapshotName = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--rule' && args[i + 1]) {
      try {
        rules.push(JSON.parse(args[++i]));
      } catch {
        console.error('Invalid rule JSON:', args[i]);
        process.exit(1);
      }
    } else if (!args[i].startsWith('--')) {
      snapshotName = args[i];
    }
  }

  return { snapshotName, rules };
}

async function handleAnnotate(args) {
  if (args.includes('--help')) {
    printAnnotateUsage();
    return;
  }

  const { snapshotName, rules } = parseAnnotateArgs(args);

  if (!snapshotName) {
    console.error('Error: snapshot name is required.');
    printAnnotateUsage();
    process.exit(1);
  }

  if (rules.length === 0) {
    console.error('Error: at least one --rule is required.');
    process.exit(1);
  }

  const snapshot = await loadSnapshot(snapshotName);
  assertValidSnapshot(snapshot);
  const annotated = applyAnnotations(snapshot, rules);
  await saveSnapshot(snapshotName, annotated);
  console.log(`Annotated ${annotated.length} routes in snapshot "${snapshotName}" with ${rules.length} rule(s).`);
}

module.exports = { printAnnotateUsage, parseAnnotateArgs, handleAnnotate };
