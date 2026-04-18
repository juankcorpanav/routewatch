const {
  formatEnvList,
  formatEnvSet,
  formatEnvRemoved,
  formatEnvResolved,
  formatEnvNotFound,
} = require('./env-format');

describe('formatEnvList', () => {
  it('shows message when no envs set', () => {
    const result = formatEnvList({});
    expect(result).toContain('no environments set');
  });

  it('lists all env key-value pairs', () => {
    const result = formatEnvList({ prod: 'https://api.prod.com', dev: 'http://localhost:3000' });
    expect(result).toContain('prod');
    expect(result).toContain('https://api.prod.com');
    expect(result).toContain('dev');
    expect(result).toContain('http://localhost:3000');
  });
});

describe('formatEnvSet', () => {
  it('confirms key and value were set', () => {
    const result = formatEnvSet('staging', 'https://staging.api.com');
    expect(result).toContain('staging');
    expect(result).toContain('https://staging.api.com');
    expect(result).toContain('Set env');
  });
});

describe('formatEnvRemoved', () => {
  it('confirms key was removed', () => {
    const result = formatEnvRemoved('staging');
    expect(result).toContain('staging');
    expect(result).toContain('Removed env');
  });
});

describe('formatEnvResolved', () => {
  it('shows resolved value for key', () => {
    const result = formatEnvResolved('prod', 'https://api.prod.com');
    expect(result).toContain('prod');
    expect(result).toContain('https://api.prod.com');
    expect(result).toContain('resolves to');
  });
});

describe('formatEnvNotFound', () => {
  it('shows error for missing key', () => {
    const result = formatEnvNotFound('ghost');
    expect(result).toContain('ghost');
    expect(result).toContain('not found');
  });
});
