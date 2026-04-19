const fs = require('fs');
const path = require('path');
const { setProfile, getProfile, removeProfile, listProfiles, loadProfiles } = require('./profile');

const PROFILE_DIR = path.join(process.cwd(), '.routewatch', 'profiles');
const PROFILE_FILE = path.join(PROFILE_DIR, 'profiles.json');

function cleanup() {
  if (fs.existsSync(PROFILE_FILE)) fs.unlinkSync(PROFILE_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('setProfile stores a profile with updatedAt', () => {
  const result = setProfile('prod', { baseUrl: 'https://api.example.com' });
  expect(result.baseUrl).toBe('https://api.example.com');
  expect(result.updatedAt).toBeDefined();
});

test('getProfile retrieves stored profile', () => {
  setProfile('staging', { baseUrl: 'https://staging.example.com' });
  const p = getProfile('staging');
  expect(p).not.toBeNull();
  expect(p.baseUrl).toBe('https://staging.example.com');
});

test('getProfile returns null for unknown profile', () => {
  expect(getProfile('nonexistent')).toBeNull();
});

test('removeProfile deletes an existing profile', () => {
  setProfile('temp', { baseUrl: 'https://temp.example.com' });
  const removed = removeProfile('temp');
  expect(removed).toBe(true);
  expect(getProfile('temp')).toBeNull();
});

test('removeProfile returns false for missing profile', () => {
  expect(removeProfile('ghost')).toBe(false);
});

test('listProfiles returns all profiles as array', () => {
  setProfile('a', { baseUrl: 'https://a.com' });
  setProfile('b', { baseUrl: 'https://b.com' });
  const list = listProfiles();
  expect(list.length).toBe(2);
  expect(list.map(p => p.name)).toContain('a');
  expect(list.map(p => p.name)).toContain('b');
});
