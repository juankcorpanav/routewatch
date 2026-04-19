const fs = require('fs');
const path = require('path');
const { pinSnapshot, unpinSnapshot, isPinned, listPins, getPin } = require('./snapshot-pin');

const PIN_FILE = path.join('.routewatch', 'pins.json');

function cleanup() {
  if (fs.existsSync(PIN_FILE)) fs.unlinkSync(PIN_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('pinSnapshot creates a pin entry', () => {
  const pin = pinSnapshot('snap-a', 'My Label');
  expect(pin.name).toBe('snap-a');
  expect(pin.label).toBe('My Label');
  expect(pin.pinnedAt).toBeDefined();
});

test('pinSnapshot uses name as label if none given', () => {
  const pin = pinSnapshot('snap-b');
  expect(pin.label).toBe('snap-b');
});

test('isPinned returns true for pinned snapshot', () => {
  pinSnapshot('snap-c');
  expect(isPinned('snap-c')).toBe(true);
});

test('isPinned returns false for unknown snapshot', () => {
  expect(isPinned('no-such-snap')).toBe(false);
});

test('unpinSnapshot removes a pin', () => {
  pinSnapshot('snap-d');
  const result = unpinSnapshot('snap-d');
  expect(result).toBe(true);
  expect(isPinned('snap-d')).toBe(false);
});

test('unpinSnapshot returns false if not pinned', () => {
  expect(unpinSnapshot('ghost')).toBe(false);
});

test('listPins returns all pins', () => {
  pinSnapshot('snap-e');
  pinSnapshot('snap-f');
  const pins = listPins();
  expect(pins.length).toBe(2);
});

test('getPin returns pin by name', () => {
  pinSnapshot('snap-g', 'G Label');
  const pin = getPin('snap-g');
  expect(pin.label).toBe('G Label');
});

test('getPin returns null for missing pin', () => {
  expect(getPin('nope')).toBeNull();
});
