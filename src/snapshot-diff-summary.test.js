const {
  buildDiffSummary,
  computeChangeRate,
  classifyDiff,
  buildFullDiffSummary,
} = require('./snapshot-diff-summary');
const { formatClassification, formatDiffSummaryBlock } = require('./snapshot-diff-summary-format');

const base = [
  { method: 'GET', path: '/users', tag: 'users' },
  { method: 'POST', path: '/users', tag: 'users' },
  { method: 'DELETE', path: '/users/:id', tag: 'users' },
];

const head = [
  { method: 'GET', path: '/users', tag: 'users' },
  { method: 'POST', path: '/users', tag: 'users', description: 'create user' },
  { method: 'GET', path: '/posts', tag: 'posts' },
];

describe('buildDiffSummary', () => {
  it('returns correct counts', () => {
    const full = buildFullDiffSummary(base, head);
    expect(full.added).toBe(1);
    expect(full.removed).toBe(1);
    expect(full.changed).toBe(1);
    expect(full.total).toBe(3);
  });
});

describe('computeChangeRate', () => {
  it('returns 0 when baseCount is 0', () => {
    expect(computeChangeRate({ total: 5 }, 0)).toBe(0);
  });

  it('computes rate correctly', () => {
    expect(computeChangeRate({ total: 1 }, 4)).toBe(0.25);
  });
});

describe('classifyDiff', () => {
  it('returns stable when no changes', () => {
    expect(classifyDiff({ removed: 0, total: 0 }, 10)).toBe('stable');
  });

  it('returns breaking when routes removed', () => {
    expect(classifyDiff({ removed: 1, total: 1 }, 10)).toBe('breaking');
  });

  it('returns moderate when change rate > 10%', () => {
    expect(classifyDiff({ removed: 0, total: 2 }, 10)).toBe('moderate');
  });

  it('returns minor for small changes', () => {
    expect(classifyDiff({ removed: 0, total: 1 }, 100)).toBe('minor');
  });
});

describe('buildFullDiffSummary', () => {
  it('includes all expected fields', () => {
    const summary = buildFullDiffSummary(base, head);
    expect(summary).toHaveProperty('baseCount', 3);
    expect(summary).toHaveProperty('headCount', 3);
    expect(summary).toHaveProperty('changeRate');
    expect(summary).toHaveProperty('classification');
  });
});

describe('formatClassification', () => {
  it('wraps classification in brackets', () => {
    const result = formatClassification('stable');
    expect(result).toContain('STABLE');
  });
});

describe('formatDiffSummaryBlock', () => {
  it('returns a non-empty string', () => {
    const summary = buildFullDiffSummary(base, head);
    const output = formatDiffSummaryBlock(summary);
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(0);
    expect(output).toContain('Diff Summary');
  });
});
