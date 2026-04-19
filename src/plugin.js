const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = path.join(process.cwd(), '.routewatch', 'plugins');
const PLUGIN_REGISTRY = path.join(PLUGIN_DIR, 'registry.json');

function ensurePluginDir() {
  if (!fs.existsSync(PLUGIN_DIR)) fs.mkdirSync(PLUGIN_DIR, { recursive: true });
}

function loadRegistry() {
  ensurePluginDir();
  if (!fs.existsSync(PLUGIN_REGISTRY)) return {};
  return JSON.parse(fs.readFileSync(PLUGIN_REGISTRY, 'utf8'));
}

function saveRegistry(registry) {
  ensurePluginDir();
  fs.writeFileSync(PLUGIN_REGISTRY, JSON.stringify(registry, null, 2));
}

function registerPlugin(name, modulePath) {
  const registry = loadRegistry();
  registry[name] = { name, modulePath, registeredAt: new Date().toISOString() };
  saveRegistry(registry);
  return registry[name];
}

function removePlugin(name) {
  const registry = loadRegistry();
  if (!registry[name]) return false;
  delete registry[name];
  saveRegistry(registry);
  return true;
}

function getPlugin(name) {
  const registry = loadRegistry();
  return registry[name] || null;
}

function listPlugins() {
  return Object.values(loadRegistry());
}

function loadPlugin(name) {
  const entry = getPlugin(name);
  if (!entry) throw new Error(`Plugin not found: ${name}`);
  return require(path.resolve(entry.modulePath));
}

module.exports = { registerPlugin, removePlugin, getPlugin, listPlugins, loadPlugin };
