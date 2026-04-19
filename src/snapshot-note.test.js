const fs = require('fs');
const path = require('path');
const { loadNotes, addNote, removeNote, clearNotes } = require('./snapshot-note');

const NOTES_DIR = path.join('.routewatch', 'notes');

function cleanup() {
  const file = path.join(NOTES_DIR, 'test-snap.json');
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

beforeEach(cleanup);
afterAll(cleanup);

test('loadNotes returns empty array when no file', () => {
  expect(loadNotes('test-snap')).toEqual([]);
});

test('addNote persists a note', () => {
  const note = addNote('test-snap', 'initial release');
  expect(note.text).toBe('initial release');
  expect(note.id).toBeDefined();
  const notes = loadNotes('test-snap');
  expect(notes).toHaveLength(1);
  expect(notes[0].text).toBe('initial release');
});

test('addNote appends multiple notes', () => {
  addNote('test-snap', 'first');
  addNote('test-snap', 'second');
  expect(loadNotes('test-snap')).toHaveLength(2);
});

test('removeNote deletes by id', () => {
  const note = addNote('test-snap', 'to remove');
  const result = removeNote('test-snap', note.id);
  expect(result).toBe(true);
  expect(loadNotes('test-snap')).toHaveLength(0);
});

test('removeNote returns false if id not found', () => {
  expect(removeNote('test-snap', 99999)).toBe(false);
});

test('clearNotes removes all notes', () => {
  addNote('test-snap', 'a');
  addNote('test-snap', 'b');
  clearNotes('test-snap');
  expect(loadNotes('test-snap')).toHaveLength(0);
});
