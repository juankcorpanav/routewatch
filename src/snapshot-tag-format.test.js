const {
  formatTagList,
  formatTagAdded,
  formatTagRemoved,
  formatTagNotFound,
  formatSnapshotsByTag,
} = require('./snapshot-tag-format');

describe('formatTagList', () => {
  it('returns message when no tags', () => {
    const result = formatTagList('v1', []);
    expect(result).toMatch(/No tags/);
    expect(result).toMatch(/v1/);
  });

  it('lists tags when present', () => {
    const result = formatTagList('v1', ['prod', 'stable']);
    expect(result).toMatch(/prod/);
    expect(result).toMatch(/stable/);
  });
});

describe('formatTagAdded', () => {
  it('confirms tag addition', () => {
    const result = formatTagAdded('v2', 'staging');
    expect(result).toMatch(/staging/);
    expect(result).toMatch(/v2/);
  });
});

describe('formatTagRemoved', () => {
  it('confirms tag removal', () => {
    const result = formatTagRemoved('v2', 'old');
    expect(result).toMatch(/old/);
    expect(result).toMatch(/v2/);
  });
});

describe('formatTagNotFound', () => {
  it('shows error when tag missing', () => {
    const result = formatTagNotFound('v1', 'ghost');
    expect(result).toMatch(/ghost/);
    expect(result).toMatch(/not found/);
  });
});

describe('formatSnapshotsByTag', () => {
  it('returns message when no snapshots', () => {
    const result = formatSnapshotsByTag('prod', []);
    expect(result).toMatch(/No snapshots/);
  });

  it('lists snapshots for a tag', () => {
    const result = formatSnapshotsByTag('prod', ['v1', 'v2']);
    expect(result).toMatch(/v1/);
    expect(result).toMatch(/v2/);
    expect(result).toMatch(/prod/);
  });
});
