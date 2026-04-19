const fs = require('fs');
const path = require('path');

const PROFILE_DIR = path.join(process.cwd(), '.routewatch', 'profiles');

function ensureProfileDir() {
  if (!fs.existsSync(PROFILE_DIR)) {
    fs.mkdirSync(PROFILE_DIR, { recursive: true });
  }
}

function loadProfiles() {
  ensureProfileDir();
  const file = path.join(PROFILE_DIR, 'profiles.json');
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveProfiles(profiles) {
  ensureProfileDir();
  const file = path.join(PROFILE_DIR, 'profiles.json');
  fs.writeFileSync(file, JSON.stringify(profiles, null, 2));
}

function setProfile(name, data) {
  const profiles = loadProfiles();
  profiles[name] = { ...data, updatedAt: new Date().toISOString() };
  saveProfiles(profiles);
  return profiles[name];
}

function getProfile(name) {
  const profiles = loadProfiles();
  return profiles[name] || null;
}

function removeProfile(name) {
  const profiles = loadProfiles();
  if (!profiles[name]) return false;
  delete profiles[name];
  saveProfiles(profiles);
  return true;
}

function listProfiles() {
  return Object.entries(loadProfiles()).map(([name, data]) => ({ name, ...data }));
}

module.exports = { ensureProfileDir, loadProfiles, saveProfiles, setProfile, getProfile, removeProfile, listProfiles };
