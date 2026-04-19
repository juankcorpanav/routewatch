const {
  getTagsForSnapshot,
  addTagToSnapshot,
  removeTagFromSnapshot,
  hasTag,
  filterSnapshotsByTag,
} = require('./snapshot-tag');

const base = { name: 'test', routes: [] };

describe('getTagsForSnapshot', () => {
  it('returns empty array when no tags', () => {
    expect(getTagsForSnapshot(base)).toEqual([]);
  });
  it('returns existing tags', () => {
    expect(getTagsForSnapshot({ ...base, tags: ['v1', 'prod'] })).toEqual(['v1', 'prod']);
  });
});

describe('addTagToSnapshot', () => {
  it('adds a tag', () => {
    const result = addTagToSnapshot(base, 'v1');
    expect(result.tags).toContain('v1');
  });
  it('does not duplicate tags', () => {
    const s = { ...base, tags: ['v1'] };
    const result = addTagToSnapshot(s, 'v1');
    expect(result.tags.filter(t => t === 'v1').length).toBe(1);
  });
});

describe('removeTagFromSnapshot', () => {
  it('removes a tag', () => {
    const s = { ...base, tags: ['v1', 'prod'] };
    const result = removeTagFromSnapshot(s, 'v1');
    expect(result.tags).not.toContain('v1');
    expect(result.tags).toContain('prod');
  });
  it('handles removing non-existent tag', () => {
    const s = { ...base, tags: ['v1'] };
    const result = removeTagFromSnapshot(s, 'nope');
    expect(result.tags).toEqual(['v1']);
  });
});

describe('hasTag', () => {
  it('returns true if tag present', () => {
    expect(hasTag({ ...base, tags: ['prod'] }, 'prod')).toBe(true);
  });
  it('returns false if tag absent', () => {
    expect(hasTag(base, 'prod')).toBe(false);
  });
});

describe('filterSnapshotsByTag', () => {
  const snapshots = [
    { ...base, name: 'a', tags: ['prod'] },
    { ...base, name: 'b', tags: ['staging'] },
    { ...base, name: 'c', tags: ['prod', 'v2'] },
  ];
  it('filters by tag', () => {
    const result = filterSnapshotsByTag(snapshots, 'prod');
    expect(result.map(s => s.name)).toEqual(['a', 'c']);
  });
  it('returns empty if no match', () => {
    expect(filterSnapshotsByTag(snapshots, 'dev')).toEqual([]);
  });
});
