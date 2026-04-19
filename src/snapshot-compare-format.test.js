const { formatCompareHeader, formatCompareSummary, formatCompareEmpty, formatCompareResult } = require('./snapshot-compare-format');

describe('formatCompareHeader', () => {
  it('includes both snapshot names', () => {
    const out = formatCompareHeader('v1', 'v2');
    expect(out).toContain('v1');
    expect(out).toContain('v2');
  });
});

describe('formatCompareSummary', () => {
  it('shows added/removed/changed counts', () => {
    const out = formatCompareSummary({ added: 2, removed: 1, changed: 3, total: 6 });
    expect(out).toContain('+2');
    expect(out).toContain('-1');
    expect(out).toContain('~3');
  });

  it('returns no differences message when all zero', () => {
    const out = formatCompareSummary({ added: 0, removed: 0, changed: 0, total: 0 });
    expect(out).toContain('No differences');
  });
});

describe('formatCompareEmpty', () => {
  it('returns identical message', () => {
    expect(formatCompareEmpty()).toContain('identical');
  });
});

describe('formatCompareResult', () => {
  it('combines header and summary', () => {
    const result = { nameA: 'a', nameB: 'b', diff: {}, meta: {} };
    const summary = { added: 1, removed: 0, changed: 0, total: 1 };
    const out = formatCompareResult(result, summary);
    expect(out).toContain('a');
    expect(out).toContain('b');
    expect(out).toContain('+1');
  });
});
