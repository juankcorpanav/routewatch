const fs = require('fs');
const path = require('path');
const { addSnapshotToGroup, removeSnapshotFromGroup, getGroup, listGroups, deleteGroup, loadGroups } = require('./snapshot-group');

const GROUPS_FILE = path.join('.routewatch', 'groups.json');

function cleanup() {
  if (fs.existsSync(GROUPS_FILE)) fs.unlinkSync(GROUPS_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('addSnapshotToGroup creates group and adds member', () => {
  const members = addSnapshotToGroup('prod', 'snap-1');
  expect(members).toContain('snap-1');
  const groups = loadGroups();
  expect(groups['prod']).toEqual(['snap-1']);
});

test('addSnapshotToGroup does not duplicate members', () => {
  addSnapshotToGroup('prod', 'snap-1');
  const members = addSnapshotToGroup('prod', 'snap-1');
  expect(members.length).toBe(1);
});

test('addSnapshotToGroup adds multiple members', () => {
  addSnapshotToGroup('prod', 'snap-1');
  const members = addSnapshotToGroup('prod', 'snap-2');
  expect(members).toEqual(['snap-1', 'snap-2']);
});

test('removeSnapshotFromGroup removes member', () => {
  addSnapshotToGroup('prod', 'snap-1');
  addSnapshotToGroup('prod', 'snap-2');
  const members = removeSnapshotFromGroup('prod', 'snap-1');
  expect(members).toEqual(['snap-2']);
});

test('removeSnapshotFromGroup deletes group when empty', () => {
  addSnapshotToGroup('prod', 'snap-1');
  removeSnapshotFromGroup('prod', 'snap-1');
  expect(getGroup('prod')).toBeNull();
});

test('removeSnapshotFromGroup returns null for missing group', () => {
  expect(removeSnapshotFromGroup('missing', 'snap-1')).toBeNull();
});

test('getGroup returns null for unknown group', () => {
  expect(getGroup('nope')).toBeNull();
});

test('listGroups returns all groups', () => {
  addSnapshotToGroup('a', 'snap-1');
  addSnapshotToGroup('b', 'snap-2');
  const groups = listGroups();
  expect(Object.keys(groups)).toEqual(expect.arrayContaining(['a', 'b']));
});

test('deleteGroup removes group', () => {
  addSnapshotToGroup('prod', 'snap-1');
  expect(deleteGroup('prod')).toBe(true);
  expect(getGroup('prod')).toBeNull();
});

test('deleteGroup returns false for missing group', () => {
  expect(deleteGroup('ghost')).toBe(false);
});
