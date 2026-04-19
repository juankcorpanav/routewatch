const fs = require('fs');
const path = require('path');

const SCHEDULE_DIR = path.join(process.cwd(), '.routewatch');
const SCHEDULE_FILE = path.join(SCHEDULE_DIR, 'schedule.json');

function ensureScheduleDir() {
  if (!fs.existsSync(SCHEDULE_DIR)) fs.mkdirSync(SCHEDULE_DIR, { recursive: true });
}

function loadSchedules() {
  ensureScheduleDir();
  if (!fs.existsSync(SCHEDULE_FILE)) return [];
  return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
}

function saveSchedules(schedules) {
  ensureScheduleDir();
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

function addSchedule(name, interval, snapshotName) {
  const schedules = loadSchedules();
  const existing = schedules.findIndex(s => s.name === name);
  const entry = { name, interval, snapshotName, createdAt: new Date().toISOString() };
  if (existing >= 0) schedules[existing] = entry;
  else schedules.push(entry);
  saveSchedules(schedules);
  return entry;
}

function removeSchedule(name) {
  const schedules = loadSchedules();
  const filtered = schedules.filter(s => s.name !== name);
  saveSchedules(filtered);
  return filtered.length < schedules.length;
}

function getSchedule(name) {
  return loadSchedules().find(s => s.name === name) || null;
}

function listSchedules() {
  return loadSchedules();
}

module.exports = { loadSchedules, saveSchedules, addSchedule, removeSchedule, getSchedule, listSchedules };
