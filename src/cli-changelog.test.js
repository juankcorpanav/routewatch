const { parseChangelogArgs } = require('./cli-changelog');
const { saveChangelog, listChangelogs } = require('./changelog');
const fs = require('fs');
const path = require('path');

const CHANGELOG_DIR = '.routewatch/changelogs';
function cleanup() {
  if (fs.existsSync(CHANGELOG_DIR)) {
    fs.readdirSync(CHANGELOG_DIR).forEach(f => fs.unlinkSync(path.join(CHANGELOG_DIR, f)));
  }
}

beforeEach(cleanup);
afterAll(cleanup);

test('list prints no changelogs message when empty', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  parseChangelogArgs(['list']);
  expect(spy).toHaveBeenCalledWith(expect.stringMatching(/No changelogs/));
  spy.mockRestore();
});

test('list prints filenames when entries exist', () => {
  const fakeDiff = { added: [], removed: [], changed: [] };
  saveChangelog('test-entry', fakeDiff);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  parseChangelogArgs(['list']);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('show errors without filename', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => parseChangelogArgs(['show'])).toThrow();
  spy.mockRestore();
  exit.mockRestore();
});

test('printChangelogUsage called on unknown command', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => parseChangelogArgs(['bogus'])).toThrow();
  spy.mockRestore();
  exit.mockRestore();
});
