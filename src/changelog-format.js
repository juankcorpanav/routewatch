const { c } = require('./format');

function formatChangelogList(filenames) {
  if (!filenames.length) return c('dim', 'No changelog entries found.');
  const lines = filenames.map((name, i) => `  ${c('cyan', String(i + 1).padStart(2, '0'))}  ${name}`);
  return [c('bold', 'Saved Changelogs:'), ...lines].join('\n');
}

function formatChangelogHeader(entry) {
  const { label, timestamp } = entry;
  return [
    c('bold', `Changelog: ${label || 'unnamed'}`),
    c('dim', `Recorded at: ${timestamp}`),
  ].join('\n');
}

function formatChangelogDiff(diff) {
  const lines = [];
  if (diff.added.length) {
    lines.push(c('green', `+ ${diff.added.length} route(s) added`));
    diff.added.forEach(r => lines.push(c('green', `    + [${r.method}] ${r.path}`)));
  }
  if (diff.removed.length) {
    lines.push(c('red', `- ${diff.removed.length} route(s) removed`));
    diff.removed.forEach(r => lines.push(c('red', `    - [${r.method}] ${r.path}`)));
  }
  if (diff.changed.length) {
    lines.push(c('yellow', `~ ${diff.changed.length} route(s) changed`));
    diff.changed.forEach(r => lines.push(c('yellow', `    ~ [${r.method}] ${r.path}`)));
  }
  if (!lines.length) lines.push(c('dim', 'No changes recorded.'));
  return lines.join('\n');
}

function formatFullChangelog(entry) {
  return [formatChangelogHeader(entry), formatChangelogDiff(entry.diff)].join('\n');
}

module.exports = { formatChangelogList, formatChangelogHeader, formatChangelogDiff, formatFullChangelog };
