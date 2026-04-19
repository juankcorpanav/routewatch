const fs = require('fs');
const path = require('path');
const { archiveSnapshot, listArchives, loadArchive, deleteArchive, archiveAll, ARCHIVE_DIR } = require('./snapshot-archive');
const { saveSnapshot } = require('./snapshot');

function cleanup() {
  if (fs.existsSync(ARCHIVE_DIR)) {
    fs.readdirSync(ARCHIVE_DIR).forEach(f => fs.unlinkSync(path.join(ARCHIVE_DIR, f)));
    fs.rmdirSync(ARCHIVE_DIR);
  }
}

const sampleRoutes = [{ method: 'GET', path: '/users', tag: 'users' }];

beforeEach(() => {
  cleanup();
  saveSnapshot('test-snap', { routes: sampleRoutes });
});

afterEach(cleanup);

test('archiveSnapshot creates archive file', () => {
  const name = archiveSnapshot('test-snap');
  expect(name).toMatch(/^test-snap__/);
  const archives = listArchives();
  expect(archives.length).toBe(1);
});

test('loadArchive returns snapshot data', () => {
  const name = archiveSnapshot('test-snap');
  const data = loadArchive(name);
  expect(data).toBeDefined();
  expect(data.routes).toEqual(sampleRoutes);
});

test('loadArchive returns null for missing archive', () => {
  expect(loadArchive('nonexistent')).toBeNull();
});

test('deleteArchive removes archive', () => {
  const name = archiveSnapshot('test-snap');
  const result = deleteArchive(name);
  expect(result).toBe(true);
  expect(listArchives().length).toBe(0);
});

test('deleteArchive returns false for missing archive', () => {
  expect(deleteArchive('ghost')).toBe(false);
});

test('archiveAll archives all snapshots', () => {
  saveSnapshot('snap-b', { routes: [] });
  const results = archiveAll();
  expect(results.length).toBeGreaterThanOrEqual(1);
  results.forEach(r => expect(r.archive).toMatch(new RegExp(`^${r.name}__`)));
});

test('listArchives returns empty when no archives', () => {
  expect(listArchives()).toEqual([]);
});
