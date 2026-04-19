const { buildNotifyThresholds, checkThresholds, formatNotifyAlerts, shouldNotify } = require('./notify');

const diff = [
  { type: 'added', key: 'GET /a' },
  { type: 'added', key: 'GET /b' },
  { type: 'removed', key: 'DELETE /c' },
  { type: 'changed', key: 'POST /d' },
];

describe('buildNotifyThresholds', () => {
  it('merges with defaults', () => {
    const t = buildNotifyThresholds({ removed: 0 });
    expect(t.removed).toBe(0);
    expect(t.added).toBe(Infinity);
  });
});

describe('checkThresholds', () => {
  it('returns empty when nothing exceeded', () => {
    const alerts = checkThresholds(diff, buildNotifyThresholds());
    expect(alerts).toHaveLength(0);
  });

  it('fires alert when added exceeds threshold', () => {
    const alerts = checkThresholds(diff, buildNotifyThresholds({ added: 1 }));
    expect(alerts.some(a => a.includes('Added'))).toBe(true);
  });

  it('fires alert when removed exceeds threshold', () => {
    const alerts = checkThresholds(diff, buildNotifyThresholds({ removed: 0 }));
    expect(alerts.some(a => a.includes('Removed'))).toBe(true);
  });

  it('fires alert when total exceeds threshold', () => {
    const alerts = checkThresholds(diff, buildNotifyThresholds({ total: 2 }));
    expect(alerts.some(a => a.includes('Total'))).toBe(true);
  });
});

describe('formatNotifyAlerts', () => {
  it('returns null when no alerts', () => {
    expect(formatNotifyAlerts([], diff)).toBeNull();
  });

  it('returns formatted string with alerts', () => {
    const alerts = ['Added routes (2) exceeds threshold (1)'];
    const out = formatNotifyAlerts(alerts, diff);
    expect(out).toContain('RouteWatch');
    expect(out).toContain('Added routes');
  });
});

describe('shouldNotify', () => {
  it('returns false when under thresholds', () => {
    expect(shouldNotify(diff, buildNotifyThresholds())).toBe(false);
  });

  it('returns true when threshold exceeded', () => {
    expect(shouldNotify(diff, buildNotifyThresholds({ added: 0 }))).toBe(true);
  });
});
