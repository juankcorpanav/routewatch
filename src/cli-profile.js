const { setProfile, getProfile, removeProfile, loadProfiles, listProfiles } = require('./profile');
const {
  formatProfileList,
  formatProfileSet,
  formatProfileRemoved,
  formatProfileActivated,
  formatProfileNotFound
} = require('./profile-format');

function printProfileUsage() {
  console.log(`
Usage: routewatch profile <subcommand> [options]

Subcommands:
  list                     List all profiles
  set <name> [key=value]   Create or update a profile
  get <name>               Show a profile
  remove <name>            Remove a profile
  use <name>               Set the active profile

Examples:
  routewatch profile set dev baseUrl=http://localhost:3000 env=development
  routewatch profile use dev
  routewatch profile list
`);
}

async function handleProfile(args) {
  const [sub, name, ...rest] = args;

  if (!sub || sub === 'list') {
    const { profiles, active } = await loadProfiles();
    console.log(formatProfileList(profiles, active));
    return;
  }

  if (sub === 'set') {
    if (!name) { printProfileUsage(); return; }
    const fields = {};
    for (const kv of rest) {
      const [k, ...vparts] = kv.split('=');
      fields[k] = vparts.join('=');
    }
    await setProfile(name, fields);
    console.log(formatProfileSet(name, fields));
    return;
  }

  if (sub === 'get') {
    if (!name) { printProfileUsage(); return; }
    const profile = await getProfile(name);
    if (!profile) { console.log(formatProfileNotFound(name)); return; }
    console.log(formatProfileSet(name, profile));
    return;
  }

  if (sub === 'remove') {
    if (!name) { printProfileUsage(); return; }
    const profile = await getProfile(name);
    if (!profile) { console.log(formatProfileNotFound(name)); return; }
    await removeProfile(name);
    console.log(formatProfileRemoved(name));
    return;
  }

  if (sub === 'use') {
    if (!name) { printProfileUsage(); return; }
    const profile = await getProfile(name);
    if (!profile) { console.log(formatProfileNotFound(name)); return; }
    const profiles = await loadProfiles();
    profiles.active = name;
    const { saveProfiles } = require('./profile');
    await saveProfiles(profiles);
    console.log(formatProfileActivated(name));
    return;
  }

  printProfileUsage();
}

module.exports = { printProfileUsage, handleProfile };
