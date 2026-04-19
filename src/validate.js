// Validates snapshot data structure before saving or diffing

const VALID_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

function validateRoute(route, index) {
  const errors = [];
  if (!route || typeof route !== 'object') {
    return [`Route at index ${index} is not an object`];
  }
  if (!route.path || typeof route.path !== 'string') {
    errors.push(`Route[${index}]: missing or invalid 'path'`);
  } else if (!route.path.startsWith('/')) {
    errors.push(`Route[${index}]: 'path' must start with '/'`);
  }
  if (!route.method || typeof route.method !== 'string') {
    errors.push(`Route[${index}]: missing or invalid 'method'`);
  } else if (!VALID_METHODS.includes(route.method.toUpperCase())) {
    errors.push(`Route[${index}]: unknown method '${route.method}'`);
  }
  return errors;
}

function validateSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object') {
    return ['Snapshot must be a non-null object'];
  }
  if (!snapshot.name || typeof snapshot.name !== 'string') {
    errors.push("Snapshot missing required field 'name'");
  }
  if (!snapshot.timestamp || typeof snapshot.timestamp !== 'string') {
    errors.push("Snapshot missing required field 'timestamp'");
  }
  if (!Array.isArray(snapshot.routes)) {
    errors.push("Snapshot 'routes' must be an array");
  } else {
    snapshot.routes.forEach((route, i) => {
      errors.push(...validateRoute(route, i));
    });
  }
  return errors;
}

function assertValidSnapshot(snapshot) {
  const errors = validateSnapshot(snapshot);
  if (errors.length > 0) {
    throw new Error(`Invalid snapshot:\n  - ${errors.join('\n  - ')}`);
  }
}

module.exports = { validateRoute, validateSnapshot, assertValidSnapshot, VALID_METHODS };
