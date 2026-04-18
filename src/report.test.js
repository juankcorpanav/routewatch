const fs = require('fs');
const path = require('path');
const { saveReport, listReports, loadReport, REPORT_DIR } = require('./report');

function cleanup() {
  if (fs.existsSync(REPORT_DIR)) {
    fs.readdirSync(REPORT_DIR).forEach((f) => fs.unlinkSync(path.join(REPORT_DIR, f)));
    fs.rmdirSync(REPORT_DIR);
  }
}

const sampleDiff = {
  added: [{ method: 'GET', path: '/health' }],
  removed: [],
  changed: [],
};

beforeEach(cleanup);
afterAll(cleanup);

describe('saveReport', () => {
  it('creates a .txt file in the report dir', () => {
    const filepath = saveReport('v1', 'v2', sampleDiff);
    expect(fs.existsSync(filepath)).toBe(true);
    expect(filepath.endsWith('.txt')).toBe(true);
  });

  it('file contains from/to labels', () => {
    const filepath = saveReport('staging', 'prod', sampleDiff);
    const content = fs.readFileSync(filepath, 'utf8');
    expect(content).toContain('From: staging');
    expect(content).toContain('To:   prod');
  });

  it('file contains route info without ANSI codes', () => {
    const filepath = saveReport('a', 'b', sampleDiff);
    const content = fs.readFileSync(filepath, 'utf8');
    expect(content).not.toMatch(/\x1b\[/);
    expect(content).toContain('/health');
  });
});

describe('listReports', () => {
  it('returns empty array when no reports exist', () => {
    expect(listReports()).toEqual([]);
  });

  it('returns saved report filenames', () => {
    saveReport('x', 'y', sampleDiff);
    const list = listReports();
    expect(list.length).toBe(1);
    expect(list[0]).toMatch(/^diff_x_y_/);
  });
});

describe('loadReport', () => {
  it('throws if report does not exist', () => {
    expect(() => loadReport('nonexistent.txt')).toThrow('Report not found');
  });

  it('returns file content as string', () => {
    saveReport('m', 'n', sampleDiff);
    const [name] = listReports();
    const content = loadReport(name);
    expect(typeof content).toBe('string');
    expect(content).toContain('RouteWatch Diff Report');
  });
});
