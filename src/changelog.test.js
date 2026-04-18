const fs = require('fs');
const path = require('path');
const { saveChangelog, listChangelogs, loadChangelog, formatChangelogEntry, buildChangelogFilename } = require('./changelog');

const CHANGELOG_DIR = '.routewatch/changelogs';

function cleanup() {
  if (fs.existsSync(CHANGELOG_DIR)) {
    fs.readdirSync(CHANGELOG_DIR).forEach(f => fs.unlinkSync(path.join(CHANGELOG_DIR, f)));
  }
}

const fakeDiff = { added: [{ method: 'GET', path: '/new' }], removed: [], changed: [] };

beforeEach(cleanup);
afterAll(cleanup);

test('buildChangelogFilename includes label', () => {
  const name = buildChangelogFilename('v2');
  expect(name).toMatch(/v2/);
  expect(name).toMatch(/\.json$/);
});

test('saveChangelog writes file and returns path', () => {
  const fp = saveChangelog('release-1', fakeDiff);
  expect(fs.existsSync(fp)).toBe(true);
});

test('listChangelogs returns saved entries', () => {
  saveChangelog('alpha', fakeDiff);
  saveChangelog('beta', fakeDiff);
  const list = listChangelogs();
  expect(list.length).toBe(2);
});

test('loadChangelog returns parsed entry', () => {
  saveChangelog('myrelease', fakeDiff);
  const list = listChangelogs();
  const entry = loadChangelog(list[0]);
  expect(entry.label).toBe('myrelease');
  expect(entry.diff.added.length).toBe(1);
});

test('loadChangelog throws for missing file', () => {
  expect(() => loadChangelog('nope.json')).toThrow();
});

test('formatChangelogEntry returns summary string', () => {
  const entry = { label: 'v3', timestamp: new Date().toISOString(), diff: fakeDiff };
  const out = formatChangelogEntry(entry);
  expect(out).toMatch(/v3/);
  expect(out).toMatch(/Added: 1/);
});
