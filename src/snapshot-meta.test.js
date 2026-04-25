const fs = require('fs');
const path = require('path');
const {
  loadMeta,
  saveMeta,
  setMetaField,
  getMetaField,
  removeMetaField,
  clearMeta,
  metaFilePath,
} = require('./snapshot-meta');

const META_DIR = path.join('.routewatch', 'meta');

function cleanup(name) {
  const f = metaFilePath(name);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}

describe('snapshot-meta', () => {
  const snap = 'test-snap-meta';

  afterEach(() => cleanup(snap));

  test('loadMeta returns empty object for missing file', () => {
    expect(loadMeta('nonexistent-snap')).toEqual({});
  });

  test('saveMeta and loadMeta round-trip', () => {
    saveMeta(snap, { env: 'staging', version: '1.2.3' });
    const meta = loadMeta(snap);
    expect(meta.env).toBe('staging');
    expect(meta.version).toBe('1.2.3');
  });

  test('setMetaField adds a field and updatedAt', () => {
    const meta = setMetaField(snap, 'author', 'alice');
    expect(meta.author).toBe('alice');
    expect(meta.updatedAt).toBeDefined();
  });

  test('getMetaField retrieves a specific field', () => {
    setMetaField(snap, 'region', 'us-east-1');
    expect(getMetaField(snap, 'region')).toBe('us-east-1');
  });

  test('getMetaField returns undefined for missing key', () => {
    expect(getMetaField(snap, 'missing')).toBeUndefined();
  });

  test('removeMetaField deletes a field', () => {
    setMetaField(snap, 'env', 'prod');
    removeMetaField(snap, 'env');
    expect(getMetaField(snap, 'env')).toBeUndefined();
  });

  test('removeMetaField returns null if field does not exist', () => {
    saveMeta(snap, {});
    expect(removeMetaField(snap, 'ghost')).toBeNull();
  });

  test('clearMeta removes the meta file', () => {
    saveMeta(snap, { foo: 'bar' });
    const result = clearMeta(snap);
    expect(result).toBe(true);
    expect(loadMeta(snap)).toEqual({});
  });

  test('clearMeta returns false if no meta file exists', () => {
    expect(clearMeta('no-such-snap')).toBe(false);
  });
});
