const { buildScore, formatScore, computeLintPenalty, computeDeprecatedPenalty } = require('./score');

const makeSnapshot = (routes) => ({ routes });

const goodRoute = (i) => ({
  method: 'GET',
  path: `/api/resource/${i}`,
  tag: 'resource',
  description: `Gets resource ${i}`,
  deprecated: false,
});

const badRoute = (i) => ({
  method: 'POST',
  path: `/api/bad/${i}`,
  deprecated: true,
});

describe('computeLintPenalty', () => {
  it('returns 0 for empty results', () => {
    expect(computeLintPenalty({})).toBe(0);
  });

  it('penalizes missing tags, descriptions, duplicates', () => {
    const result = computeLintPenalty({
      missingTags: [1, 2],
      missingDescriptions: [1],
      duplicates: [1],
    });
    expect(result).toBe(3 * 2 + 2 * 1 + 5 * 1);
  });
});

describe('computeDeprecatedPenalty', () => {
  it('returns 0 when no deprecated routes', () => {
    expect(computeDeprecatedPenalty({ totalRoutes: 10, deprecated: 0 })).toBe(0);
  });

  it('returns up to 20 for all deprecated', () => {
    expect(computeDeprecatedPenalty({ totalRoutes: 10, deprecated: 10 })).toBe(20);
  });
});

describe('buildScore', () => {
  it('gives a high score for a clean snapshot', () => {
    const snapshot = makeSnapshot([goodRoute(1), goodRoute(2), goodRoute(3)]);
    const { score, grade } = buildScore(snapshot);
    expect(score).toBeGreaterThanOrEqual(80);
    expect(['A', 'B']).toContain(grade);
  });

  it('penalizes a snapshot full of bad routes', () => {
    const snapshot = makeSnapshot([badRoute(1), badRoute(2), badRoute(3)]);
    const { score } = buildScore(snapshot);
    expect(score).toBeLessThan(80);
  });
});

describe('formatScore', () => {
  it('returns a string with score and grade', () => {
    const snapshot = makeSnapshot([goodRoute(1)]);
    const result = formatScore(buildScore(snapshot));
    expect(result).toMatch(/Health Score:/);
    expect(result).toMatch(/Total routes/);
  });
});
