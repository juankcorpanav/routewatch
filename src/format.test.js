const {
  formatAdded,
  formatRemoved,
  formatChanged,
  formatDiffSummary,
  formatSnapshotList,
} = require('./format');

const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');

describe('formatAdded', () => {
  it('includes method and path', () => {
    const out = stripAnsi(formatAdded({ method: 'GET', path: '/users' }));
    expect(out).toContain('GET');
    expect(out).toContain('/users');
    expect(out).toMatch(/^\+/);
  });
});

describe('formatRemoved', () => {
  it('includes method and path with minus prefix', () => {
    const out = stripAnsi(formatRemoved({ method: 'DELETE', path: '/items/:id' }));
    expect(out).toContain('DELETE');
    expect(out).toMatch(/^-/);
  });
});

describe('formatChanged', () => {
  it('shows field-level before/after', () => {
    const out = stripAnsi(
      formatChanged({ method: 'POST', path: '/login' }, {
        auth: { before: 'none', after: 'bearer' },
      })
    );
    expect(out).toContain('~');
    expect(out).toContain('auth');
    expect(out).toContain('none');
    expect(out).toContain('bearer');
  });
});

describe('formatDiffSummary', () => {
  it('reports no changes when diff is empty', () => {
    const out = stripAnsi(formatDiffSummary({ added: [], removed: [], changed: [] }));
    expect(out).toContain('No changes detected');
  });

  it('includes summary counts', () => {
    const diff = {
      added: [{ method: 'GET', path: '/new' }],
      removed: [],
      changed: [],
    };
    const out = stripAnsi(formatDiffSummary(diff));
    expect(out).toContain('Added:   1');
    expect(out).toContain('Removed: 0');
  });
});

describe('formatSnapshotList', () => {
  it('returns dim message when empty', () => {
    const out = stripAnsi(formatSnapshotList([]));
    expect(out).toContain('No snapshots found');
  });

  it('lists snapshot names with index', () => {
    const out = stripAnsi(formatSnapshotList(['v1', 'v2']));
    expect(out).toContain('v1');
    expect(out).toContain('v2');
    expect(out).toContain('1.');
  });
});
