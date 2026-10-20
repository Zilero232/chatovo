const VERSION_NAME_LINE = /^ {8}versionName = .*$/m;

const NDK_BLOCK = '\n        ndk {\n            debugSymbolLevel = "FULL"\n        }';

const RELEASE_SIGNING = 'signingConfig = signingConfigs.getByName("release")';

/**
 * Rewrites the `build.gradle.kts` that `tauri android init` generates: release
 * signing plus native debug symbols. Idempotent — running it twice is a no-op.
 * Throws when the generated file no longer matches what the patches expect.
 */
export const patchAndroidGradle = ({ gradle, signingSnippet }) => {
  let next = gradle;

  if (!next.includes('import java.io.FileInputStream')) {
    next = next.replace(
      'import java.util.Properties',
      'import java.io.FileInputStream\nimport java.util.Properties'
    );
  }

  if (next.includes('signingConfigs')) {
    next = next.replace(/ {4}signingConfigs \{[\s\S]*?\r?\n {4}\}\r?\n/, signingSnippet);
  } else {
    next = next.replace('    buildTypes {', `${signingSnippet}    buildTypes {`);
  }

  if (!next.includes(RELEASE_SIGNING)) {
    next = next.replace(
      'getByName("release") {',
      `getByName("release") {\n            ${RELEASE_SIGNING}`
    );
  }

  if (!next.includes('debugSymbolLevel')) {
    if (!VERSION_NAME_LINE.test(next)) {
      throw new Error('defaultConfig versionName not found, cannot place the ndk block');
    }

    next = next.replace(VERSION_NAME_LINE, (line) => `${line}${NDK_BLOCK}`);
  }

  return next;
};
