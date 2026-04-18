// annotate.js — add or update metadata annotations on routes in a snapshot

function annotateRoute(route, annotations) {
  return { ...route, ...annotations };
}

function annotateByMethod(snapshot, method, annotations) {
  return snapshot.map(route =>
    route.method && route.method.toUpperCase() === method.toUpperCase()
      ? annotateRoute(route, annotations)
      : route
  );
}

function annotateByPrefix(snapshot, prefix, annotations) {
  return snapshot.map(route =>
    route.path && route.path.startsWith(prefix)
      ? annotateRoute(route, annotations)
      : route
  );
}

function annotateByTag(snapshot, tag, annotations) {
  return snapshot.map(route =>
    Array.isArray(route.tags) && route.tags.includes(tag)
      ? annotateRoute(route, annotations)
      : route
  );
}

function applyAnnotations(snapshot, rules) {
  let result = [...snapshot];
  for (const rule of rules) {
    if (rule.method) result = annotateByMethod(result, rule.method, rule.annotations);
    else if (rule.prefix) result = annotateByPrefix(result, rule.prefix, rule.annotations);
    else if (rule.tag) result = annotateByTag(result, rule.tag, rule.annotations);
  }
  return result;
}

module.exports = { annotateRoute, annotateByMethod, annotateByPrefix, annotateByTag, applyAnnotations };
