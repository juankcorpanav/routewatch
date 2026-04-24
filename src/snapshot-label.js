const fs = require('fs');
const path = require('path');

const LABELS_DIR = path.join('.routewatch', 'labels');
const LABELS_FILE = path.join(LABELS_DIR, 'labels.json');

function ensureLabelsDir() {
  if (!fs.existsSync(LABELS_DIR)) {
    fs.mkdirSync(LABELS_DIR, { recursive: true });
  }
}

function loadLabels() {
  ensureLabelsDir();
  if (!fs.existsSync(LABELS_FILE)) return {};
  return JSON.parse(fs.readFileSync(LABELS_FILE, 'utf8'));
}

function saveLabels(labels) {
  ensureLabelsDir();
  fs.writeFileSync(LABELS_FILE, JSON.stringify(labels, null, 2));
}

function setLabel(snapshotName, label) {
  const labels = loadLabels();
  if (!labels[snapshotName]) labels[snapshotName] = [];
  if (!labels[snapshotName].includes(label)) {
    labels[snapshotName].push(label);
  }
  saveLabels(labels);
  return labels[snapshotName];
}

function removeLabel(snapshotName, label) {
  const labels = loadLabels();
  if (!labels[snapshotName]) return false;
  const before = labels[snapshotName].length;
  labels[snapshotName] = labels[snapshotName].filter(l => l !== label);
  if (labels[snapshotName].length === 0) delete labels[snapshotName];
  saveLabels(labels);
  return labels[snapshotName] === undefined
    ? before > 0
    : before !== (labels[snapshotName] || []).length;
}

function getLabels(snapshotName) {
  const labels = loadLabels();
  return labels[snapshotName] || [];
}

function findByLabel(label) {
  const labels = loadLabels();
  return Object.entries(labels)
    .filter(([, lbls]) => lbls.includes(label))
    .map(([name]) => name);
}

function clearLabels(snapshotName) {
  const labels = loadLabels();
  delete labels[snapshotName];
  saveLabels(labels);
}

module.exports = { loadLabels, saveLabels, setLabel, removeLabel, getLabels, findByLabel, clearLabels };
