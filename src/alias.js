// alias.js — assign human-readable aliases to snapshots
const fs = require('fs');
const path = require('path');

const ALIAS_FILE = path.join('.routewatch', 'aliases.json');

function loadAliases() {
  if (!fs.existsSync(ALIAS_FILE)) return {};
  return JSON.parse(fs.readFileSync(ALIAS_FILE, 'utf8'));
}

function saveAliases(aliases) {
  const dir = path.dirname(ALIAS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ALIAS_FILE, JSON.stringify(aliases, null, 2));
}

function setAlias(alias, snapshotName) {
  const aliases = loadAliases();
  aliases[alias] = snapshotName;
  saveAliases(aliases);
}

function getAlias(alias) {
  const aliases = loadAliases();
  return aliases[alias] || null;
}

function removeAlias(alias) {
  const aliases = loadAliases();
  delete aliases[alias];
  saveAliases(aliases);
}

function listAliases() {
  return loadAliases();
}

function resolveAlias(nameOrAlias) {
  return getAlias(nameOrAlias) || nameOrAlias;
}

module.exports = { setAlias, getAlias, removeAlias, listAliases, resolveAlias };
