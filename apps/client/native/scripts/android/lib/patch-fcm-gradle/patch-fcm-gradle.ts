const GOOGLE_SERVICES_CLASSPATH = 'com.google.gms:google-services:4.4.2';

const GOOGLE_SERVICES_PLUGIN = 'com.google.gms.google-services';

/**
 * Adds the Google Services classpath to the root `build.gradle.kts`. Idempotent;
 * throws when the `buildscript { dependencies {` block is gone.
 */
export const addGoogleServicesClasspath = (gradle: string) => {
  if (gradle.includes('com.google.gms:google-services')) {
    return gradle;
  }

  const patched = gradle.replace(
    /(buildscript\s*\{[\s\S]*?dependencies\s*\{)/,
    `$1\n        classpath("${GOOGLE_SERVICES_CLASSPATH}")`
  );

  if (patched === gradle) {
    throw new Error('could not patch the buildscript block in build.gradle.kts');
  }

  return patched;
};

/**
 * Applies the Google Services plugin in `app/build.gradle.kts`, right after
 * `id("rust")`. Idempotent; throws when that anchor is gone.
 */
export const applyGoogleServicesPlugin = (gradle: string) => {
  if (gradle.includes(GOOGLE_SERVICES_PLUGIN)) {
    return gradle;
  }

  const patched = gradle.replace(
    /(plugins\s*\{[\s\S]*?id\("rust"\))/,
    `$1\n    id("${GOOGLE_SERVICES_PLUGIN}")`
  );

  if (patched === gradle) {
    throw new Error('could not patch the plugins block in app/build.gradle.kts');
  }

  return patched;
};
