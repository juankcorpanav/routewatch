const { buildSnapshotStatus, formatSnapshotStatus } = require('./snapshot-status');
const { lockSnapshot, unlockSnapshot } = require('./snapshot-lock');
const { pinSnapshot, unpinSnapshot } = require('./snapshot-pin');
const { setBaseline, clearBaseline } = require('./baseline');
const { addTagToSnapshot } = require('./snapshot-tag');
const { addNote, clearNotes } = require('./snapshot-note');

const NAME = '__status-test-snap__';

afterEach(() => {
  unlockSnapshot(NAME);
  unpinSnapshot(NAME);
  clearBaseline();
  clearNotes(NAME);
});

describe('buildSnapshotStatus', () => {
  test('returns defaults for a plain snapshot', () => {
    const status = buildSnapshotStatus(NAME);
    expect(status.name).toBe(NAME);
    expect(status.locked).toBe(false);
    expect(status.pinned).toBe(false);
    expect(status.isBaseline).toBe(false);
    expect(status.tags).toEqual([]);
    expect(status.noteCount).toBe(0);
  });

  test('reflects locked state', () => {
    lockSnapshot(NAME);
    const status = buildSnapshotStatus(NAME);
    expect(status.locked).toBe(true);
  });

  test('reflects pinned state', () => {
    pinSnapshot(NAME);
    const status = buildSnapshotStatus(NAME);
    expect(status.pinned).toBe(true);
  });

  test('reflects baseline state', () => {
    setBaseline(NAME);
    const status = buildSnapshotStatus(NAME);
    expect(status.isBaseline).toBe(true);
  });

  test('reflects note count', () => {
    addNote(NAME, 'first note');
    addNote(NAME, 'second note');
    const status = buildSnapshotStatus(NAME);
    expect(status.noteCount).toBe(2);
  });
});

describe('formatSnapshotStatus', () => {
  test('includes all fields in output', () => {
    const status = {
      name: 'v1',
      locked: true,
      pinned: false,
      isBaseline: true,
      tags: ['stable', 'prod'],
      noteCount: 3,
    };
    const output = formatSnapshotStatus(status);
    expect(output).toContain('Snapshot: v1');
    expect(output).toContain('Locked:   yes');
    expect(output).toContain('Pinned:   no');
    expect(output).toContain('Baseline: yes');
    expect(output).toContain('stable, prod');
    expect(output).toContain('Notes:    3');
  });

  test('shows (none) when no tags', () => {
    const status = {
      name: 'v2',
      locked: false,
      pinned: false,
      isBaseline: false,
      tags: [],
      noteCount: 0,
    };
    const output = formatSnapshotStatus(status);
    expect(output).toContain('(none)');
  });
});
