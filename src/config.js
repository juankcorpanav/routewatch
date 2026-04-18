const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(process.cwd(), '.routewatch');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULTS = {
  snapshotDir: '.routewatch/snapshots',
  reportDir: '.routewatch/reports',
  changelogDir: '.routewatch/changelogs',
  defaultFormat: 'text',
  defaultExport: 'json',
  watchInterval: 5000,
};

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return { ...DEFAULTS };
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveConfig(config) {
  ensureConfigDir();
  const merged = { ...loadConfig(), ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2));
  return merged;
}

function getConfigValue(key) {
  const config = loadConfig();
  return config[key];
}

function setConfigValue(key, value) {
  if (!(key in DEFAULTS)) throw new Error(`Unknown config key: ${key}`);
  return saveConfig({ [key]: value });
}

function resetConfig() {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULTS, null, 2));
  return { ...DEFAULTS };
}

module.exports = { loadConfig, saveConfig, getConfigValue, setConfigValue, resetConfig, DEFAULTS };
