// Format helpers for env command output

const { c } = require('./format');

function formatEnvList(envs) {
  const keys = Object.keys(envs);
  if (keys.length === 0) {
    return c('  (no environments set)', 'dim');
  }
  return keys
    .map(k => `  ${c(k, 'cyan')} = ${c(envs[k], 'yellow')}`)
    .join('\n');
}

function formatEnvSet(key, value) {
  return `${c('✔', 'green')} Set env ${c(key, 'cyan')} = ${c(value, 'yellow')}`;
}

function formatEnvRemoved(key) {
  return `${c('✔', 'green')} Removed env ${c(key, 'cyan')}`;
}

function formatEnvResolved(key, value) {
  return `${c('→', 'blue')} ${c(key, 'cyan')} resolves to ${c(value, 'yellow')}`;
}

function formatEnvNotFound(key) {
  return `${c('✘', 'red')} Env ${c(key, 'cyan')} not found`;
}

module.exports = {
  formatEnvList,
  formatEnvSet,
  formatEnvRemoved,
  formatEnvResolved,
  formatEnvNotFound,
};
