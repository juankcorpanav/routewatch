const fs = require('fs');
const path = require('path');

const PIN_FILE = path.join('.routewatch', 'pins.json');

function loadPins() {
  if (!fs.existsSync(PIN_FILE)) return {};
  return JSON.parse(fs.readFileSync(PIN_FILE, 'utf8'));
}

function savePins(pins) {
  const dir = path.dirname(PIN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PIN_FILE, JSON.stringify(pins, null, 2));
}

function pinSnapshot(name, label = null) {
  const pins = loadPins();
  pins[name] = { name, label: label || name, pinnedAt: new Date().toISOString() };
  savePins(pins);
  return pins[name];
}

function unpinSnapshot(name) {
  const pins = loadPins();
  if (!pins[name]) return false;
  delete pins[name];
  savePins(pins);
  return true;
}

function isPinned(name) {
  const pins = loadPins();
  return !!pins[name];
}

function listPins() {
  return Object.values(loadPins());
}

function getPin(name) {
  return loadPins()[name] || null;
}

module.exports = { loadPins, savePins, pinSnapshot, unpinSnapshot, isPinned, listPins, getPin };
