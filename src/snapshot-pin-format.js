const { c } = require('./format');

function formatPinned(pin) {
  return `${c('green', '\u25cf')} Pinned: ${c('bold', pin.name)} (${pin.label}) at ${pin.pinnedAt}`;
}

function formatUnpinned(name) {
  return `${c('yellow', '\u25cb')} Unpinned: ${c('bold', name)}`;
}

function formatPinNotFound(name) {
  return `${c('red', 'x')} No pin found for: ${c('bold', name)}`;
}

function formatPinList(pins) {
  if (!pins.length) return c('dim', 'No pinned snapshots.');
  return pins.map(p => `  ${c('green', '\u25cf')} ${c('bold', p.name)}  ${c('dim', p.label !== p.name ? `[${p.label}]` : '')}  ${c('dim', p.pinnedAt)}`).join('\n');
}

module.exports = { formatPinned, formatUnpinned, formatPinNotFound, formatPinList };
