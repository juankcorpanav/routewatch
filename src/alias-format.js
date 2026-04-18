// alias-format.js — formatting helpers for alias output
const { c } = require('./format');

function formatAliasList(aliases) {
  const entries = Object.entries(aliases);
  if (entries.length === 0) return c('dim', '(no aliases defined)');
  return entries.map(([alias, snapshot]) =>
    `  ${c('cyan', alias)} ${c('dim', '->')} ${c('yellow', snapshot)}`
  ).join('\n');
}

function formatAliasSet(alias, snapshot) {
  return `${c('green', '✔')} Alias ${c('cyan', alias)} set to ${c('yellow', snapshot)}`;
}

function formatAliasRemoved(alias) {
  return `${c('red', '✖')} Alias ${c('cyan', alias)} removed`;
}

function formatAliasResolved(alias, snapshot) {
  return `${c('cyan', alias)} ${c('dim', '->')} ${c('yellow', snapshot)}`;
}

module.exports = { formatAliasList, formatAliasSet, formatAliasRemoved, formatAliasResolved };
