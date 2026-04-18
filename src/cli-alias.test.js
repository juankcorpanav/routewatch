const fs = require('fs');
const path = require('path');
const { handleAlias } = require('./cli-alias');
const { getAlias, listAliases } = require('./alias');

const ALIAS_FILE = path.join('.routewatch', 'aliases.json');

function cleanup() {
  if (fs.existsSync(ALIAS_FILE)) fs.unlinkSync(ALIAS_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('set alias via handleAlias', () => {
  handleAlias(['set', 'prod', 'snap-prod-1']);
  expect(getAlias('prod')).toBe('snap-prod-1');
});

test('list aliases via handleAlias', () => {
  handleAlias(['set', 'x', 'snap-x']);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleAlias(['list']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('snap-x'));
  spy.mockRestore();
});

test('get alias via handleAlias', () => {
  handleAlias(['set', 'env', 'snap-env']);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleAlias(['get', 'env']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('snap-env'));
  spy.mockRestore();
});

test('remove alias via handleAlias', () => {
  handleAlias(['set', 'tmp', 'snap-tmp']);
  handleAlias(['remove', 'tmp']);
  expect(getAlias('tmp')).toBeNull();
});
