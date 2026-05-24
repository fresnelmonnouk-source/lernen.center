// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// @supabase/supabase-js (v2.106+) ships an optional OpenTelemetry tracer that its
// ESM build (dist/index.mjs) lazy-loads via a dynamic `import(variable)`. Hermes
// cannot compile that expression ("Invalid expression encountered"), which breaks
// the Android/iOS bundle the moment Supabase is imported. The CJS build uses a
// plain require() instead (Hermes-safe and gracefully no-ops when OTel is absent),
// so force resolution of the package entry to CJS.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@supabase/supabase-js') {
    return context.resolveRequest(context, '@supabase/supabase-js/dist/index.cjs', platform);
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
