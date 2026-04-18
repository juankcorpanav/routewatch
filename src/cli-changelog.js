const { saveChangelog, listChangelogs, loadChangelog, formatChangelogEntry } = require('./changelog');
const { diffSnapshots } = require('./diff');
const { loadSnapshot } = require('./snapshot');
const { formatDiffSummary } = require('./format');

function printChangelogUsage() {
  console.log(`
Usage: routewatch changelog <command> [options]

Commands:
  record <snap-a> <snap-b> [--label <label>]   Diff two snapshots and save changelog entry
  list                                          List saved changelog entries
  show <filename>                               Show a changelog entry
`);
}

function parseChangelogArgs(argv) {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === '--help') { printChangelogUsage(); return; }

  if (cmd === 'list') {
    const entries = listChangelogs();
    if (!entries.length) { console.log('No changelogs found.'); return; }
    entries.forEach(e => console.log(e));
    return;
  }

  if (cmd === 'show') {
    const [filename] = rest;
    if (!filename) { console.error('Filename required.'); process.exit(1); }
    const entry = loadChangelog(filename);
    console.log(formatChangelogEntry(entry));
    console.log(formatDiffSummary(entry.diff));
    return;
  }

  if (cmd === 'record') {
    const [snapA, snapB, ...flags] = rest;
    if (!snapA || !snapB) { console.error('Two snapshot names required.'); process.exit(1); }
    const labelIdx = flags.indexOf('--label');
    const label = labelIdx !== -1 ? flags[labelIdx + 1] : `${snapA}-vs-${snapB}`;
    const a = loadSnapshot(snapA);
    const b = loadSnapshot(snapB);
    const diff = diffSnapshots(a, b);
    const fp = saveChangelog(label, diff);
    console.log(`Changelog saved: ${fp}`);
    console.log(formatDiffSummary(diff));
    return;
  }

  console.error(`Unknown changelog command: ${cmd}`);
  printChangelogUsage();
  process.exit(1);
}

module.exports = { printChangelogUsage, parseChangelogArgs };
