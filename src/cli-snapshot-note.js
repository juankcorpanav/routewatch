const { loadNotes, addNote, removeNote, clearNotes } = require('./snapshot-note');
const { formatNoteList, formatNoteAdded, formatNoteRemoved, formatNoteNotFound, formatNotesCleared } = require('./snapshot-note-format');

function printNoteUsage() {
  console.log(`
Usage: routewatch note <subcommand> <snapshot> [options]

Subcommands:
  list <snapshot>           List notes for a snapshot
  add <snapshot> <text>     Add a note to a snapshot
  remove <snapshot> <id>    Remove a note by ID
  clear <snapshot>          Clear all notes for a snapshot
`);
}

function handleNote(args) {
  const [sub, snapshotName, ...rest] = args;

  if (!sub || !snapshotName) {
    printNoteUsage();
    return;
  }

  if (sub === 'list') {
    const notes = loadNotes(snapshotName);
    console.log(formatNoteList(snapshotName, notes));
    return;
  }

  if (sub === 'add') {
    const text = rest.join(' ');
    if (!text) { console.log('Note text is required.'); return; }
    const note = addNote(snapshotName, text);
    console.log(formatNoteAdded(snapshotName, note));
    return;
  }

  if (sub === 'remove') {
    const id = parseInt(rest[0], 10);
    if (isNaN(id)) { console.log('Valid note ID is required.'); return; }
    const ok = removeNote(snapshotName, id);
    console.log(ok ? formatNoteRemoved(id) : formatNoteNotFound(id));
    return;
  }

  if (sub === 'clear') {
    clearNotes(snapshotName);
    console.log(formatNotesCleared(snapshotName));
    return;
  }

  printNoteUsage();
}

module.exports = { printNoteUsage, handleNote };
