// report.js — generate and write diff reports to disk

const fs = require('fs');
const path = require('path');
const { formatDiffSummary } = require('./format');

const REPORT_DIR = path.resolve(process.cwd(), '.routewatch', 'reports');

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

function buildReportFilename(fromLabel, toLabel) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return `diff_${fromLabel}_${toLabel}_${ts}.txt`;
}

function saveReport(fromLabel, toLabel, diff) {
  ensureReportDir();
  const filename = buildReportFilename(fromLabel, toLabel);
  const filepath = path.join(REPORT_DIR, filename);

  const header = [
    `RouteWatch Diff Report`,
    `From: ${fromLabel}`,
    `To:   ${toLabel}`,
    `Date: ${new Date().toISOString()}`,
    '─'.repeat(40),
    '',
  ].join('\n');

  // strip ANSI for file output
  const body = formatDiffSummary(diff).replace(/\x1b\[[0-9;]*m/g, '');
  fs.writeFileSync(filepath, header + body + '\n', 'utf8');
  return filepath;
}

function listReports() {
  ensureReportDir();
  return fs.readdirSync(REPORT_DIR).filter((f) => f.endsWith('.txt')).sort();
}

function loadReport(filename) {
  const filepath = path.join(REPORT_DIR, filename);
  if (!fs.existsSync(filepath)) throw new Error(`Report not found: ${filename}`);
  return fs.readFileSync(filepath, 'utf8');
}

module.exports = { saveReport, listReports, loadReport, REPORT_DIR };
