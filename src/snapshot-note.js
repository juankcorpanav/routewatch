const fs = require('fs');
const path = require('path');

const NOTES_DIR = path.join('.routewatch', 'notes');

function ensureNotesDir() {
  if (!fs.existsSync(NOTES_DIR)) fs.mkdirSync(NOTES_DIR, { recursive: true });
}

function notesFilePath(snapshotName) {
  return path.join(NOTES_DIR, `${snapshotName}.json`);
}

function loadNotes(snapshotName) {
  const file = notesFilePath(snapshotName);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveNotes(snapshotName, notes) {
  ensureNotesDir();
  fs.writeFileSync(notesFilePath(snapshotName), JSON.stringify(notes, null, 2));
}

function addNote(snapshotName, text) {
  const notes = loadNotes(snapshotName);
  const entry = { id: Date.now(), text, createdAt: new Date().toISOString() };
  notes.push(entry);
  saveNotes(snapshotName, notes);
  return entry;
}

function removeNote(snapshotName, id) {
  const notes = loadNotes(snapshotName);
  const filtered = notes.filter(n => n.id !== id);
  if (filtered.length === notes.length) return false;
  saveNotes(snapshotName, filtered);
  return true;
}

function clearNotes(snapshotName) {
  saveNotes(snapshotName, []);
}

module.exports = { loadNotes, saveNotes, addNote, removeNote, clearNotes };
