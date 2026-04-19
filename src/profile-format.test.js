const {
  formatProfileList,
  formatProfileSet,
  formatProfileRemoved,
  formatProfileActivated,
  formatProfileNotFound
} = require('./profile-format');

const profiles = {
  dev: { baseUrl: 'http://localhost:3000', env: 'development' },
  prod: { baseUrl: 'https://api.example.com', env: 'production' }
};

test('formatProfileList shows all profiles', () => {
  const out = formatProfileList(profiles, 'dev');
  expect(out).toContain('dev');
  expect(out).toContain('prod');
  expect(out).toContain('localhost:3000');
});

test('formatProfileList marks active profile', () => {
  const out = formatProfileList(profiles, 'dev');
  expect(out).toContain('*');
});

test('formatProfileList empty', () => {
  const out = formatProfileList({}, null);
  expect(out).toContain('No profiles');
});

test('formatProfileSet shows profile fields', () => {
  const out = formatProfileSet('dev', profiles.dev);
  expect(out).toContain('dev');
  expect(out).toContain('baseUrl');
});

test('formatProfileRemoved includes name', () => {
  const out = formatProfileRemoved('dev');
  expect(out).toContain('dev');
});

test('formatProfileActivated includes name', () => {
  const out = formatProfileActivated('prod');
  expect(out).toContain('prod');
});

test('formatProfileNotFound includes name', () => {
  const out = formatProfileNotFound('staging');
  expect(out).toContain('staging');
});
