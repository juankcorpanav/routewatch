const { groupByTag, countByMethod, buildTagSummary, formatTagSummary } = require('./tag-summary');

const sampleRoutes = [
  { method: 'GET', path: '/users', tag: 'users' },
  { method: 'POST', path: '/users', tag: 'users' },
  { method: 'DELETE', path: '/users/:id', tag: 'users' },
  { method: 'GET', path: '/posts', tag: 'posts' },
  { method: 'GET', path: '/health' },
];

describe('groupByTag', () => {
  it('groups routes by tag', () => {
    const groups = groupByTag(sampleRoutes);
    expect(groups['users']).toHaveLength(3);
    expect(groups['posts']).toHaveLength(1);
    expect(groups['untagged']).toHaveLength(1);
  });

  it('returns empty object for no routes', () => {
    expect(groupByTag([])).toEqual({});
  });
});

describe('countByMethod', () => {
  it('counts methods correctly', () => {
    const counts = countByMethod(sampleRoutes);
    expect(counts['GET']).toBe(3);
    expect(counts['POST']).toBe(1);
    expect(counts['DELETE']).toBe(1);
  });
});

describe('buildTagSummary', () => {
  it('builds sorted summary entries', () => {
    const summary = buildTagSummary({ routes: sampleRoutes });
    expect(summary[0].tag).toBe('posts');
    expect(summary[1].tag).toBe('untagged');
    expect(summary[2].tag).toBe('users');
    expect(summary[2].count).toBe(3);
  });

  it('handles missing routes key', () => {
    const summary = buildTagSummary({});
    expect(summary).toEqual([]);
  });
});

describe('formatTagSummary', () => {
  it('formats summary as readable string', () => {
    const summary = buildTagSummary({ routes: sampleRoutes });
    const output = formatTagSummary(summary);
    expect(output).toContain('Tag Summary:');
    expect(output).toContain('users (3 routes)');
    expect(output).toContain('GET:3');
  });
});
