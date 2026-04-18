const { toCSV, toJSON, toMarkdown, exportDiff } = require('./export');

const sampleDiff = {
  added: [{ method: 'GET', path: '/users' }],
  removed: [{ method: 'DELETE', path: '/legacy' }],
  changed: [
    {
      method: 'POST',
      path: '/login',
      fields: [
        { name: 'summary', from: 'Login', to: 'User Login' }
      ]
    }
  ]
};

describe('toCSV', () => {
  it('includes header row', () => {
    const out = toCSV(sampleDiff);
    expect(out).toMatch(/^status,method,path,field,from,to/);
  });

  it('includes added route', () => {
    expect(toCSV(sampleDiff)).toContain('added,GET,/users');
  });

  it('includes removed route', () => {
    expect(toCSV(sampleDiff)).toContain('removed,DELETE,/legacy');
  });

  it('includes changed field', () => {
    expect(toCSV(sampleDiff)).toContain('changed,POST,/login,summary');
  });
});

describe('toJSON', () => {
  it('returns valid JSON', () => {
    const out = toJSON(sampleDiff);
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it('preserves structure', () => {
    const parsed = JSON.parse(toJSON(sampleDiff));
    expect(parsed.added).toHaveLength(1);
    expect(parsed.removed).toHaveLength(1);
    expect(parsed.changed).toHaveLength(1);
  });
});

describe('toMarkdown', () => {
  it('includes report heading', () => {
    expect(toMarkdown(sampleDiff)).toContain('# RouteWatch Diff Report');
  });

  it('lists added routes', () => {
    expect(toMarkdown(sampleDiff)).toContain('GET /users');
  });

  it('lists changed fields with arrows', () => {
    expect(toMarkdown(sampleDiff)).toContain('→');
  });
});

describe('exportDiff', () => {
  it('defaults to json format', () => {
    const out = exportDiff(sampleDiff, 'json');
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it('handles md alias', () => {
    expect(exportDiff(sampleDiff, 'md')).toContain('# RouteWatch');
  });

  it('handles csv format', () => {
    expect(exportDiff(sampleDiff, 'csv')).toContain('status,method');
  });
});
