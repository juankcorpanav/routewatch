// env.js — manage named environments (e.g. staging, prod) for snapshots

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.resolve('.routewatch', 'environments.json');

function loadEnvs() {
  if (!fs.existsSync(ENV_FILE)) return {};
  return JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'));
}

function saveEnvs(envs) {
  const dir = path.dirname(ENV_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ENV_FILE, JSON.stringify(envs, null, 2));
}

function setEnv(name, url) {
  if (!name || !url) throw new Error('name and url are required');
  const envs = loadEnvs();
  envs[name] = { name, url, createdAt: new Date().toISOString() };
  saveEnvs(envs);
  return envs[name];
}

function getEnv(name) {
  const envs = loadEnvs();
  return envs[name] || null;
}

function removeEnv(name) {
  const envs = loadEnvs();
  if (!envs[name]) return false;
  delete envs[name];
  saveEnvs(envs);
  return true;
}

function listEnvs() {
  return Object.values(loadEnvs());
}

module.exports = { loadEnvs, saveEnvs, setEnv, getEnv, removeEnv, listEnvs };
