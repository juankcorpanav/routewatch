const fs = require('fs');
const path = require('path');

const GROUPS_FILE = path.join('.routewatch', 'groups.json');

function loadGroups() {
  if (!fs.existsSync(GROUPS_FILE)) return {};
  return JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'));
}

function saveGroups(groups) {
  const dir = path.dirname(GROUPS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2));
}

function addSnapshotToGroup(groupName, snapshotName) {
  const groups = loadGroups();
  if (!groups[groupName]) groups[groupName] = [];
  if (!groups[groupName].includes(snapshotName)) {
    groups[groupName].push(snapshotName);
  }
  saveGroups(groups);
  return groups[groupName];
}

function removeSnapshotFromGroup(groupName, snapshotName) {
  const groups = loadGroups();
  if (!groups[groupName]) return null;
  groups[groupName] = groups[groupName].filter(s => s !== snapshotName);
  if (groups[groupName].length === 0) delete groups[groupName];
  saveGroups(groups);
  return groups[groupName] || [];
}

function getGroup(groupName) {
  const groups = loadGroups();
  return groups[groupName] || null;
}

function listGroups() {
  return loadGroups();
}

function deleteGroup(groupName) {
  const groups = loadGroups();
  if (!groups[groupName]) return false;
  delete groups[groupName];
  saveGroups(groups);
  return true;
}

module.exports = { loadGroups, saveGroups, addSnapshotToGroup, removeSnapshotFromGroup, getGroup, listGroups, deleteGroup };
