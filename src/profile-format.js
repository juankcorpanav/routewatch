const { c } = require('./format');

function formatProfileList(profiles, active) {
  const names = Object.keys(profiles);
  if (names.length === 0) return c('dim', 'No profiles defined.');
  return names.map(name => {
    const marker = name === active ? c('green', '* ') : '  ';
    const p = profiles[name];
    const parts = [marker + c('bold', name)];
    if (p.baseUrl) parts.push(`  url: ${p.baseUrl}`);
    if (p.env) parts.push(`  env: ${p.env}`);
    if (p.snapshotDir) parts.push(`  snapshotDir: ${p.snapshotDir}`);
    return parts.join('\n');
  }).join('\n\n');
}

function formatProfileSet(name, profile) {
  return c('green', `Profile '${name}' saved.`) + '\n' +
    Object.entries(profile).map(([k, v]) => `  ${k}: ${v}`).join('\n');
}

function formatProfileRemoved(name) {
  return c('yellow', `Profile '${name}' removed.`);
}

function formatProfileActivated(name) {
  return c('green', `Active profile set to '${name}'.`);
}

function formatProfileNotFound(name) {
  return c('red', `Profile '${name}' not found.`);
}

module.exports = {
  formatProfileList,
  formatProfileSet,
  formatProfileRemoved,
  formatProfileActivated,
  formatProfileNotFound
};
