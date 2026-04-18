const fs = require('fs');
const path = require('path');
const { saveSnapshot, loadSnapshot, listSnapshots } = require('./snapshot');

const SNAPSHOT_DIR = '.routewatch';

function cleanup() {
  if (fs.existsSync(SNAPSHOT_DIR)) {
    fs.readdirSync(SNAPSHOT_DIR).forEach(f =>
      fs.unlinkSync(path.join(SNAPSHOT_DIR, f))
    );
    fs.rmdirSync(SNAPSHOT_DIR);
  }
}

beforeEach(cleanup);
afterAll(cleanup);

const sampleRoutes = [
  { method: 'GET', path: '/users' },
  { method: 'POST', path: '/users' },
  { method: 'DELETE', path: '/users/:id' },
];

test('saveSnapshot writes a JSON file', () => {
  const filePath = saveSnapshot('v1', sampleRoutes);
  expect(fs.existsSync(filePath)).toBe(true);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  expect(data.name).toBe('v1');
  expect(data.routes).toEqual(sampleRoutes);
  expect(data.timestamp).toBeDefined();
});

test('loadSnapshot returns saved snapshot', () => {
  saveSnapshot('v2', sampleRoutes);
  const snapshot = loadSnapshot('v2');
  expect(snapshot.name).toBe('v2');
  expect(snapshot.routes).toEqual(sampleRoutes);
});

test('loadSnapshot throws for missing snapshot', () => {
  expect(() => loadSnapshot('nonexistent')).toThrow('Snapshot "nonexistent" not found');
});

test('listSnapshots returns all saved snapshot names', () => {
  saveSnapshot('alpha', sampleRoutes);
  saveSnapshot('beta', sampleRoutes);
  const names = listSnapshots();
  expect(names).toContain('alpha');
  expect(names).toContain('beta');
});
