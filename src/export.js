const fs = require('fs');
const path = require('path');

function toCSV(diffResult) {
  const rows = ['status,method,path,field,from,to'];

  for (const route of diffResult.added) {
    rows.push(`added,${route.method},${route.path},,`);
  }

  for (const route of diffResult.removed) {
    rows.push(`removed,${route.method},${route.path},,`);
  }

  for (const change of diffResult.changed) {
    for (const field of change.fields) {
      const from = JSON.stringify(field.from ?? '').replace(/,/g, ';');
      const to = JSON.stringify(field.to ?? '').replace(/,/g, ';');
      rows.push(`changed,${change.method},${change.path},${field.name},${from},${to}`);
    }
  }

  return rows.join('\n');
}

function toJSON(diffResult) {
  return JSON.stringify(diffResult, null, 2);
}

function toMarkdown(diffResult) {
  const lines = ['# RouteWatch Diff Report', ''];

  if (diffResult.added.length) {
    lines.push('## Added Routes');
    for (const r of diffResult.added) lines.push(`- \`${r.method} ${r.path}\``);
    lines.push('');
  }

  if (diffResult.removed.length) {
    lines.push('## Removed Routes');
    for (const r of diffResult.removed) lines.push(`- \`${r.method} ${r.path}\``);
    lines.push('');
  }

  if (diffResult.changed.length) {
    lines.push('## Changed Routes');
    for (const c of diffResult.changed) {
      lines.push(`### \`${c.method} ${c.path}\``);
      for (const f of c.fields) {
        lines.push(`- **${f.name}**: \`${JSON.stringify(f.from)}\` → \`${JSON.stringify(f.to)}\``);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function exportDiff(diffResult, format) {
  switch (format) {
    case 'csv': return toCSV(diffResult);
    case 'md':
    case 'markdown': return toMarkdown(diffResult);
    case 'json':
    default: return toJSON(diffResult);
  }
}

module.exports = { toCSV, toJSON, toMarkdown, exportDiff };
