import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  loadGroups,
  saveGroups,
  addSnapshotToGroup,
  removeSnapshotFromGroup,
  getGroup,
  listGroups,
  deleteGroup
} from './snapshot-group.js';

const TEST_DIR = '.routewatch-test-groups';

function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
}

describe('snapshot-group', () => {
  beforeEach(() => {
    cleanup();
    process.env.ROUTEWATCH_DIR = TEST_DIR;
  });

  afterEach(() => {
    cleanup();
    delete process.env.ROUTEWATCH_DIR;
  });

  describe('loadGroups / saveGroups', () => {
    it('returns empty object when no groups file exists', () => {
      const groups = loadGroups();
      expect(groups).toEqual({});
    });

    it('persists and loads groups correctly', () => {
      const data = { staging: ['snap-a', 'snap-b'], prod: ['snap-c'] };
      saveGroups(data);
      const loaded = loadGroups();
      expect(loaded).toEqual(data);
    });
  });

  describe('addSnapshotToGroup', () => {
    it('creates a new group and adds a snapshot', () => {
      addSnapshotToGroup('staging', 'snap-1');
      const groups = loadGroups();
      expect(groups.staging).toContain('snap-1');
    });

    it('appends to an existing group', () => {
      addSnapshotToGroup('staging', 'snap-1');
      addSnapshotToGroup('staging', 'snap-2');
      const groups = loadGroups();
      expect(groups.staging).toEqual(['snap-1', 'snap-2']);
    });

    it('does not add duplicate snapshots to a group', () => {
      addSnapshotToGroup('staging', 'snap-1');
      addSnapshotToGroup('staging', 'snap-1');
      const groups = loadGroups();
      expect(groups.staging.filter(s => s === 'snap-1').length).toBe(1);
    });
  });

  describe('removeSnapshotFromGroup', () => {
    it('removes a snapshot from a group', () => {
      addSnapshotToGroup('staging', 'snap-1');
      addSnapshotToGroup('staging', 'snap-2');
      removeSnapshotFromGroup('staging', 'snap-1');
      const groups = loadGroups();
      expect(groups.staging).not.toContain('snap-1');
      expect(groups.staging).toContain('snap-2');
    });

    it('returns false when group does not exist', () => {
      const result = removeSnapshotFromGroup('nonexistent', 'snap-1');
      expect(result).toBe(false);
    });

    it('returns false when snapshot is not in the group', () => {
      addSnapshotToGroup('staging', 'snap-1');
      const result = removeSnapshotFromGroup('staging', 'snap-99');
      expect(result).toBe(false);
    });
  });

  describe('getGroup', () => {
    it('returns snapshots for an existing group', () => {
      addSnapshotToGroup('prod', 'snap-a');
      const members = getGroup('prod');
      expect(members).toContain('snap-a');
    });

    it('returns null for a non-existent group', () => {
      const members = getGroup('ghost');
      expect(members).toBeNull();
    });
  });

  describe('listGroups', () => {
    it('returns all group names', () => {
      addSnapshotToGroup('alpha', 'snap-1');
      addSnapshotToGroup('beta', 'snap-2');
      const names = listGroups();
      expect(names).toContain('alpha');
      expect(names).toContain('beta');
    });

    it('returns empty array when no groups exist', () => {
      expect(listGroups()).toEqual([]);
    });
  });

  describe('deleteGroup', () => {
    it('removes an existing group entirely', () => {
      addSnapshotToGroup('temp', 'snap-x');
      deleteGroup('temp');
      expect(getGroup('temp')).toBeNull();
    });

    it('returns false when group does not exist', () => {
      const result = deleteGroup('missing');
      expect(result).toBe(false);
    });
  });
});
