const { validateRoute, validateSnapshot, assertValidSnapshot } = require('./validate');

const validRoute = { path: '/users', method: 'GET' };
const validSnapshot = {
  name: 'v1',
  timestamp: new Date().toISOString(),
  routes: [validRoute],
};

describe('validateRoute', () => {
  test('returns no errors for a valid route', () => {
    expect(validateRoute(validRoute, 0)).toEqual([]);
  });

  test('errors when path is missing', () => {
    const errs = validateRoute({ method: 'GET' }, 0);
    expect(errs.some(e => e.includes('path'))).toBe(true);
  });

  test('errors when method is missing', () => {
    const errs = validateRoute({ path: '/x' }, 0);
    expect(errs.some(e => e.includes('method'))).toBe(true);
  });

  test('errors on unknown HTTP method', () => {
    const errs = validateRoute({ path: '/x', method: 'FETCH' }, 0);
    expect(errs.some(e => e.includes('unknown method'))).toBe(true);
  });

  test('accepts all standard methods', () => {
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    methods.forEach(m => {
      expect(validateRoute({ path: '/x', method: m }, 0)).toEqual([]);
    });
  });
});

describe('validateSnapshot', () => {
  test('returns no errors for a valid snapshot', () => {
    expect(validateSnapshot(validSnapshot)).toEqual([]);
  });

  test('errors when name is missing', () => {
    const errs = validateSnapshot({ ...validSnapshot, name: undefined });
    expect(errs.some(e => e.includes('name'))).toBe(true);
  });

  test('errors when routes is not an array', () => {
    const errs = validateSnapshot({ ...validSnapshot, routes: null });
    expect(errs.some(e => e.includes('routes'))).toBe(true);
  });

  test('propagates route-level errors', () => {
    const errs = validateSnapshot({ ...validSnapshot, routes: [{ method: 'GET' }] });
    expect(errs.length).toBeGreaterThan(0);
  });
});

describe('assertValidSnapshot', () => {
  test('does not throw for valid snapshot', () => {
    expect(() => assertValidSnapshot(validSnapshot)).not.toThrow();
  });

  test('throws with message for invalid snapshot', () => {
    expect(() => assertValidSnapshot({})).toThrow('Invalid snapshot');
  });
});
