const fs = require('fs');
const path = require('path');
const { addSchedule, removeSchedule, getSchedule, listSchedules, loadSchedules } = require('./schedule');

const SCHEDULE_FILE = path.join(process.cwd(), '.routewatch', 'schedule.json');

function cleanup() {
  if (fs.existsSync(SCHEDULE_FILE)) fs.unlinkSync(SCHEDULE_FILE);
}

beforeEach(cleanup);
afterAll(cleanup);

test('addSchedule adds a new entry', () => {
  const entry = addSchedule('nightly', '24h', 'prod');
  expect(entry.name).toBe('nightly');
  expect(entry.interval).toBe('24h');
  expect(entry.snapshotName).toBe('prod');
});

test('addSchedule overwrites existing entry with same name', () => {
  addSchedule('nightly', '24h', 'prod');
  addSchedule('nightly', '12h', 'staging');
  const schedules = listSchedules();
  expect(schedules.length).toBe(1);
  expect(schedules[0].interval).toBe('12h');
});

test('listSchedules returns all entries', () => {
  addSchedule('a', '1h', 'snap1');
  addSchedule('b', '2h', 'snap2');
  expect(listSchedules().length).toBe(2);
});

test('getSchedule returns correct entry', () => {
  addSchedule('weekly', '168h', 'prod');
  const s = getSchedule('weekly');
  expect(s).not.toBeNull();
  expect(s.snapshotName).toBe('prod');
});

test('getSchedule returns null for missing', () => {
  expect(getSchedule('missing')).toBeNull();
});

test('removeSchedule removes entry', () => {
  addSchedule('temp', '1h', 'snap');
  const removed = removeSchedule('temp');
  expect(removed).toBe(true);
  expect(listSchedules().length).toBe(0);
});

test('removeSchedule returns false if not found', () => {
  expect(removeSchedule('ghost')).toBe(false);
});
