const { c } = require('./format');

function formatArchiveCreated(archiveName) {
  return `${c('✔', 'green')} Archived as ${c(archiveName, 'cyan')}`;
}

function formatArchiveDeleted(archiveName) {
  return `${c('✔', 'green')} Deleted archive ${c(archiveName, 'cyan')}`;
}

function formatArchiveNotFound(archiveName) {
  return `${c('✖', 'red')} Archive not found: ${c(archiveName, 'yellow')}`;
}

function formatArchiveList(archives) {
  if (!archives.length) return c('No archives found.', 'yellow');
  const lines = [c('Archives:', 'bold')];
  for (const a of archives) {
    lines.push(`  ${c('•', 'cyan')} ${a}`);
  }
  return lines.join('\n');
}

function formatArchiveAllSummary(results) {
  if (!results.length) return c('No snapshots to archive.', 'yellow');
  const lines = [c(`Archived ${results.length} snapshot(s):`, 'green')];
  for (const { name, archive } of results) {
    lines.push(`  ${c('•', 'cyan')} ${name} → ${archive}`);
  }
  return lines.join('\n');
}

module.exports = { formatArchiveCreated, formatArchiveDeleted, formatArchiveNotFound, formatArchiveList, formatArchiveAllSummary };
