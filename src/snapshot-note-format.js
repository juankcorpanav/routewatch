const { c } = require('./format');

function formatNoteList(snapshotName, notes) {
  if (!notes.length) return c(`No notes for snapshot "${snapshotName}".`, 'yellow');
  const header = c(`Notes for "${snapshotName}":`, 'cyan');
  const lines = notes.map(n => `  [${n.id}] ${n.text}  ${c(n.createdAt, 'gray')}`);
  return [header, ...lines].join('\n');
}

function formatNoteAdded(snapshotName, note) {
  return c(`Note added to "${snapshotName}" [${note.id}]: ${note.text}`, 'green');
}

function formatNoteRemoved(id) {
  return c(`Note [${id}] removed.`, 'green');
}

function formatNoteNotFound(id) {
  return c(`Note [${id}] not found.`, 'red');
}

function formatNotesCleared(snapshotName) {
  return c(`All notes cleared for "${snapshotName}".`, 'yellow');
}

module.exports = { formatNoteList, formatNoteAdded, formatNoteRemoved, formatNoteNotFound, formatNotesCleared };
